

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel
import base64, random, os, json, io, re
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import psycopg2
from psycopg2.extras import RealDictCursor
import bcrypt
from difflib import get_close_matches
import fitz         
import pdfplumber   
from PIL import Image  
import openpyxl      
DB_CONFIG = {
    "host":            os.getenv("SUPABASE_DB_HOST",     "aws-1-ap-northeast-1.pooler.supabase.com"),
    "port":            int(os.getenv("SUPABASE_DB_PORT", "5432")),
    "dbname":          os.getenv("SUPABASE_DB_NAME",     "postgres"),
    "user":            os.getenv("SUPABASE_DB_USER",     "postgres.pumdddnkccxxvewuslfc"),
    "password":        os.getenv("SUPABASE_DB_PASSWORD", "J0kNzsuK43kU6C6W"),
    "sslmode":         "require",
    "connect_timeout": 10,
}

def get_db():
    return psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
hsn_vectorizer: Optional[TfidfVectorizer] = None
hsn_classifier  = None
doc_counter = 1
def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode(), hashed.encode())
    except Exception:
        return False
def create_token(username: str, role: str) -> str:
    raw = f"{username}:{role}:{datetime.utcnow().timestamp()}:{random.randint(1000,9999)}"
    return base64.urlsafe_b64encode(raw.encode()).decode()

def verify_token(token: str):
    try:
        parts = base64.urlsafe_b64decode(token.encode()).decode().split(":")
        if len(parts) >= 2:
            return {"sub": parts[0], "role": parts[1]}
    except Exception:
        pass
    return None

security = HTTPBearer()

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_token(creds.credentials)
    if not payload:
        raise HTTPException(401, "Invalid or expired token")
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM users WHERE username = %s AND is_active = true",
                (payload["sub"],),
            )
            user = cur.fetchone()
    finally:
        conn.close()
    if not user:
        raise HTTPException(401, "User not found")
    return dict(user)

def _update_last_login(username: str):
    try:
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute("UPDATE users SET last_login = NOW() WHERE username = %s", (username,))
        conn.commit()
        conn.close()
    except Exception:
        pass

def _extract_text_from_file(content: bytes, filename: str) -> str:
    """
    Extract raw text from any supported file type.
    PDF  → pdfplumber (best) with fitz fallback
    PNG/JPG → fitz or PIL metadata (no OCR engine needed for digital images)
    CSV  → decode directly
    XLSX → openpyxl
    Returns plain text string.
    """
    fname = filename.lower()
    if fname.endswith(".pdf"):
        text = ""
       
        try:
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                pages = []
                for page in pdf.pages:
                    t = page.extract_text()
                    if t:
                        pages.append(t)
                text = "\n".join(pages)
        except Exception:
            pass

        
        if not text.strip():
            try:
                doc = fitz.open(stream=content, filetype="pdf")
                for page in doc:
                    text += page.get_text()
                doc.close()
            except Exception:
                pass

        return text.strip()

   
    if fname.endswith((".png", ".jpg", ".jpeg")):
        text = ""
        try:
         
            doc = fitz.open(stream=content, filetype="png" if fname.endswith(".png") else "jpeg")
            for page in doc:
                text += page.get_text()
            doc.close()
        except Exception:
            pass

       
        if not text.strip():
            try:
                img = Image.open(io.BytesIO(content))
                info = img.info or {}
                parts = []
                for k, v in info.items():
                    if isinstance(v, str) and len(v) > 3:
                        parts.append(f"{k}: {v}")
                text = "\n".join(parts)
            except Exception:
                pass

        return text.strip()

   
    if fname.endswith(".csv"):
        try:
            return content.decode("utf-8", errors="ignore")[:6000]
        except Exception:
            return ""

  
    if fname.endswith(".xlsx"):
        try:
            wb   = openpyxl.load_workbook(io.BytesIO(content), data_only=True)
            ws   = wb.active
            rows = []
            for row in ws.iter_rows(values_only=True):
                rows.append("\t".join("" if c is None else str(c) for c in row))
                if len(rows) >= 100:
                    break
            return "\n".join(rows)
        except Exception:
            return ""

    raise ValueError(
        f"Unsupported file type: '{filename}'. "
        "Supported: PDF, PNG, JPG, JPEG, CSV, XLSX"
    )


def _parse_invoice_fields(text: str) -> dict:
    """
    Extract structured invoice fields from plain text using regex.
    All fields default to None if not found.
    """
    def first(pattern, flags=re.IGNORECASE):
        m = re.search(pattern, text, flags)
        return m.group(1).strip() if m else None

    def first_amount(pattern):
        m = re.search(pattern, text, re.IGNORECASE)
        if not m:
            return None
        try:
            return float(m.group(1).replace(",", "").strip())
        except ValueError:
            return None

    DATE_PAT = (
        r'(\d{4}[-/]\d{2}[-/]\d{2}'
        r'|\d{1,2}[-/]\d{1,2}[-/]\d{2,4}'
        r'|\d{1,2}\s+\w{3,9}\s+\d{4})'
    )

  
    invoice_number = (
        first(r'invoice\s*(?:no|num|number|#)[:\s#]*([\w\-/]+)') or
        first(r'\bINV[-\s]*([\w\-/]{3,20})', re.IGNORECASE)
    )

  
    invoice_date = (
        first(r'(?:invoice\s*date|date\s*of\s*invoice|bill\s*date)[:\s]*' + DATE_PAT) or
        first(DATE_PAT)
    )
    due_date = first(r'(?:due\s*date|payment\s*due|pay\s*by)[:\s]*' + DATE_PAT)

  
    total_amount = first_amount(
        r'(?:grand\s*total|total\s*(?:amount\s*)?(?:due|payable)?|amount\s*due)[:\s]*'
        r'[₹$€£¥]?\s*([0-9,]+(?:\.\d{1,2})?)'
    )
    subtotal = first_amount(
        r'(?:sub\s*total|subtotal|net\s*amount)[:\s]*[₹$€£¥]?\s*([0-9,]+(?:\.\d{1,2})?)'
    )
    tax_amount = first_amount(
        r'(?:tax|gst|vat|igst|cgst|sgst|hst)[^:\n]{0,20}[:\s]*[₹$€£¥]?\s*([0-9,]+(?:\.\d{1,2})?)'
    )

 
    if total_amount is None:
        amounts = [
            float(m.replace(",", ""))
            for m in re.findall(r'\b([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)\b', text)
            if float(m.replace(",", "")) > 0
        ]
        total_amount = max(amounts) if amounts else None

  
    currency = first(r'\b(USD|EUR|GBP|INR|AED|SGD|CAD|AUD|JPY|CNY)\b')
    if not currency:
        if re.search(r'₹|INR|Rs\.?', text, re.IGNORECASE):
            currency = "INR"
        elif re.search(r'\$', text):
            currency = "USD"
        elif re.search(r'€', text):
            currency = "EUR"
        elif re.search(r'£', text):
            currency = "GBP"
        else:
            currency = "USD"

   
    vendor_name   = first(r'(?:from|seller|vendor|billed?\s*from|company)[:\s]*([A-Za-z][^\n]{2,60})')
    customer_name = first(r'(?:bill\s*to|billed?\s*to|buyer|customer|ship\s*to)[:\s]*([A-Za-z][^\n]{2,60})')
    payment_terms = first(r'(?:payment\s*terms?|terms?)[:\s]*([^\n]{2,40})')

   
    line_items = []
    for m in re.finditer(
        r'^(.{4,55}?)\s{2,}(\d+(?:\.\d+)?)\s+([0-9,]+\.\d{2})\s+([0-9,]+\.\d{2})\s*$',
        text, re.MULTILINE
    ):
        try:
            line_items.append({
                "description": m.group(1).strip(),
                "quantity":    float(m.group(2)),
                "unit_price":  float(m.group(3).replace(",", "")),
                "amount":      float(m.group(4).replace(",", "")),
            })
        except ValueError:
            pass

    return {
        "invoice_number": invoice_number,
        "date":           invoice_date,
        "due_date":       due_date,
        "vendor_name":    vendor_name,
        "customer_name":  customer_name,
        "subtotal":       subtotal,
        "tax_amount":     tax_amount,
        "total_amount":   total_amount,
        "currency":       currency,
        "payment_terms":  payment_terms,
        "line_items":     line_items,
    }


