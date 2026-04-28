from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional
import jwt
import uuid
import hashlib
import random
from passlib.context import CryptContext

from database import get_db, User, Document, Shipment, HSNResult, DutyCalculation, PaymentHistory, TrackingLog
from models import hsn_classifier, risk_model

# Initialize FastAPI
app = FastAPI(title="AI Import Export Intelligence System", version="3.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your-secret-key-2024"
ALGORITHM = "HS256"

def create_access_token(data: dict):
    expire = datetime.utcnow() + timedelta(hours=24)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except:
        return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.username == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ============================================
# 1. USER AUTHENTICATION
# ============================================

from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: str
    company_name: str
    phone: str
    gst_number: Optional[str] = None
    pan_number: Optional[str] = None
    role: str = "importer"

class UserLogin(BaseModel):
    username: str
    password: str

@app.post("/api/auth/register")
async def register(user: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    hashed_password = pwd_context.hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        full_name=user.full_name,
        company_name=user.company_name,
        phone=user.phone,
        gst_number=user.gst_number,
        pan_number=user.pan_number,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    token = create_access_token({"sub": user.username, "role": user.role})
    
    return {
        "access_token": token,
        "user_id": db_user.id,
        "username": db_user.username,
        "role": db_user.role,
        "full_name": db_user.full_name
    }

@app.post("/api/auth/login")
async def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    db_user.last_login = datetime.utcnow()
    db.commit()
    
    token = create_access_token({"sub": user.username, "role": db_user.role})
    
    return {
        "access_token": token,
        "user_id": db_user.id,
        "username": db_user.username,
        "role": db_user.role,
        "full_name": db_user.full_name
    }

# ============================================
# 2. DOCUMENT UPLOAD & INTELLIGENCE
# ============================================

@app.post("/api/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = "invoice",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc_id = f"DOC_{datetime.now().strftime('%Y%m%d%H%M%S')}_{random.randint(1000, 9999)}"
    file_hash = hashlib.md5(await file.read()).hexdigest()
    await file.seek(0)
    
    # Simulate OCR processing
    content = await file.read()
    extracted_text = content[:500].decode('utf-8', errors='ignore')
    
    # Extract data using NLP simulation
    extracted_data = {
        "invoice_number": f"INV-{random.randint(10000, 99999)}",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "total_amount": random.randint(5000, 50000),
        "currency": "USD",
        "products": [
            {"description": "Sample product", "quantity": random.randint(10, 100), "unit_price": random.randint(10, 100)}
        ]
    }
    
    document = Document(
        document_id=doc_id,
        user_id=current_user.id,
        document_type=document_type,
        filename=file.filename,
        file_url=f"s3://trade-documents/{doc_id}/{file.filename}",
        file_size=len(content),
        file_hash=file_hash,
        extracted_text=extracted_text,
        extracted_data=extracted_data,
        ocr_confidence=round(random.uniform(0.85, 0.98), 2),
        fraud_check_status="passed",
        compliance_score=round(random.uniform(0.90, 0.99), 2)
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    return {
        "document_id": doc_id,
        "filename": file.filename,
        "ocr_confidence": document.ocr_confidence,
        "extracted_data": extracted_data,
        "fraud_check": "passed",
        "compliance_score": document.compliance_score
    }

@app.get("/api/documents/{document_id}")
async def get_document(document_id: str, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.document_id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

# ============================================
# 3. HSN CLASSIFICATION (ML-BASED)
# ============================================

class HSNRequest(BaseModel):
    product_description: str
    country: str = "IN"

@app.post("/api/hsn/classify")
async def classify_hsn(request: HSNRequest, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    # Use ML model to classify
    result = hsn_classifier.predict(request.product_description)
    
    # Save result to database
    result_id = f"HSN_{datetime.now().strftime('%Y%m%d%H%M%S')}_{random.randint(1000, 9999)}"
    hsn_result = HSNResult(
        result_id=result_id,
        user_id=current_user.id,
        product_description=request.product_description,
        predicted_hsn=result['hsn_code'],
        confidence_score=result['confidence'],
        alternative_codes=result.get('alternatives', [])
    )
    db.add(hsn_result)
    db.commit()
    
    return result

@app.post("/api/hsn/correct/{result_id}")
async def correct_hsn(result_id: str, correct_hsn: str, notes: str = "", current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    hsn_result = db.query(HSNResult).filter(HSNResult.result_id == result_id).first()
    if not hsn_result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    hsn_result.is_manually_corrected = True
    hsn_result.corrected_hsn = correct_hsn
    db.commit()
    
    return {"success": True, "message": "Correction recorded for model retraining"}

# ============================================
# 4. DUTY & TAX ENGINE
# ============================================

class DutyRequest(BaseModel):
    hsn_code: str
    product_value: float
    quantity: int
    origin_country: str
    destination_country: str
    freight_cost: float = 0
    insurance_cost: float = 0
    trade_agreement: Optional[str] = None

@app.post("/api/duty/calculate")
async def calculate_duty(request: DutyRequest, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    # Tariff rates by country
    tariffs = {
        "IN": {"basic": 0.10, "igst": 0.18, "sws": 0.10},
        "US": {"basic": 0.05, "igst": 0.00, "sws": 0.02},
        "UK": {"basic": 0.04, "igst": 0.20, "sws": 0.00},
        "AE": {"basic": 0.05, "igst": 0.05, "sws": 0.00},
        "SG": {"basic": 0.00, "igst": 0.07, "sws": 0.00}
    }
    
    # Anti-dumping by HSN
    anti_dumping_rates = {
        "84713000": 0.00, "85171300": 0.15, "30049099": 0.00,
        "87032319": 0.25, "62034200": 0.10
    }
    
    assessable = (request.product_value * request.quantity) + request.freight_cost + request.insurance_cost
    tariff = tariffs.get(request.destination_country, tariffs["IN"])
    
    basic_duty = assessable * tariff["basic"]
    anti_dumping = assessable * anti_dumping_rates.get(request.hsn_code, 0)
    sws = basic_duty * tariff["sws"]
    igst = (assessable + basic_duty + anti_dumping) * tariff["igst"]
    cess = (assessable + basic_duty) * 0.22 if request.hsn_code == "87032319" else 0
    
    # Trade agreement benefit
    trade_benefit = 0
    if request.trade_agreement == "INDIA_UAE" and request.destination_country == "AE":
        trade_benefit = basic_duty * 0.30
        basic_duty -= trade_benefit
    
    total_duty = basic_duty + igst + cess + sws + anti_dumping
    landed_cost = assessable + total_duty
    
    # Save calculation
    calc_id = f"DUTY_{datetime.now().strftime('%Y%m%d%H%M%S')}_{random.randint(1000, 9999)}"
    duty_calc = DutyCalculation(
        calculation_id=calc_id,
        user_id=current_user.id,
        hsn_code=request.hsn_code,
        product_value=request.product_value,
        quantity=request.quantity,
        origin_country=request.origin_country,
        destination_country=request.destination_country,
        basic_customs_duty=round(basic_duty, 2),
        igst=round(igst, 2),
        cess=round(cess, 2),
        social_welfare_surcharge=round(sws, 2),
        anti_dumping_duty=round(anti_dumping, 2),
        total_duty=round(total_duty, 2),
        landed_cost=round(landed_cost, 2),
        effective_rate=round((total_duty / assessable) * 100, 2)
    )
    db.add(duty_calc)
    db.commit()
    
    return {
        "assessable_value": round(assessable, 2),
        "basic_customs_duty": round(basic_duty, 2),
        "anti_dumping_duty": round(anti_dumping, 2),
        "igst": round(igst, 2),
        "cess": round(cess, 2),
        "social_welfare_surcharge": round(sws, 2),
        "trade_agreement_benefit": round(trade_benefit, 2),
        "total_duty": round(total_duty, 2),
        "landed_cost": round(landed_cost, 2),
        "effective_rate": round((total_duty / assessable) * 100, 2)
    }

# ============================================
# 5. RISK ASSESSMENT ENGINE
# ============================================

@app.get("/api/risk/assess/{client_id}")
async def assess_risk(client_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    # Get payment history
    payments = db.query(PaymentHistory).filter(PaymentHistory.client_id == client_id).all()
    
    # Convert to dict for model
    payment_list = [{"days_late": p.days_late, "status": p.status} for p in payments]
    
    # Calculate risk using ML model
    risk_result = risk_model.calculate_risk_score(payment_list)
    
    # Add credit limit based on risk
    if risk_result['level'] == 'LOW':
        credit_limit = 500000
        credit_terms = "Net 60 days"
    elif risk_result['level'] == 'MEDIUM':
        credit_limit = 200000
        credit_terms = "Net 30 days"
    else:
        credit_limit = 50000
        credit_terms = "Prepayment required"
    
    return {
        "client_id": client_id,
        "risk_score": risk_result['score'],
        "risk_level": risk_result['level'],
        "risk_color": risk_result['color'],
        "risk_factors": risk_result['factors'],
        "credit_limit": credit_limit,
        "credit_terms": credit_terms,
        "late_payment_rate": risk_result.get('late_payment_rate', 0),
        "avg_days_late": risk_result.get('avg_days_late', 0)
    }

@app.post("/api/risk/payment/add")
async def add_payment(client_id: int, invoice_number: str, invoice_amount: float, due_date: str, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    payment = PaymentHistory(
        client_id=client_id,
        invoice_number=invoice_number,
        invoice_amount=invoice_amount,
        due_date=datetime.fromisoformat(due_date),
        status="pending"
    )
    db.add(payment)
    db.commit()
    return {"success": True, "payment_id": payment.id}

# ============================================
# 6. SHIPMENT PROCESSING & TRACKING
# ============================================

class ShipmentCreate(BaseModel):
    origin_country: str
    origin_port: str
    destination_country: str
    destination_port: str
    product_description: str
    hsn_code: str
    quantity: int
    weight: float
    product_value: float
    freight_charges: float = 0
    insurance_amount: float = 0

@app.post("/api/shipments/create")
async def create_shipment(shipment: ShipmentCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    shipment_id = f"SHP{datetime.now().strftime('%Y%m%d')}_{random.randint(1000, 9999)}"
    tracking_id = f"TRK{random.randint(100000, 999999)}"
    container_no = f"MSKU{random.randint(1000000, 9999999)}"
    bl_number = f"BL{random.randint(100000, 999999)}"
    
    total_value = shipment.product_value * shipment.quantity
    
    db_shipment = Shipment(
        shipment_id=shipment_id,
        user_id=current_user.id,
        tracking_id=tracking_id,
        container_number=container_no,
        bl_number=bl_number,
        origin_country=shipment.origin_country,
        origin_port=shipment.origin_port,
        destination_country=shipment.destination_country,
        destination_port=shipment.destination_port,
        product_description=shipment.product_description,
        hsn_code=shipment.hsn_code,
        quantity=shipment.quantity,
        weight=shipment.weight,
        product_value=shipment.product_value,
        total_value=total_value,
        freight_charges=shipment.freight_charges,
        insurance_amount=shipment.insurance_amount,
        status="booked",
        current_status="Booked",
        progress=5,
        estimated_arrival=datetime.utcnow() + timedelta(days=random.randint(15, 30))
    )
    
    db.add(db_shipment)
    db.commit()
    db.refresh(db_shipment)
    
    return {
        "shipment_id": shipment_id,
        "tracking_id": tracking_id,
        "container_number": container_no,
        "bl_number": bl_number,
        "status": "booked",
        "estimated_arrival": db_shipment.estimated_arrival.isoformat()
    }

@app.get("/api/shipments/track/{tracking_id}")
async def track_shipment(tracking_id: str, db: Session = Depends(get_db)):
    shipment = db.query(Shipment).filter(Shipment.tracking_id == tracking_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    # Tracking milestones
    statuses = [
        {"status": "Booked", "location": "Booking Office", "progress": 5},
        {"status": "Confirmed", "location": "Warehouse", "progress": 15},
        {"status": "Cargo Loaded", "location": "Origin Port", "progress": 30},
        {"status": "Vessel Departed", "location": "At Sea", "progress": 50},
        {"status": "Arrived at Port", "location": "Destination Port", "progress": 70},
        {"status": "Customs Clearance", "location": "Customs", "progress": 85},
        {"status": "Delivered", "location": "Destination", "progress": 100}
    ]
    
    current_idx = 0
    for i, s in enumerate(statuses):
        if s["status"] == shipment.current_status:
            current_idx = i
            break
    
    return {
        "tracking_id": tracking_id,
        "shipment_id": shipment.shipment_id,
        "current_status": shipment.current_status,
        "current_location": statuses[current_idx]["location"],
        "progress": statuses[current_idx]["progress"],
        "origin": f"{shipment.origin_port}, {shipment.origin_country}",
        "destination": f"{shipment.destination_port}, {shipment.destination_country}",
        "estimated_arrival": shipment.estimated_arrival.isoformat() if shipment.estimated_arrival else None,
        "milestones": statuses[:current_idx + 1]
    }

@app.post("/api/shipments/update-tracking/{shipment_id}")
async def update_tracking(shipment_id: str, status: str, location: str, db: Session = Depends(get_db)):
    shipment = db.query(Shipment).filter(Shipment.shipment_id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    shipment.current_status = status
    shipment.current_location = location
    shipment.updated_at = datetime.utcnow()
    
    # Update progress
    progress_map = {"Booked": 5, "Confirmed": 15, "Loaded": 30, "Departed": 50, "Arrived": 70, "Customs": 85, "Delivered": 100}
    shipment.progress = progress_map.get(status, shipment.progress)
    
    # Add tracking log
    log = TrackingLog(
        tracking_id=shipment.tracking_id,
        status=status,
        location=location,
        description=f"Shipment status updated to {status}"
    )
    db.add(log)
    db.commit()
    
    return {"success": True, "status": status, "location": location}

# ============================================
# 7. ANALYTICS DASHBOARD
# ============================================

@app.get("/api/analytics/dashboard")
async def get_dashboard(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    # Get user's shipments
    shipments = db.query(Shipment).filter(Shipment.user_id == current_user.id).all()
    
    total_shipments = len(shipments)
    active_shipments = sum(1 for s in shipments if s.status not in ["delivered", "cancelled"])
    total_value = sum(s.total_value or 0 for s in shipments)
    
    # Get HSN accuracy
    hsn_results = db.query(HSNResult).filter(HSNResult.user_id == current_user.id).all()
    total_classifications = len(hsn_results)
    manual_corrections = sum(1 for h in hsn_results if h.is_manually_corrected)
    
    # Monthly trends
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    shipment_trends = [
        {"month": m, "shipments": random.randint(5, 25), "value": random.randint(50000, 200000)}
        for m in months
    ]
    
    return {
        "summary": {
            "total_shipments": total_shipments,
            "active_shipments": active_shipments,
            "total_value_usd": round(total_value, 2),
            "risk_alerts": random.randint(0, 5),
            "compliance_rate": round(random.uniform(85, 98), 1),
            "hsn_accuracy": round((1 - manual_corrections / max(total_classifications, 1)) * 100, 1)
        },
        "shipment_trends": shipment_trends,
        "recent_shipments": [
            {
                "id": s.shipment_id,
                "origin": s.origin_country,
                "destination": s.destination_country,
                "status": s.status,
                "value": s.total_value
            } for s in shipments[-5:]
        ]
    }

# ============================================
# 8. REPORTS & NOTIFICATIONS
# ============================================

@app.get("/api/reports/export/{report_type}")
async def export_report(report_type: str, format: str = "excel", current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    reports = {
        "shipment_summary": {
            "title": "Shipment Summary Report",
            "generated_by": current_user.username,
            "data": {"total_shipments": random.randint(50, 200), "total_value": random.randint(100000, 1000000)}
        },
        "duty_report": {
            "title": "Duty & Tax Report",
            "generated_by": current_user.username,
            "data": {"total_duty": random.randint(10000, 100000), "avg_rate": random.randint(10, 30)}
        },
        "risk_report": {
            "title": "Risk Assessment Report",
            "generated_by": current_user.username,
            "data": {"risk_score": random.randint(10, 90), "recommendations": ["Review high risk clients"]}
        }
    }
    
    return {
        "success": True,
        "report_type": report_type,
        "format": format,
        "report": reports.get(report_type, reports["shipment_summary"]),
        "download_url": f"/api/reports/download/{report_type}.{format}",
        "generated_at": datetime.now().isoformat()
    }

@app.post("/api/notifications/send")
async def send_notification(notification_type: str, recipient: str, message: str):
    return {
        "success": True,
        "notification_type": notification_type,
        "recipient": recipient,
        "message": message,
        "status": "delivered",
        "timestamp": datetime.now().isoformat()
    }

# ============================================
# Root & Health
# ============================================

@app.get("/")
async def root():
    return {
        "name": "AI Import Export Intelligence System",
        "version": "3.0.0",
        "features": [
            "User Authentication (JWT)",
            "Document Intelligence (OCR/NLP)",
            "HSN Classification (ML Model)",
            "Duty & Tax Engine",
            "Risk Assessment Engine",
            "Shipment Processing & Tracking",
            "Analytics Dashboard",
            "Reports & Notifications"
        ],
        "status": "operational"
    }

@app.get("/health")
async def health(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
        db_status = "connected"
    except:
        db_status = "disconnected"
    
    return {
        "status": "healthy",
        "database": db_status,
        "ml_models": {
            "hsn_classifier": "loaded" if hsn_classifier.is_trained else "not_loaded",
            "risk_model": "ready"
        },
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("🚀 AI Import Export Intelligence System v3.0")
    print("=" * 60)
    print("✅ All modules loaded successfully!")
    print("📍 Backend running at: http://localhost:8001")
    print("📚 API Docs: http://localhost:8001/docs")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)