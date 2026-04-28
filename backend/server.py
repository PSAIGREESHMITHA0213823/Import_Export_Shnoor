# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import Optional
# import uvicorn

# app = FastAPI()

# # Enable CORS for frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Request/Response Models
# class RegisterData(BaseModel):
#     username: str
#     password: str
#     email: Optional[str] = ""
#     full_name: Optional[str] = ""
#     company_name: Optional[str] = ""
#     phone: Optional[str] = ""
#     role: Optional[str] = "importer"

# class LoginData(BaseModel):
#     username: str
#     password: str

# class HSNData(BaseModel):
#     product_description: str
#     country: Optional[str] = "IN"

# class DutyData(BaseModel):
#     hsn_code: str
#     value: float
#     quantity: int
#     destination: Optional[str] = "IN"

# # In-memory storage
# users_db = {}

# # Root endpoint
# @app.get("/")
# async def root():
#     return {"message": "Trade Intelligence API Running", "status": "active", "port": 8000}

# # Health check
# @app.get("/api/health")
# async def health():
#     return {"status": "healthy", "timestamp": "2024-01-01"}

# # Register endpoint
# @app.post("/api/auth/register")
# async def register(data: RegisterData):
#     print(f"Register attempt: {data.username}")
    
#     if data.username in users_db:
#         return {"success": False, "message": "Username already exists"}
    
#     users_db[data.username] = {
#         "username": data.username,
#         "password": data.password,
#         "email": data.email,
#         "full_name": data.full_name,
#         "company_name": data.company_name,
#         "phone": data.phone,
#         "role": data.role,
#         "user_id": len(users_db) + 1
#     }
    
#     return {
#         "success": True,
#         "message": "Registration successful",
#         "user_id": users_db[data.username]["user_id"],
#         "username": data.username,
#         "role": data.role
#     }

# # Login endpoint
# @app.post("/api/auth/login")
# async def login(data: LoginData):
#     print(f"Login attempt: {data.username}")
    
#     user = users_db.get(data.username)
#     if not user or user["password"] != data.password:
#         return {"success": False, "message": "Invalid credentials"}
    
#     return {
#         "success": True,
#         "access_token": f"token_{data.username}_12345",
#         "user_id": user["user_id"],
#         "username": user["username"],
#         "role": user["role"],
#         "full_name": user.get("full_name", data.username)
#     }

# # HSN Classification
# @app.post("/api/hsn/classify")
# async def classify_hsn(data: HSNData):
#     desc = data.product_description.lower()
    
#     # Simple keyword-based classification
#     if any(word in desc for word in ["laptop", "computer", "mac", "dell", "hp", "lenovo"]):
#         return {
#             "hsn_code": "84713000",
#             "confidence": 0.95,
#             "description": "Portable Automatic Data Processing Machine",
#             "duty_rate": 0.00,
#             "gst_rate": 0.18,
#             "category": "Electronics"
#         }
#     elif any(word in desc for word in ["phone", "mobile", "iphone", "samsung", "smartphone"]):
#         return {
#             "hsn_code": "85171300",
#             "confidence": 0.92,
#             "description": "Smartphones",
#             "duty_rate": 0.20,
#             "gst_rate": 0.18,
#             "category": "Communication Devices"
#         }
#     elif any(word in desc for word in ["medicine", "drug", "tablet", "capsule", "pharma"]):
#         return {
#             "hsn_code": "30049099",
#             "confidence": 0.88,
#             "description": "Medicaments",
#             "duty_rate": 0.10,
#             "gst_rate": 0.05,
#             "category": "Pharmaceuticals"
#         }
#     elif any(word in desc for word in ["car", "vehicle", "auto", "truck", "bus"]):
#         return {
#             "hsn_code": "87032319",
#             "confidence": 0.90,
#             "description": "Motor Vehicles",
#             "duty_rate": 0.25,
#             "gst_rate": 0.28,
#             "category": "Automotive"
#         }
#     else:
#         return {
#             "hsn_code": "84713000",
#             "confidence": 0.75,
#             "description": "General Electronic Goods",
#             "duty_rate": 0.10,
#             "gst_rate": 0.18,
#             "category": "General Goods"
#         }

# # Duty Calculation
# @app.post("/api/duty/calculate")
# async def calculate_duty(data: DutyData):
#     assessable = data.value * data.quantity
    
#     # Different rates based on HSN and destination
#     rates = {
#         "84713000": {"basic": 0.00, "gst": 0.18},
#         "85171300": {"basic": 0.20, "gst": 0.18},
#         "30049099": {"basic": 0.10, "gst": 0.05},
#         "87032319": {"basic": 0.25, "gst": 0.28},
#     }
    