def _compute_confidence(extracted: dict, raw_text: str) -> float:
    """
    Confidence = how many key fields were found + text length factor.
    """
    key_fields = ["invoice_number", "date", "total_amount", "vendor_name"]
    found      = sum(1 for f in key_fields if extracted.get(f))
    field_score = found / len(key_fields)

  
    text_score = min(len(raw_text) / 500, 1.0) * 0.2

    return round(min(field_score * 0.8 + text_score, 1.0), 2)


def run_ocr(content: bytes, filename: str) -> tuple[dict, float]:
    """
    Main OCR entry point.
    Returns (extracted_data dict, confidence float 0.0–1.0).
    """
    raw_text  = _extract_text_from_file(content, filename)
    extracted = _parse_invoice_fields(raw_text)
    conf      = _compute_confidence(extracted, raw_text)

    extracted["_raw_ocr_text"] = raw_text[:2000] if raw_text else "(no text extracted)"

    return extracted, conf
VOCAB = [
    "speaker","phone","tablet","laptop","computer","camera","watch","headphones",
    "earbuds","printer","calculator","medicine","tablet","vehicle","garment","machinery",
    "smartphone","refrigerator","television","washing","machine","conditioner",
    "furniture","footwear","shoes","battery","powerbank","earphones","monitor",
    "keyboard","mouse","router","modem","projector","scanner","copier",
]

