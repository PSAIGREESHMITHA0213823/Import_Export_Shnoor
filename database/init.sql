CREATE DATABASE IF NOT EXISTS trade_intelligence_db;

\c trade_intelligence_db;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    company_name VARCHAR(255),
    phone VARCHAR(20),
    gst_number VARCHAR(50),
    pan_number VARCHAR(50),
    role VARCHAR(50) DEFAULT 'importer',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shipments (
    id SERIAL PRIMARY KEY,
    shipment_id VARCHAR(100) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    tracking_id VARCHAR(100),
    container_number VARCHAR(100),
    origin_country VARCHAR(100),
    destination_country VARCHAR(100),
    status VARCHAR(50),
    total_value DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    document_id VARCHAR(100) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    shipment_id INTEGER REFERENCES shipments(id),
    filename VARCHAR(255),
    file_path TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hsn_results (
    id SERIAL PRIMARY KEY,
    result_id VARCHAR(100) UNIQUE NOT NULL,
    hsn_code VARCHAR(20),
    product_description TEXT,
    confidence_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, hashed_password, full_name, company_name, phone, role) 
VALUES ('demo', 'demo@trade.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtXt1cQZpZQxW', 'Demo User', 'Trade Corp', '9999999999', 'admin')
ON CONFLICT (username) DO NOTHING;