#     rate = rates.get(data.hsn_code, {"basic": 0.10, "gst": 0.18})
    
#     basic_duty = assessable * rate["basic"]
#     igst = (assessable + basic_duty) * rate["gst"]
#     cess = basic_duty * 0.10 if data.hsn_code == "87032319" else 0
#     total_duty = basic_duty + igst + cess
    
#     return {
#         "assessable_value": round(assessable, 2),
#         "basic_duty": round(basic_duty, 2),
#         "igst": round(igst, 2),
#         "cess": round(cess, 2),
#         "total_duty": round(total_duty, 2),
#         "landed_cost": round(assessable + total_duty, 2),
#         "effective_rate": round((total_duty / assessable) * 100, 2)
#     }

# # Risk Assessment
# @app.get("/api/risk/client/{client_id}")
# async def assess_risk(client_id: int):
#     return {
#         "risk_score": 25,
#         "risk_level": "LOW",
#         "risk_color": "green",
#         "recommendation": "Standard terms approved",
#         "credit_limit": 500000,
#         "payment_history": "Good",
#         "on_time_percentage": 95.5
#     }

# # Shipment Tracking
# @app.post("/api/shipments/create")
# async def create_shipment(data: dict):
#     import random
#     import uuid
    
#     tracking_id = f"TRK{random.randint(100000, 999999)}"
    
#     return {
#         "shipment_id": str(uuid.uuid4())[:8],
#         "tracking_id": tracking_id,
#         "status": "confirmed",
#         "estimated_delivery": "2024-02-15",
#         "message": "Shipment created successfully"
#     }

# @app.get("/api/tracking/{tracking_id}")
# async def track_shipment(tracking_id: str):
#     return {
#         "tracking_id": tracking_id,
#         "status": "In Transit",
#         "current_location": "Singapore Port",
#         "progress": 65,
#         "estimated_arrival": "2024-02-15",
#         "last_update": "2024-01-20T10:30:00Z"
#     }

# # Analytics Dashboard
# @app.get("/api/analytics/dashboard")
# async def get_analytics():
#     return {
#         "summary": {
#             "total_shipments": 156,
#             "active_shipments": 24,
#             "total_value_usd": 2450000,
#             "risk_alerts": 3,
#             "compliance_rate": 94.5
#         },
#         "risk_distribution": {
#             "low": 65,
#             "medium": 25,
#             "high": 10
#         },
#         "recent_shipments": [
#             {"id": "SHP-001", "origin": "Shanghai", "destination": "Mumbai", "status": "In Transit", "value": 45000},
#             {"id": "SHP-002", "origin": "Singapore", "destination": "Delhi", "status": "Delivered", "value": 32000},
#             {"id": "SHP-003", "origin": "Hamburg", "destination": "Chennai", "status": "Customs", "value": 67000}
#         ]
#     }

# if __name__ == "__main__":
#     print("=" * 50)
#     print("🚀 Starting Trade Intelligence Backend Server")
#     print("=" * 50)
#     print("📍 Server will run at: http://localhost:8000")
#     print("📚 API Docs: http://localhost:8000/docs")
#     print("-" * 50)
#     print("✅ Ready to accept requests!")
#     print("=" * 50)
    
#     uvicorn.run(app, host="127.0.0.1", port=8001, log_level="info")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI()

# Configure CORS properly - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Request/Response Models
class RegisterData(BaseModel):
    username: str
    password: str
    email: Optional[str] = ""
    full_name: Optional[str] = ""
    company_name: Optional[str] = ""
    phone: Optional[str] = ""
    role: Optional[str] = "importer"

class LoginData(BaseModel):
    username: str
    password: str

class HSNData(BaseModel):
    product_description: str
    country: Optional[str] = "IN"

class DutyData(BaseModel):
    hsn_code: str
    value: float
    quantity: int
    destination: Optional[str] = "IN"

# In-memory storage
users_db = {}

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Trade Intelligence API Running", "status": "active", "port": 8001}

# Health check
@app.get("/api/health")
async def health():
    return {"status": "healthy", "timestamp": "2024-01-01"}

# Register endpoint
@app.post("/api/auth/register")
async def register(data: RegisterData):
    print(f"📝 Register attempt: {data.username}")
    
    if data.username in users_db:
        return {"success": False, "message": "Username already exists"}
    
    users_db[data.username] = {
        "username": data.username,
        "password": data.password,
        "email": data.email,
        "full_name": data.full_name,
        "company_name": data.company_name,
        "phone": data.phone,
        "role": data.role,
        "user_id": len(users_db) + 1
    }
    
    print(f"✅ User registered: {data.username}")
    
    return {
        "success": True,
        "message": "Registration successful",
        "user_id": users_db[data.username]["user_id"],
        "username": data.username,
        "role": data.role
    }