def clean_text(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    words = text.split()
    corrected = []
    for w in words:
        match = get_close_matches(w, VOCAB, n=1, cutoff=0.82)
        corrected.append(match[0] if match else w)
    return " ".join(corrected)
KEYWORD_RULES: list[tuple[list[str], str]] = [
    (["laptop","notebook","macbook","thinkpad","chromebook","netbook","ultrabook","desktop pc","desktop computer"], "84713000"),
    (["ipad","tablet","galaxy tab","lenovo tab","xiaomi pad","android tablet","windows tablet"], "84713010"),
    (["iphone","galaxy s","oneplus","realme","vivo","oppo","pixel phone","xiaomi phone","mobile phone","smartphone","android phone","5g phone"], "85171300"),
    (["calculator","casio fx","scientific calculator","graphing calculator","financial calculator"], "84701000"),
    (["paracetamol","ibuprofen","aspirin","amoxicillin","insulin","antibiotic","medicine","tablet medicine","capsule","syrup","pharma","drug","vitamin"], "30049099"),
    (["car","sedan","suv","hatchback","crossover","maruti","hyundai","toyota","honda","mahindra","tata vehicle","electric vehicle","diesel vehicle"], "87032319"),
    (["shirt","jeans","saree","kurta","jacket","sweater","jersey","shorts","pants","trousers","dress","garment","apparel","clothing"], "62034200"),
    (["excavator","bulldozer","forklift","crane","loader","road roller","backhoe","tractor","earth mover","construction equipment"], "84295100"),
    (["printer","laserjet","inkjet","pixma","multifunction printer","scanner printer","copier"], "84433210"),
    (["camera","dslr","mirrorless","camcorder","video camera","digital camera","photography"], "85258020"),
    (["headphone","earphone","earbud","headset","airpods","neckband","tws","airdopes","boat earbuds","noise earbuds","wireless earbud","bluetooth earbud"], "85183000"),
    (["speaker","bluetooth speaker","portable speaker","soundbar","audio system","jbl","bose speaker","home theatre"], "85182100"),
    (["power bank","powerbank","portable charger","battery pack","mobile charger"], "85076000"),
    (["smartwatch","smart watch","fitness watch","apple watch","galaxy watch","health tracker","wearable","fitness band"], "85176290"),
    (["television","tv","smart tv","led tv","oled tv","qled","samsung tv","lg tv"], "85287217"),
    (["refrigerator","fridge","freezer","double door fridge"], "84181010"),
    (["air conditioner","ac unit","split ac","window ac","inverter ac"], "84151010"),
    (["washing machine","washer","front load","top load washing"], "84501100"),
    (["shoes","footwear","sneakers","boots","sandals","slippers","nike","adidas shoes"], "64039990"),
    (["furniture","sofa","chair","table","desk","wardrobe","cabinet","bed frame"], "94036000"),
]

def keyword_override(text: str) -> Optional[str]:
    lowered = text.lower()
    for keywords, code in KEYWORD_RULES:
        for kw in keywords:
            if kw in lowered:
                return code
    return None
def create_hsn_dataset() -> pd.DataFrame:
    rows = [
        ("dell xps laptop core i7", "84713000"), ("hp pavilion laptop 15 inch", "84713000"),
        ("lenovo thinkpad t14 laptop", "84713000"), ("asus rog gaming laptop", "84713000"),
        ("acer aspire 5 laptop", "84713000"), ("macbook pro m3 chip", "84713000"),
        ("macbook air m2 laptop", "84713000"), ("dell inspiron 15 laptop", "84713000"),
        ("hp elitebook business laptop", "84713000"), ("lenovo ideapad slim 5", "84713000"),
        ("microsoft surface laptop", "84713000"), ("asus zenbook ultrabook", "84713000"),
        ("chromebook student laptop", "84713000"), ("gaming laptop rtx 4060", "84713000"),
        ("desktop computer intel i5", "84713000"), ("office desktop pc tower", "84713000"),
        ("all in one desktop", "84713000"), ("workstation desktop computer", "84713000"),
        ("mini pc desktop computer", "84713000"), ("budget laptop student use", "84713000"),
        ("notebook computer 8gb ram", "84713000"), ("ultrabook slim laptop", "84713000"),
        ("hp omen gaming laptop", "84713000"), ("msi gaming laptop", "84713000"),
        ("razer blade laptop", "84713000"),
        ("apple ipad air 5th gen", "84713010"), ("apple ipad pro 12.9 inch", "84713010"),
        ("ipad mini 6 tablet", "84713010"), ("samsung galaxy tab s9", "84713010"),
        ("samsung galaxy tab a8", "84713010"), ("lenovo tab m10 plus", "84713010"),
        ("xiaomi pad 6 pro tablet", "84713010"), ("realme pad 2 tablet", "84713010"),
        ("android tablet 10 inch", "84713010"), ("windows tablet surface pro", "84713010"),
        ("educational tablet kids", "84713010"), ("drawing tablet stylus", "84713010"),
        ("amazon fire hd tablet", "84713010"), ("tcl tab 10 android", "84713010"),
        ("honor pad 8 tablet", "84713010"),
        ("iphone 15 pro max 512gb", "85171300"), ("iphone 14 plus 128gb", "85171300"),
        ("samsung galaxy s24 ultra", "85171300"), ("samsung galaxy a54 5g", "85171300"),
        ("oneplus 12 flagship smartphone", "85171300"), ("xiaomi 14 pro 5g", "85171300"),
        ("realme gt 5 pro", "85171300"), ("google pixel 8 pro", "85171300"),
        ("vivo x100 pro smartphone", "85171300"), ("oppo find x7 phone", "85171300"),
        ("motorola edge 40 pro", "85171300"), ("nothing phone 2 smartphone", "85171300"),
        ("android smartphone 5g", "85171300"), ("budget 4g smartphone", "85171300"),
        ("foldable smartphone samsung fold", "85171300"), ("iqoo 12 gaming phone", "85171300"),
        ("poco x6 pro smartphone", "85171300"), ("redmi note 13 pro", "85171300"),
        ("samsung galaxy m34 phone", "85171300"), ("touchscreen mobile phone", "85171300"),
        ("casio fx 991es plus scientific", "84701000"), ("casio fx 82ms calculator", "84701000"),
        ("scientific calculator student", "84701000"), ("graphing calculator ti 84", "84701000"),
        ("financial calculator hp 12c", "84701000"), ("basic desk calculator office", "84701000"),
        ("electronic calculator 12 digit", "84701000"), ("solar powered calculator", "84701000"),
        ("printing calculator canon", "84701000"), ("programmable calculator casio", "84701000"),
        ("tax calculator electronic", "84701000"), ("calculator school exam use", "84701000"),
        ("mini pocket calculator", "84701000"), ("accountant calculator large", "84701000"),
        ("digital calculator battery", "84701000"),
        ("paracetamol 500mg tablet strip", "30049099"), ("ibuprofen 400mg tablet", "30049099"),
        ("aspirin 75mg heart tablet", "30049099"), ("amoxicillin 500mg capsules", "30049099"),
        ("vitamin d3 supplement capsule", "30049099"), ("multivitamin tablet daily", "30049099"),
        ("cough syrup honey lemon", "30049099"), ("allergy antihistamine medicine", "30049099"),
        ("insulin pen injection 100iu", "30049099"), ("pain relief tablet analgesic", "30049099"),
        ("antibiotic ointment cream", "30049099"), ("blood pressure medicine amlodipine", "30049099"),
        ("diabetes metformin tablet", "30049099"), ("antacid omeprazole capsule", "30049099"),
        ("iron folic acid supplement", "30049099"), ("cholesterol statin medicine", "30049099"),
        ("antibiotic azithromycin", "30049099"), ("eye drop solution ophthalmic", "30049099"),
        ("nasal spray medicine", "30049099"), ("pharma tablet blister pack", "30049099"),
        ("toyota camry 2.5l sedan", "87032319"), ("hyundai creta petrol suv", "87032319"),
        ("honda city 1.5 vtec sedan", "87032319"), ("maruti suzuki swift dzire", "87032319"),
        ("mahindra scorpio n diesel", "87032319"), ("kia seltos 1.5 petrol", "87032319"),
        ("tata nexon ev electric car", "87032319"), ("volkswagen virtus sedan", "87032319"),
        ("skoda slavia 1.5 tsi", "87032319"), ("renault triber family mpv", "87032319"),
        ("mg hector suv", "87032319"), ("bmw 3 series sedan", "87032319"),
        ("mercedes c class car", "87032319"), ("audi a4 petrol sedan", "87032319"),
        ("nissan magnite suv compact", "87032319"), ("jeep compass 4x4 diesel", "87032319"),
        ("electric passenger vehicle", "87032319"), ("hatchback petrol car", "87032319"),
        ("crossover suv automatic", "87032319"), ("family passenger vehicle 7 seater", "87032319"),
        ("cotton formal shirt men", "62034200"), ("denim jeans slim fit", "62034200"),
        ("silk saree wedding", "62034200"), ("sports jersey cricket", "62034200"),
        ("winter woollen sweater", "62034200"), ("leather jacket biker", "62034200"),
        ("track pants polyester", "62034200"), ("kurta pajama ethnic wear", "62034200"),
        ("casual shorts summer", "62034200"), ("polo t shirt cotton", "62034200"),
        ("formal trouser office wear", "62034200"), ("hoodie sweatshirt fleece", "62034200"),
        ("linen shirt breathable", "62034200"), ("women kurta cotton printed", "62034200"),
        ("school uniform shirt pant", "62034200"), ("gym wear shorts tshirt", "62034200"),
        ("blazer formal jacket", "62034200"), ("salwar kameez dupatta", "62034200"),
        ("children dress frock", "62034200"), ("raincoat waterproof jacket", "62034200"),
        ("excavator heavy construction", "84295100"), ("bulldozer caterpillar d6", "84295100"),
        ("agricultural tractor 50hp", "84295100"), ("forklift electric 3 ton", "84295100"),
        ("tower crane 50 tonne", "84295100"), ("road roller compactor", "84295100"),
        ("wheel loader jcb 3cx", "84295100"), ("earth mover mining equipment", "84295100"),
        ("backhoe loader construction", "84295100"), ("hydraulic crane mobile", "84295100"),
        ("skid steer loader bobcat", "84295100"), ("concrete mixer machine", "84295100"),
        ("grader road machine", "84295100"), ("piling machine foundation", "84295100"),
        ("mining excavator bucket", "84295100"),
        ("hp laserjet pro m404dn", "84433210"), ("canon pixma g3010 inkjet", "84433210"),
        ("epson l3150 ink tank printer", "84433210"), ("brother dcp multifunction printer", "84433210"),
        ("hp officejet pro all in one", "84433210"), ("samsung laser printer mono", "84433210"),
        ("xerox colour laser printer", "84433210"), ("photo printer canon pixma", "84433210"),
        ("wireless printer wifi office", "84433210"), ("thermal receipt printer pos", "84433210"),
        ("barcode label printer zebra", "84433210"), ("large format printer a3", "84433210"),
        ("portable mini printer", "84433210"), ("inkjet printer home use", "84433210"),
        ("laser printer duplex auto", "84433210"),
        ("canon eos r50 mirrorless", "85258020"), ("sony alpha a7 iii camera", "85258020"),
        ("nikon d7500 dslr camera", "85258020"), ("fujifilm xt5 mirrorless", "85258020"),
        ("gopro hero 12 action camera", "85258020"), ("panasonic lumix g9 camera", "85258020"),
        ("digital camera 24mp zoom", "85258020"), ("professional photography camera", "85258020"),
        ("video camera 4k recording", "85258020"), ("camera lens kit 18 55mm", "85258020"),
        ("security cctv ip camera", "85258020"), ("drone camera dji mini 4", "85258020"),
        ("compact point shoot camera", "85258020"), ("cinema camera blackmagic", "85258020"),
        ("webcam hd 1080p usb", "85258020"),
        ("sony wh 1000xm5 headphones", "85183000"), ("bose quietcomfort 45 noise cancelling", "85183000"),
        ("jbl tune 760nc headphones", "85183000"), ("boat rockerz 450 wireless", "85183000"),
        ("sennheiser hd 450 bt", "85183000"), ("oneplus buds pro 2 earbuds", "85183000"),
        ("realme buds air 5 tws", "85183000"), ("boat airdopes 141 earbuds", "85183000"),
        ("noise earbuds x true wireless", "85183000"), ("samsung galaxy buds fe", "85183000"),
        ("apple airpods pro 2 earbuds", "85183000"), ("gaming headset rgb usb", "85183000"),
        ("wired earphones 3.5mm jack", "85183000"), ("neckband bluetooth earphones", "85183000"),
        ("in ear monitor studio earphones", "85183000"), ("wireless stereo headset calls", "85183000"),
        ("tws true wireless earbuds", "85183000"), ("noise cancelling over ear headphones", "85183000"),
        ("bluetooth earbuds sports", "85183000"), ("kids headphones safe volume", "85183000"),
        ("jbl charge 5 bluetooth speaker", "85182100"), ("boat stone 1200 wireless speaker", "85182100"),
        ("sony srs xb33 portable speaker", "85182100"), ("bose soundlink flex speaker", "85182100"),
        ("marshall stanmore home speaker", "85182100"), ("amazon echo dot smart speaker", "85182100"),
        ("google nest audio speaker", "85182100"), ("soundbar tv home theatre", "85182100"),
        ("party speaker high bass", "85182100"), ("portable bluetooth speaker waterproof", "85182100"),
        ("bookshelf speaker pair hifi", "85182100"), ("computer desktop speaker", "85182100"),
        ("mini speaker pocket size", "85182100"), ("outdoor speaker wireless", "85182100"),
        ("home cinema speaker system", "85182100"),
        ("mi power bank 20000mah", "85076000"), ("anker powercore 10000 slim", "85076000"),
        ("realme 33w power bank", "85076000"), ("ambrane wireless power bank", "85076000"),
        ("baseus 65w pd power bank", "85076000"), ("portable charger 10000mah usb c", "85076000"),
        ("fast charging power bank 20w", "85076000"), ("solar power bank outdoor", "85076000"),
        ("slim power bank thin design", "85076000"), ("power bank laptop charging 30000mah", "85076000"),
        ("apple watch series 9 gps", "85176290"), ("samsung galaxy watch 6", "85176290"),
        ("fitbit charge 6 fitness tracker", "85176290"), ("garmin forerunner 255 watch", "85176290"),
        ("noise colorfit icon smartwatch", "85176290"), ("boat wave call smartwatch", "85176290"),
        ("oneplus watch 2 wear os", "85176290"), ("amazfit gts 4 smart watch", "85176290"),
        ("health tracker fitness band", "85176290"), ("smart watch blood oxygen spo2", "85176290"),
        ("samsung 55 inch qled tv", "85287217"), ("lg oled 65 inch smart tv", "85287217"),
        ("sony bravia xr 4k tv", "85287217"), ("mi 43 inch led tv", "85287217"),
        ("tcl 50 inch smart tv", "85287217"), ("vu 32 inch hd ready tv", "85287217"),
        ("iffalcon 40 inch android tv", "85287217"), ("hisense 55 inch 4k tv", "85287217"),
        ("oneplus 43y1s television", "85287217"), ("smart television 4k hdr", "85287217"),
        ("samsung 253l double door fridge", "84181010"), ("lg 190l single door refrigerator", "84181010"),
        ("whirlpool frost free fridge", "84181010"), ("godrej 185l refrigerator", "84181010"),
        ("haier french door refrigerator", "84181010"), ("bosch multi door fridge", "84181010"),
        ("refrigerator inverter compressor", "84181010"), ("mini fridge compact refrigerator", "84181010"),
        ("side by side refrigerator", "84181010"), ("star rated energy efficient fridge", "84181010"),
        ("daikin 1.5 ton split ac", "84151010"), ("lg dual inverter 2 ton ac", "84151010"),
        ("blue star 5 star inverter ac", "84151010"), ("voltas 1 ton window ac", "84151010"),
        ("carrier split air conditioner", "84151010"), ("hitachi 1.5 ton 5 star ac", "84151010"),
        ("godrej 1 ton inverter ac", "84151010"), ("samsung wind free ac", "84151010"),
        ("portable air conditioner unit", "84151010"), ("cassette ac commercial unit", "84151010"),
        ("lg 7kg front load washing machine", "84501100"), ("samsung 8kg top load washer", "84501100"),
        ("whirlpool 6.5kg semi automatic", "84501100"), ("bosch 7kg inverter washing machine", "84501100"),
        ("ifb front loading washing machine", "84501100"), ("haier 8kg fully automatic", "84501100"),
        ("godrej 7kg top load washer", "84501100"), ("panasonic front load washer", "84501100"),
        ("washing machine with dryer combo", "84501100"), ("mini portable washing machine", "84501100"),
        ("nike air max running shoes", "64039990"), ("adidas ultraboost sneakers", "64039990"),
        ("puma sports shoes men", "64039990"), ("woodland leather boots", "64039990"),
        ("red tape formal shoes", "64039990"), ("bata sandals casual", "64039990"),
        ("crocs unisex clogs", "64039990"), ("heel sandals women", "64039990"),
        ("school shoes black leather", "64039990"), ("safety shoes steel toe", "64039990"),
        ("wooden study table desk", "94036000"), ("office chair ergonomic", "94036000"),
        ("sofa 3 seater fabric", "94036000"), ("queen size bed frame", "94036000"),
        ("wardrobe sliding door", "94036000"), ("dining table 6 seater", "94036000"),
        ("bookshelf wooden 5 shelf", "94036000"), ("tv unit entertainment cabinet", "94036000"),
        ("recliner sofa chair", "94036000"), ("computer gaming chair", "94036000"),
    ]
    return pd.DataFrame(rows, columns=["product_description", "hsn_code"])
def train_model():
    global hsn_vectorizer, hsn_classifier
    print("=" * 60)
    print("   Training Advanced HSN Classification Model v2")
    df = create_hsn_dataset()
    df["product_description"] = df["product_description"].str.lower().str.strip()
    df = df.drop_duplicates()
    class_counts  = df["hsn_code"].value_counts()
    valid_classes = class_counts[class_counts >= 2].index
    df = df[df["hsn_code"].isin(valid_classes)]
    print(f"   Valid Classes : {len(valid_classes)}")
    print(f"   Total Samples : {len(df)}")
    hsn_vectorizer = TfidfVectorizer(max_features=8000, ngram_range=(1, 4),
                                     stop_words="english", sublinear_tf=True, min_df=1)
    X = hsn_vectorizer.fit_transform(df["product_description"])
    y = df["hsn_code"]
    if len(set(y)) < 2:
        raise ValueError("Need at least 2 classes")
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.15, random_state=42, stratify=y)
    lr      = LogisticRegression(C=5.0, max_iter=3000, class_weight="balanced", solver="lbfgs")
    svc_base = LinearSVC(C=1.0, max_iter=3000, class_weight="balanced")
    svc     = CalibratedClassifierCV(svc_base, cv=3, method="sigmoid")
    lr.fit(X_tr, y_tr); svc.fit(X_tr, y_tr)
    hsn_classifier = {"lr": lr, "svc": svc}
    acc_lr  = accuracy_score(y_te, lr.predict(X_te))
    acc_svc = accuracy_score(y_te, svc.predict(X_te))
    lr_p    = lr.predict_proba(X_te); svc_p = svc.predict_proba(X_te)
    ens_p   = (lr_p + svc_p) / 2
    acc_ens = accuracy_score(y_te, lr.classes_[ens_p.argmax(axis=1)])
    print(f"    LR  Accuracy : {acc_lr*100:.2f}%")
    print(f"    SVC Accuracy : {acc_svc*100:.2f}%")
    print(f"   Ensemble     : {acc_ens*100:.2f}%")
    print("=" * 60)

