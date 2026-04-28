from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, JSON, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import func
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255))
    company_name = Column(String(255))
    phone = Column(String(20))
    gst_number = Column(String(50))
    pan_number = Column(String(50))
    role = Column(String(50), default="importer")  # admin, importer, exporter, broker
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(String(100), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_type = Column(String(50))  # invoice, bl, packing_list
    filename = Column(String(255))
    file_url = Column(String(500))
    file_size = Column(Integer)
    file_hash = Column(String(64))
    extracted_text = Column(Text)
    extracted_data = Column(JSON)
    ocr_confidence = Column(Float)
    fraud_check_status = Column(String(50), default="pending")
    compliance_score = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Shipment(Base):
    __tablename__ = "shipments"
    
    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(String(100), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tracking_id = Column(String(100), unique=True)
    container_number = Column(String(100))
    bl_number = Column(String(100))
    origin_country = Column(String(100))
    origin_port = Column(String(100))
    destination_country = Column(String(100))
    destination_port = Column(String(100))
    product_description = Column(Text)
    hsn_code = Column(String(20))
    quantity = Column(Integer)
    weight = Column(Float)
    product_value = Column(Float)
    currency = Column(String(3), default="USD")
    total_value = Column(Float)
    freight_charges = Column(Float)
    insurance_amount = Column(Float)
    status = Column(String(50), default="draft")
    current_location = Column(String(255))
    current_status = Column(String(50), default="Booked")
    progress = Column(Integer, default=0)
    estimated_arrival = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class HSNResult(Base):
    __tablename__ = "hsn_results"
    
    id = Column(Integer, primary_key=True, index=True)
    result_id = Column(String(100), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    shipment_id = Column(Integer, ForeignKey("shipments.id"))
    product_description = Column(Text)
    predicted_hsn = Column(String(20))
    confidence_score = Column(Float)
    alternative_codes = Column(JSON)
    is_manually_corrected = Column(Boolean, default=False)
    corrected_hsn = Column(String(20))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DutyCalculation(Base):
    __tablename__ = "duty_calculations"
    
    id = Column(Integer, primary_key=True, index=True)
    calculation_id = Column(String(100), unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    shipment_id = Column(Integer, ForeignKey("shipments.id"))
    hsn_code = Column(String(20))
    product_value = Column(Float)
    quantity = Column(Integer)
    origin_country = Column(String(100))
    destination_country = Column(String(100))
    basic_customs_duty = Column(Float)
    igst = Column(Float)
    cess = Column(Float)
    social_welfare_surcharge = Column(Float)
    anti_dumping_duty = Column(Float)
    total_duty = Column(Float)
    landed_cost = Column(Float)
    effective_rate = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PaymentHistory(Base):
    __tablename__ = "payment_history"
    
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"))
    invoice_number = Column(String(100))
    invoice_amount = Column(Float)
    due_date = Column(DateTime)
    payment_date = Column(DateTime, nullable=True)
    days_late = Column(Integer, default=0)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class TrackingLog(Base):
    __tablename__ = "tracking_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    tracking_id = Column(String(100), ForeignKey("shipments.tracking_id"))
    status = Column(String(50))
    location = Column(String(255))
    description = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()