# Login endpoint
@app.post("/api/auth/login")
async def login(data: LoginData):
    print(f"🔐 Login attempt: {data.username}")
    
    user = users_db.get(data.username)
    if not user or user["password"] != data.password:
        return {"success": False, "message": "Invalid credentials"}
    
    print(f"✅ User logged in: {data.username}")
    
    return {
        "success": True,
        "access_token": f"token_{data.username}_12345",
        "user_id": user["user_id"],
        "username": user["username"],
        "role": user["role"],
        "full_name": user.get("full_name", data.username)
    }

# HSN Classification
@app.post("/api/hsn/classify")
async def classify_hsn(data: HSNData):
    desc = data.product_description.lower()
    
    if any(word in desc for word in ["laptop", "computer", "mac", "dell", "hp", "lenovo"]):
        return {
            "hsn_code": "84713000",
            "confidence": 0.95,
            "description": "Portable Automatic Data Processing Machine",
            "duty_rate": 0.00,
            "gst_rate": 0.18,
            "category": "Electronics"
        }
    elif any(word in desc for word in ["phone", "mobile", "iphone", "samsung", "smartphone"]):
        return {
            "hsn_code": "85171300",
            "confidence": 0.92,
            "description": "Smartphones",
            "duty_rate": 0.20,
            "gst_rate": 0.18,
            "category": "Communication Devices"
        }
    elif any(word in desc for word in ["medicine", "drug", "tablet", "capsule", "pharma"]):
        return {
            "hsn_code": "30049099",
            "confidence": 0.88,
            "description": "Medicaments",
            "duty_rate": 0.10,
            "gst_rate": 0.05,
            "category": "Pharmaceuticals"
        }
    else:
        return {
            "hsn_code": "84713000",
            "confidence": 0.75,
            "description": "General Electronic Goods",
            "duty_rate": 0.10,
            "gst_rate": 0.18,
            "category": "General Goods"
        }

# Duty Calculation
@app.post("/api/duty/calculate")
async def calculate_duty(data: DutyData):
    assessable = data.value * data.quantity
    
    rates = {
        "84713000": {"basic": 0.00, "gst": 0.18},
        "85171300": {"basic": 0.20, "gst": 0.18},
        "30049099": {"basic": 0.10, "gst": 0.05},
        "87032319": {"basic": 0.25, "gst": 0.28},
    }
    
    rate = rates.get(data.hsn_code, {"basic": 0.10, "gst": 0.18})
    
    basic_duty = assessable * rate["basic"]
    igst = (assessable + basic_duty) * rate["gst"]
    cess = basic_duty * 0.10 if data.hsn_code == "87032319" else 0
    total_duty = basic_duty + igst + cess
    
    return {
        "assessable_value": round(assessable, 2),
        "basic_duty": round(basic_duty, 2),
        "igst": round(igst, 2),
        "cess": round(cess, 2),
        "total_duty": round(total_duty, 2),
        "landed_cost": round(assessable + total_duty, 2),
        "effective_rate": round((total_duty / assessable) * 100, 2)
    }

# Risk Assessment
@app.get("/api/risk/client/{client_id}")
async def assess_risk(client_id: int):
    return {
        "risk_score": 25,
        "risk_level": "LOW",
        "risk_color": "green",
        "recommendation": "Standard terms approved",
        "credit_limit": 500000
    }

# Analytics Dashboard
@app.get("/api/analytics/dashboard")
async def get_analytics():
    return {
        "summary": {
            "total_shipments": 156,
            "active_shipments": 24,
            "total_value_usd": 2450000,
            "risk_alerts": 3,
            "compliance_rate": 94.5
        },
        "risk_distribution": {
            "low": 65,
            "medium": 25,
            "high": 10
        },
        "recent_shipments": [
            {"id": "SHP-001", "origin": "Shanghai", "destination": "Mumbai", "status": "In Transit", "value": 45000},
            {"id": "SHP-002", "origin": "Singapore", "destination": "Delhi", "status": "Delivered", "value": 32000}
        ]
    }

if __name__ == "__main__":
    print("=" * 50)
    print("🚀 Starting Trade Intelligence Backend Server")
    print("=" * 50)
    print("📍 Server running at: http://localhost:8001")
    print("📚 API Docs: http://localhost:8001/docs")
    print("-" * 50)
    print("✅ CORS enabled for http://localhost:3000 and http://localhost:3001")
    print("=" * 50)
    
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")