HSN_META = {
    "84713000": {"description": "Laptops / Desktops",                "duty": 0.00, "gst": 0.18},
    "84713010": {"description": "Tablet Computers",                  "duty": 0.10, "gst": 0.18},
    "85171300": {"description": "Smartphones",                       "duty": 0.20, "gst": 0.18},
    "84701000": {"description": "Electronic Calculators",            "duty": 0.10, "gst": 0.18},
    "30049099": {"description": "Medicaments",                       "duty": 0.10, "gst": 0.05},
    "87032319": {"description": "Motor Vehicles",                    "duty": 0.25, "gst": 0.28},
    "62034200": {"description": "Cotton Garments",                   "duty": 0.15, "gst": 0.12},
    "84295100": {"description": "Excavators & Loaders",              "duty": 0.12, "gst": 0.18},
    "84433210": {"description": "Printers / Multifunction Printers", "duty": 0.10, "gst": 0.18},
    "85258020": {"description": "Digital Cameras",                   "duty": 0.15, "gst": 0.18},
    "85183000": {"description": "Headphones / Earphones",            "duty": 0.15, "gst": 0.18},
    "85182100": {"description": "Speakers / Audio Systems",          "duty": 0.18, "gst": 0.18},
    "85076000": {"description": "Power Banks / Li-Ion Batteries",    "duty": 0.18, "gst": 0.18},
    "85176290": {"description": "Smart Watches / Wearables",         "duty": 0.20, "gst": 0.18},
    "85287217": {"description": "LED / Smart Televisions",           "duty": 0.20, "gst": 0.18},
    "84181010": {"description": "Refrigerators",                     "duty": 0.20, "gst": 0.18},
    "84151010": {"description": "Air Conditioners",                  "duty": 0.20, "gst": 0.28},
    "84501100": {"description": "Washing Machines",                  "duty": 0.18, "gst": 0.18},
    "64039990": {"description": "Footwear / Shoes",                  "duty": 0.15, "gst": 0.18},
    "94036000": {"description": "Furniture",                         "duty": 0.18, "gst": 0.18},
}

COUNTRY_DELTA = {"US": 0.03, "UK": 0.02, "AE": 0.00, "SG": -0.02}
TARIFFS = {
    "IN": {"basic": 0.10, "igst": 0.18, "sws": 0.10},
    "US": {"basic": 0.05, "igst": 0.00, "sws": 0.02},
    "UK": {"basic": 0.04, "igst": 0.20, "sws": 0.00},
    "AE": {"basic": 0.05, "igst": 0.05, "sws": 0.00},
    "SG": {"basic": 0.00, "igst": 0.09, "sws": 0.00},
}
ANTI_DUMP = {
    "84713000": 0.00, "85171300": 0.15, "30049099": 0.00,
    "87032319": 0.25, "62034200": 0.10, "84295100": 0.05,
}

def is_valid_product(text: str) -> bool:
    if not text: return False
    text = text.strip()
    return len(text) > 2 and any(c.isalpha() for c in text)

def predict_hsn(desc: str) -> dict:
    if not is_valid_product(desc):
        return {"hsn_code": None, "confidence": 0.0, "confidence_level": "Invalid Input",
                "manual_verification_required": True,
                "description": "Please enter a valid product description",
                "duty_rate": 0.0, "gst_rate": 0.0, "source": "validation"}
    override = keyword_override(desc)
    if override:
        meta = HSN_META.get(override, {"description": "General Goods", "duty": 0.10, "gst": 0.18})
        return {"hsn_code": override, "confidence": 0.97, "confidence_level": "High",
                "manual_verification_required": False, "description": meta["description"],
                "duty_rate": meta["duty"], "gst_rate": meta["gst"], "source": "keyword_rule"}
    if hsn_vectorizer is None or hsn_classifier is None:
        return {"hsn_code": None, "confidence": 0.0, "confidence_level": "Model Not Ready",
                "manual_verification_required": True, "description": "Model not trained yet",
                "duty_rate": 0.0, "gst_rate": 0.0, "source": "error"}
    text      = clean_text(desc)
    X         = hsn_vectorizer.transform([text])
    lr        = hsn_classifier["lr"]; svc = hsn_classifier["svc"]
    combined  = (lr.predict_proba(X)[0] * 0.6) + (svc.predict_proba(X)[0] * 0.4)
    confidence = float(combined.max())
    code      = lr.classes_[combined.argmax()]
    if confidence < 0.45:
        return {"hsn_code": None, "confidence": round(confidence, 3),
                "confidence_level": "Low Confidence", "manual_verification_required": True,
                "description": "Cannot classify accurately — try a more specific description",
                "duty_rate": 0.0, "gst_rate": 0.0, "source": "ml_low_confidence"}
    meta = HSN_META.get(code, {"description": "General Goods", "duty": 0.10, "gst": 0.18})
    return {"hsn_code": code, "confidence": round(confidence, 3),
            "confidence_level": "High" if confidence > 0.75 else "Medium",
            "manual_verification_required": confidence < 0.80,
            "description": meta["description"], "duty_rate": meta["duty"],
            "gst_rate": meta["gst"], "source": "ml_ensemble"}


def seed_users():
    demo = [
        ("admin",     "admin@tradelint.com",  "admin123",  "Admin User",   "TradeLint",     "9999999999", "admin"),
        ("demo",      "demo@tradelint.com",   "demo123",   "Demo User",    "Demo Corp",     "8888888888", "importer"),
        ("exporter1", "exp@tradelint.com",    "export123", "Priya Sharma", "Priya Exports", "9123456789", "exporter"),
        ("broker1",   "broker@tradelint.com", "broker123", "Arjun Singh",  "Singh Brokers", "9000011111", "broker"),
    ]
    try:
        conn = get_db()
        with conn.cursor() as cur:
            for username, email, pwd, full_name, company, phone, role in demo:
                cur.execute("SELECT id FROM users WHERE username = %s", (username,))
                if cur.fetchone(): continue
                cur.execute(
                    """INSERT INTO users (username,email,password_hash,full_name,company_name,phone,role,is_active,is_verified)
                       VALUES (%s,%s,%s,%s,%s,%s,%s,true,true)""",
                    (username, email, hash_password(pwd), full_name, company, phone, role),
                )
        conn.commit(); conn.close()
        print("  ✅ Demo users seeded into Supabase")
    except Exception as e:
        print(f"  ⚠️  Seed warning (safe if users exist): {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\n🚀 AI Import Export Intelligence v3.4.0 (Free OCR)")
    print("-" * 60)
    try: train_model()
    except Exception as e: print(f"❌ Model training failed: {e}")
    try: seed_users()
    except Exception as e: print(f"❌ User seeding failed: {e}")
    print("-" * 60)
    print("System Ready  |  OCR: pdfplumber + fitz (no tesseract needed)")
    print("\n Demo: admin/admin123  demo/demo123  exporter1/export123  broker1/broker123")
    print(" Docs → http://localhost:8001/docs\n")
    yield
    print("\nShutting down...\n")


app = FastAPI(title="AI Import Export Auth Service", version="3.4.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:3001","http://localhost:3002","*"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

class UserCreate(BaseModel):
    full_name: str; email: str; password: str; role: str = "importer"
class UserLogin(BaseModel):
    email: str; password: str
class TokenResponse(BaseModel):
    access_token: str; token_type: str
class UserResponse(BaseModel):
    id: int; full_name: str; email: str; role: str
class RegisterRequest(BaseModel):
    username: str; email: str; password: str; full_name: str
    company_name: str; phone: str; role: str = "importer"
class LoginRequest(BaseModel):
    username: str; password: str
class HSNRequest(BaseModel):
    product_description: str; country: str = "IN"
class DutyRequest(BaseModel):
    hsn_code: str; product_value: float; quantity: int
    origin_country: str; destination_country: str
    freight_cost: float = 0.0; insurance_cost: float = 0.0
class ShipmentRequest(BaseModel):
    origin_country: str; origin_port: str
    destination_country: str; destination_port: str
    product_description: str; hsn_code: str
    quantity: int; weight: float; product_value: float
class PaymentAddRequest(BaseModel):
    client_id: int; invoice_number: str; invoice_amount: float
    due_date: str; payment_date: Optional[str] = None
    days_late: int = 0; status: str = "pending"

@app.get("/favicon.ico", include_in_schema=False)
async def favicon(): return Response(content=b"", media_type="image/x-icon")

@app.post("/auth/signup", response_model=UserResponse, tags=["Authentication"])
async def signup(body: UserCreate):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM users WHERE email = %s", (body.email.lower(),))
            if cur.fetchone(): raise HTTPException(400, "Email already registered")
            cur.execute(
                """INSERT INTO users (username,email,password_hash,full_name,role,is_active,is_verified)
                   VALUES (%s,%s,%s,%s,%s,true,false) RETURNING id,full_name,email,role""",
                (body.email.lower(), body.email.lower(), hash_password(body.password), body.full_name, body.role),
            )
            row = dict(cur.fetchone())
        conn.commit()
    except HTTPException: raise
    except Exception as e: conn.rollback(); raise HTTPException(500, f"DB error: {e}")
    finally: conn.close()
    return UserResponse(**row)

@app.post("/auth/login", response_model=TokenResponse, tags=["Authentication"])
async def auth_login(body: UserLogin):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE email = %s AND is_active = true", (body.email.lower(),))
            u = cur.fetchone()
    finally: conn.close()
    if not u or not verify_password(body.password, u["password_hash"]):
        raise HTTPException(401, "Invalid email or password")
    _update_last_login(u["username"])
    return TokenResponse(access_token=create_token(u["username"], u["role"]), token_type="bearer")

@app.post("/api/auth/register", tags=["Auth"])
async def register(body: RegisterRequest):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM users WHERE username = %s", (body.username,))
            if cur.fetchone(): raise HTTPException(400, "Username already taken")
            cur.execute("SELECT id FROM users WHERE email = %s", (body.email.lower(),))
            if cur.fetchone(): raise HTTPException(400, "Email already registered")
            cur.execute(
                """INSERT INTO users (username,email,password_hash,full_name,company_name,phone,role,is_active,is_verified)
                   VALUES (%s,%s,%s,%s,%s,%s,%s,true,false) RETURNING id,username,role,full_name""",
                (body.username, body.email.lower(), hash_password(body.password),
                 body.full_name, body.company_name, body.phone, body.role),
            )
            row = dict(cur.fetchone())
        conn.commit()
    except HTTPException: raise
    except Exception as e: conn.rollback(); raise HTTPException(500, f"DB error: {e}")
    finally: conn.close()
    return {"access_token": create_token(row["username"], row["role"]), "token_type": "bearer",
            "user_id": row["id"], "username": row["username"], "role": row["role"], "full_name": row["full_name"]}

@app.post("/api/auth/login", tags=["Auth"])
async def login(body: LoginRequest):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE username = %s AND is_active = true", (body.username,))
            u = cur.fetchone()
    finally: conn.close()
    if not u or not verify_password(body.password, u["password_hash"]):
        raise HTTPException(401, "Invalid username or password")
    _update_last_login(body.username)
    return {"access_token": create_token(u["username"], u["role"]), "token_type": "bearer",
            "user_id": u["id"], "username": u["username"], "role": u["role"], "full_name": u["full_name"]}

@app.get("/api/auth/me", tags=["Auth"])
async def me(cu=Depends(get_current_user)):
    return {k: v for k, v in cu.items() if k != "password_hash"}

@app.get("/api/users/list", tags=["Auth"])
async def list_users(cu=Depends(get_current_user)):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            if cu["role"] == "admin":
                cur.execute("""SELECT id,username,email,full_name,company_name,phone,role,
                                      is_active,is_verified,created_at,last_login
                               FROM users ORDER BY created_at ASC""")
            else:
                cur.execute("""SELECT id,username,email,full_name,company_name,phone,role,
                                      is_active,is_verified,created_at,last_login
                               FROM users WHERE id = %s""", (cu["id"],))
            rows = cur.fetchall()
    finally: conn.close()
    return {"total": len(rows), "users": [dict(r) for r in rows]}

@app.post("/api/hsn/classify", tags=["HSN"])
async def classify_hsn(body: HSNRequest, cu=Depends(get_current_user)):
    r = predict_hsn(body.product_description)
    r["adjusted_duty"] = round(r["duty_rate"] + COUNTRY_DELTA.get(body.country, 0), 3)
    r["country"] = body.country
    try:
        conn = get_db()
        rid = f"HSN{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{random.randint(100,999)}"
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO hsn_results (result_id,user_id,product_description,predicted_hsn,confidence_score)
                   VALUES (%s,%s,%s,%s,%s)""",
                (rid, cu["id"], body.product_description, r["hsn_code"], r["confidence"]),
            )
        conn.commit(); conn.close()
    except Exception: pass
    return r

@app.get("/api/hsn/history", tags=["HSN"])
async def hsn_history(cu=Depends(get_current_user), limit: int = 50, offset: int = 0):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """SELECT result_id, product_description, predicted_hsn, confidence_score, created_at
                   FROM hsn_results WHERE user_id = %s ORDER BY created_at DESC LIMIT %s OFFSET %s""",
                (cu["id"], limit, offset),
            )
            rows = cur.fetchall()
            cur.execute("SELECT COUNT(*) AS total FROM hsn_results WHERE user_id = %s", (cu["id"],))
            total = cur.fetchone()["total"]
    finally: conn.close()
    return {"total": total, "offset": offset, "limit": limit, "history": [dict(r) for r in rows]}
@app.post("/api/duty/calculate", tags=["Duty"])
async def calculate_duty(body: DutyRequest, cu=Depends(get_current_user)):
    av   = (body.product_value * body.quantity) + body.freight_cost + body.insurance_cost
    t    = TARIFFS.get(body.destination_country, TARIFFS["IN"])
    ad   = ANTI_DUMP.get(body.hsn_code, 0.0)
    bd   = av * t["basic"]; add = av * ad; sws = bd * t["sws"]
    igst = (av + bd + add) * t["igst"]; td = bd + add + sws + igst
    result = {
        "assessable_value": round(av, 2), "basic_customs_duty": round(bd, 2),
        "anti_dumping_duty": round(add, 2), "social_welfare_surcharge": round(sws, 2),
        "igst": round(igst, 2), "total_duty": round(td, 2),
        "landed_cost": round(av + td, 2), "effective_rate_pct": round((td / av) * 100, 2),
    }
    try:
        conn = get_db()
        cid = f"DUT{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{random.randint(100,999)}"
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO duty_calculations
                   (calculation_id,user_id,hsn_code,product_value,quantity,origin_country,
                    destination_country,basic_duty,igst,sws,total_duty,effective_rate)
                   VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                (cid, cu["id"], body.hsn_code, body.product_value, body.quantity,
                 body.origin_country, body.destination_country, result["basic_customs_duty"],
                 result["igst"], result["social_welfare_surcharge"], result["total_duty"],
                 result["effective_rate_pct"]),
            )
        conn.commit(); conn.close()
    except Exception: pass
    return result

@app.get("/api/duty/history", tags=["Duty"])
async def duty_history(cu=Depends(get_current_user), limit: int = 10, offset: int = 0):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """SELECT calculation_id, hsn_code, product_value, quantity,
                          origin_country, destination_country, basic_duty, igst, sws,
                          total_duty, effective_rate,
                          (product_value * quantity + COALESCE(basic_duty,0) + COALESCE(igst,0) + COALESCE(sws,0)) AS landed_cost,
                          created_at
                   FROM duty_calculations WHERE user_id = %s ORDER BY created_at DESC LIMIT %s OFFSET %s""",
                (cu["id"], limit, offset),
            )
            rows = cur.fetchall()
            cur.execute("SELECT COUNT(*) AS total FROM duty_calculations WHERE user_id = %s", (cu["id"],))
            total = cur.fetchone()["total"]
    finally: conn.close()
    return {"total": total, "offset": offset, "limit": limit, "history": [dict(r) for r in rows]}
def compute_risk_score(client_id: int) -> dict | None:
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) AS cnt FROM payment_history WHERE client_id = %s", (client_id,))
            if cur.fetchone()["cnt"] == 0: return None
            cur.execute(
                """SELECT COUNT(*) AS total,
                          COUNT(*) FILTER (WHERE status IN ('late','overdue')) AS late_count,
                          COALESCE(AVG(days_late) FILTER (WHERE days_late > 0), 0) AS avg_days_late,
                          COALESCE(MAX(days_late), 0) AS max_days_late,
                          COALESCE(SUM(invoice_amount), 0) AS total_amount
                   FROM payment_history WHERE client_id = %s""", (client_id,),
            )
            row = dict(cur.fetchone())
    finally: conn.close()
    total = int(row["total"]); late_count = int(row["late_count"])
    avg_late = float(row["avg_days_late"]); max_late = int(row["max_days_late"])
    late_ratio = late_count / total
    score = min(100, int(late_ratio * 50 + min(avg_late, 30) * 1.0 + min(max_late, 20) * 1.0))
    return {"score": score, "total": total, "late_count": late_count, "total_amount": float(row["total_amount"])}

@app.get("/api/risk/assess/{client_id}", tags=["Risk"])
async def assess_risk(client_id: int, cu=Depends(get_current_user)):
    rs = compute_risk_score(client_id)
    if rs is None:
        raise HTTPException(404, f"Client ID {client_id} has no payment history.")
    score = rs["score"]
    if score < 30:
        level, color, rec, credit = "LOW",    "green",  "Standard terms approved. Client has a strong payment record.", 500_000
    elif score < 60:
        level, color, rec, credit = "MEDIUM", "orange", "Enhanced due diligence required. Some late payments detected.", 200_000
    else:
        level, color, rec, credit = "HIGH",   "red",    "Prepayment required before dispatch. High late-payment ratio.", 50_000
    result = {"client_id": client_id, "risk_score": score, "risk_level": level, "risk_color": color,
              "recommendation": rec, "credit_limit_usd": credit,
              "payment_stats": {"total_invoices": rs["total"], "late_payments": rs["late_count"],
                                "on_time": rs["total"] - rs["late_count"], "total_amount": rs["total_amount"]}}
    try:
        conn = get_db()
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO risk_assessments (user_id,client_id,risk_score,risk_level,recommendation,credit_limit_usd)
                   VALUES (%s,%s,%s,%s,%s,%s)""",
                (cu["id"], client_id, score, level, rec, credit),
            )
        conn.commit(); conn.close()
    except Exception: pass
    return result

@app.get("/api/risk/history", tags=["Risk"])
async def risk_history(cu=Depends(get_current_user), limit: int = 20, offset: int = 0):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """SELECT id, client_id, risk_score, risk_level, recommendation, credit_limit_usd, created_at
                   FROM risk_assessments WHERE user_id = %s ORDER BY created_at DESC LIMIT %s OFFSET %s""",
                (cu["id"], limit, offset),
            )
            rows = cur.fetchall()
            cur.execute("SELECT COUNT(*) AS total FROM risk_assessments WHERE user_id = %s", (cu["id"],))
            total = cur.fetchone()["total"]
    finally: conn.close()
    return {"total": total, "offset": offset, "limit": limit, "history": [dict(r) for r in rows]}

@app.get("/api/payment/history", tags=["Payment"])
async def payment_history(cu=Depends(get_current_user), client_id: Optional[int] = None,
                           limit: int = 20, offset: int = 0):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            if client_id:
                cur.execute(
                    """SELECT id,client_id,invoice_number,invoice_amount,payment_date,due_date,days_late,status,created_at
                       FROM payment_history WHERE client_id = %s ORDER BY due_date DESC LIMIT %s OFFSET %s""",
                    (client_id, limit, offset),
                )
                rows = cur.fetchall()
                cur.execute("SELECT COUNT(*) AS total FROM payment_history WHERE client_id = %s", (client_id,))
            else:
                cur.execute(
                    """SELECT id,client_id,invoice_number,invoice_amount,payment_date,due_date,days_late,status,created_at
                       FROM payment_history ORDER BY due_date DESC LIMIT %s OFFSET %s""",
                    (limit, offset),
                )
                rows = cur.fetchall()
                cur.execute("SELECT COUNT(*) AS total FROM payment_history")
            total = cur.fetchone()["total"]
            base_filter = "WHERE client_id = %s" if client_id else ""
            base_params = (client_id,) if client_id else ()
            cur.execute(
                f"""SELECT COUNT(*) AS total_invoices,
                          COUNT(*) FILTER (WHERE status IN ('late','overdue')) AS late_count,
                          COUNT(*) FILTER (WHERE status = 'paid')  AS paid_count,
                          COUNT(*) FILTER (WHERE status = 'pending') AS pending_count,
                          COALESCE(SUM(invoice_amount), 0) AS total_amount,
                          COALESCE(AVG(days_late) FILTER (WHERE days_late > 0), 0) AS avg_days_late
                    FROM payment_history {base_filter}""", base_params,
            )
            summary = dict(cur.fetchone())
    finally: conn.close()
    return {"total": total, "offset": offset, "limit": limit,
            "summary": {k: float(v) if isinstance(v, __import__("decimal").Decimal) else v for k, v in summary.items()},
            "history": [dict(r) for r in rows]}

@app.post("/api/payment/add", tags=["Payment"])
async def add_payment(body: PaymentAddRequest, cu=Depends(get_current_user)):
    if cu["role"] not in ("admin", "broker"):
        raise HTTPException(403, "Not authorised")
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO payment_history (client_id,invoice_number,invoice_amount,payment_date,due_date,days_late,status)
                   VALUES (%s,%s,%s,%s,%s,%s,%s) RETURNING id""",
                (body.client_id, body.invoice_number, body.invoice_amount,
                 body.payment_date or None, body.due_date, body.days_late, body.status),
            )
            new_id = cur.fetchone()["id"]
        conn.commit()
    except Exception as e: conn.rollback(); raise HTTPException(500, f"DB error: {e}")
    finally: conn.close()
    return {"success": True, "id": new_id}
@app.post("/api/shipments/create", tags=["Shipments"])
async def create_shipment(body: ShipmentRequest, cu=Depends(get_current_user)):
    sid = f"SHP{datetime.utcnow().strftime('%Y%m%d')}{random.randint(1000,9999)}"
    tid = f"TRK{random.randint(100_000,999_999)}"; cno = f"MSKU{random.randint(1_000_000,9_999_999)}"
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO shipments (shipment_id,user_id,tracking_id,container_number,
                   origin_country,origin_port,destination_country,destination_port,
                   product_description,hsn_code,quantity,weight,product_value,status,booking_date)
                   VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,'booked',NOW())""",
                (sid, cu["id"], tid, cno, body.origin_country, body.origin_port,
                 body.destination_country, body.destination_port, body.product_description,
                 body.hsn_code, body.quantity, body.weight, body.product_value),
            )
        conn.commit()
    except Exception as e: conn.rollback(); raise HTTPException(500, f"DB error: {e}")
    finally: conn.close()
    return {"success": True, "shipment_id": sid, "tracking_id": tid, "container_number": cno, "status": "booked"}

@app.get("/api/shipments/track/{tracking_id}", tags=["Shipments"])
async def track_shipment(tracking_id: str):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM shipments WHERE tracking_id = %s", (tracking_id,))
            row = cur.fetchone()
    finally: conn.close()
    if row: return dict(row)
    return {"tracking_id": tracking_id, "status": "In Transit",
            "current_location": "Singapore Port – PASIR PANJANG TERMINAL", "progress_pct": 50,
            "estimated_arrival": (datetime.utcnow() + timedelta(days=10)).strftime("%Y-%m-%d"),
            "last_updated": datetime.utcnow().isoformat()}

@app.get("/api/shipments/list", tags=["Shipments"])
async def list_shipments(cu=Depends(get_current_user)):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM shipments WHERE user_id = %s ORDER BY created_at DESC", (cu["id"],))
            rows = cur.fetchall()
    finally: conn.close()
    items = [dict(r) for r in rows]
    return {"total": len(items), "shipments": items}

@app.get("/api/shipments/history", tags=["Shipments"])
async def shipment_history(cu=Depends(get_current_user), limit: int = 10, offset: int = 0,
                            status: str = "", search: str = ""):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            filters = ["user_id = %s"]; params = [cu["id"]]
            if status:
                filters.append("status = %s"); params.append(status)
            if search:
                filters.append("(shipment_id ILIKE %s OR tracking_id ILIKE %s OR product_description ILIKE %s OR hsn_code ILIKE %s)")
                like = f"%{search}%"; params.extend([like, like, like, like])
            where = " AND ".join(filters)
            cur.execute(
                f"""SELECT shipment_id, tracking_id, container_number,
                           origin_country, origin_port, destination_country, destination_port,
                           product_description, hsn_code, quantity, weight, product_value,
                           status, booking_date, created_at
                    FROM shipments WHERE {where} ORDER BY created_at DESC LIMIT %s OFFSET %s""",
                (*params, limit, offset),
            )
            rows = cur.fetchall()
            cur.execute(f"SELECT COUNT(*) AS total FROM shipments WHERE {where}", params)
            total = cur.fetchone()["total"]
            cur.execute("SELECT status, COUNT(*) AS cnt FROM shipments WHERE user_id = %s GROUP BY status", (cu["id"],))
            breakdown = {r["status"]: r["cnt"] for r in cur.fetchall()}
    finally: conn.close()
    return {"total": total, "offset": offset, "limit": limit,
            "shipments": [dict(r) for r in rows], "breakdown": breakdown}
@app.get("/api/analytics/dashboard", tags=["Analytics"])
async def dashboard(cu=Depends(get_current_user)):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) AS total FROM shipments WHERE user_id=%s", (cu["id"],))
            total = cur.fetchone()["total"]
            cur.execute("SELECT COUNT(*) AS active FROM shipments WHERE user_id=%s AND status NOT IN ('delivered','cancelled')", (cu["id"],))
            active = cur.fetchone()["active"]
            cur.execute("SELECT COALESCE(SUM(product_value*quantity),0) AS tv FROM shipments WHERE user_id=%s", (cu["id"],))
            tv = float(cur.fetchone()["tv"] or 0)
    finally: conn.close()
    rng = random.Random(cu["id"]); months = ["Jan","Feb","Mar","Apr","May","Jun"]
    return {
        "summary": {"total_shipments": total, "active_shipments": active,
                    "total_value_usd": round(tv, 2), "risk_alerts": rng.randint(0, 10),
                    "compliance_rate": round(rng.uniform(85, 98), 1)},
        "shipment_trends": [{"month": m, "shipments": rng.randint(10, 40),
                              "value_usd": rng.randint(100_000, 500_000)} for m in months],
    }

@app.get("/api/analytics/history", tags=["Analytics"])
async def analytics_history(cu=Depends(get_current_user), months: int = 6):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """SELECT TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') AS month,
                          COUNT(*) AS shipments, COALESCE(SUM(product_value * quantity), 0) AS value_usd
                   FROM shipments WHERE user_id = %s AND created_at >= NOW() - INTERVAL '%s months'
                   GROUP BY DATE_TRUNC('month', created_at) ORDER BY DATE_TRUNC('month', created_at) ASC""",
                (cu["id"], months),
            )
            rows = cur.fetchall()
            cur.execute(
                """SELECT COUNT(*) FILTER (WHERE status = 'booked') AS booked,
                          COUNT(*) FILTER (WHERE status = 'in_transit') AS in_transit,
                          COUNT(*) FILTER (WHERE status = 'delivered') AS delivered,
                          COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled
                   FROM shipments WHERE user_id = %s""", (cu["id"],),
            )
            status_counts = dict(cur.fetchone())
    finally: conn.close()
    return {"monthly_trends": [dict(r) for r in rows], "status_breakdown": status_counts}
@app.post("/api/documents/upload", tags=["Documents"])
async def upload_document(file: UploadFile = File(...), cu=Depends(get_current_user)):
    global doc_counter
    if not file.filename:
        raise HTTPException(400, "No file provided")
    content = await file.read()
    if len(content) == 0:
        raise HTTPException(400, "Uploaded file is empty")
    doc_counter += 1

    try:
        extracted, conf = run_ocr(content, file.filename)
    except ValueError as e:
        raise HTTPException(400, str(e))
    except Exception as e:
        raise HTTPException(500, f"OCR processing error: {e}")

    doc_id = f"DOC_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{doc_counter}"
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO documents (document_id,user_id,filename,file_size,
                   extracted_data,confidence_score,validation_status)
                   VALUES (%s,%s,%s,%s,%s,%s,'pending')""",
                (doc_id, cu["id"], file.filename, len(content), json.dumps(extracted), conf),
            )
        conn.commit()
    except Exception as e:
        conn.rollback(); raise HTTPException(500, f"DB error: {e}")
    finally:
        conn.close()

    return {"document_id": doc_id, "filename": file.filename,
            "ocr_confidence": conf, "extracted_data": extracted}

@app.get("/api/documents/list", tags=["Documents"])
async def list_documents(cu=Depends(get_current_user), limit: int = 20, offset: int = 0):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """SELECT document_id, filename, file_size, extracted_data,
                          confidence_score, validation_status, created_at
                   FROM documents WHERE user_id = %s ORDER BY created_at DESC LIMIT %s OFFSET %s""",
                (cu["id"], limit, offset),
            )
            rows = cur.fetchall()
            cur.execute("SELECT COUNT(*) AS total FROM documents WHERE user_id = %s", (cu["id"],))
            total = cur.fetchone()["total"]
    finally: conn.close()
    return {"total": total, "offset": offset, "limit": limit, "documents": [dict(r) for r in rows]}
@app.get("/", tags=["System"])
async def root():
    return {"name": "AI Import Export Intelligence", "version": "3.4.0",
            "ml_model_trained": hsn_classifier is not None, "status": "running", "docs": "/docs"}

@app.get("/health", tags=["System"])
async def health():
    db_ok = False
    try:
        conn = get_db()
        with conn.cursor() as cur: cur.execute("SELECT 1")
        conn.close(); db_ok = True
    except Exception as e: print(f"DB health check failed: {e}")
    return {"status": "healthy" if db_ok else "degraded – check Supabase credentials",
            "ml_model_loaded": hsn_classifier is not None, "db_connected": db_ok,
            "ocr_engine": "pdfplumber + fitz (no system deps)",
            "timestamp": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)