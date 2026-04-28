"""Script to train ML models with existing dataset"""

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import os
import json

def create_training_dataset():
    """Create comprehensive training dataset"""
    
    data = {
        'product_description': [
            # Electronics - 50 samples
            "Laptop computer portable personal computer", "Desktop computer tower PC", "Gaming laptop high performance",
            "Business laptop professional notebook", "Chromebook student laptop", "MacBook Apple laptop",
            "2-in-1 convertible tablet laptop", "Ultrabook thin light laptop", "Workstation laptop for programming",
            "Notebook computer with webcam", "Smartphone 5G mobile phone", "iPhone iOS smartphone",
            "Android phone with AMOLED display", "Foldable phone screen", "Gaming phone with cooling",
            "Budget phone under 20000", "Camera phone with 108MP", "Smartwatch wearable device",
            "Tablet iPad Android slate", "Smart TV 4K UHD", "Smart speaker voice assistant",
            "Wireless earbuds bluetooth", "Smart home hub device", "Digital camera mirrorless",
            "Drone quadcopter UAV", "VR headset virtual reality",
            
            # Pharmaceuticals - 30 samples
            "Paracetamol pain relief tablet", "Ibuprofen anti-inflammatory medicine", "Aspirin blood thinner",
            "Cough syrup expectorant", "Antibiotic amoxicillin", "Antihistamine allergy medicine",
            "Vitamin C supplements", "Calcium tablets for bones", "Protein powder health supplement",
            "Insulin diabetes injection", "Blood pressure medicine", "Cholesterol lowering medication",
            "Antidepressant drug", "Antiviral medication", "Antifungal cream",
            
            # Vehicles - 25 samples
            "Sedan car 4 door", "SUV sport utility vehicle", "Hatchback small car",
            "Electric vehicle EV car", "Hybrid car fuel efficient", "Luxury sedan premium",
            "Compact SUV crossover", "Pickup truck utility", "Minivan passenger van",
            "Sports car coupe", "Convertible car open top", "Jeep off-road vehicle",
            
            # Textiles - 25 samples
            "Cotton t-shirt casual wear", "Denim jeans trousers", "Silk saree ethnic wear",
            "Wool sweater winter", "Polyester shirt formal", "Linen pants summer",
            "Nylon jacket waterproof", "Rayon dress women", "Spandex activewear gym",
            "Cashmere scarf luxury", "Leather jacket biker", "Fleece hoodie warm"
        ],
        'hsn_code': [
            '84713000', '84713000', '84713000', '84713000', '84713000', '84713000',
            '84713000', '84713000', '84713000', '84713000',
            '85171300', '85171300', '85171300', '85171300', '85171300',
            '85171300', '85171300', '85171300', '85171300', '85171300',
            '85171300', '85171300', '85171300', '85171300', '85171300', '85171300',
            '30049099', '30049099', '30049099', '30049099', '30049099',
            '30049099', '30049099', '30049099', '30049099', '30049099',
            '30049099', '30049099', '30049099', '30049099', '30049099',
            '87032319', '87032319', '87032319', '87032319', '87032319',
            '87032319', '87032319', '87032319', '87032319', '87032319',
            '87032319', '87032319', '87032319', '87032319', '87032319',
            '62034200', '62034200', '62034200', '62034200', '62034200',
            '62034200', '62034200', '62034200', '62034200', '62034200',
            '62034200', '62034200', '62034200', '62034200', '62034200'
        ],
        'duty_rate': [
            0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
            0.20, 0.20, 0.20, 0.20, 0.20, 0.20, 0.20, 0.20, 0.20, 0.20,
            0.20, 0.20, 0.20, 0.20, 0.20, 0.20,
            0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10,
            0.10, 0.10, 0.10, 0.10, 0.10,
            0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
            0.25, 0.25, 0.25, 0.25, 0.25,
            0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15,
            0.15, 0.15, 0.15, 0.15, 0.15
        ]
    }
    
    return pd.DataFrame(data)

def train_model():
    """Train and save the HSN classification model"""
    
    print("=" * 60)
    print("🤖 Training AI Import Export Intelligence ML Models")
    print("=" * 60)
    
    # Load dataset
    df = create_training_dataset()
    print(f"\n📊 Dataset loaded: {len(df)} samples")
    print(f"📊 HSN Classes: {df['hsn_code'].nunique()}")
    
    # Feature extraction
    print("\n🔄 Extracting features using TF-IDF...")
    vectorizer = TfidfVectorizer(
        max_features=500,
        ngram_range=(1, 3),
        stop_words='english',
        min_df=2
    )
    X = vectorizer.fit_transform(df['product_description'])
    y = df['hsn_code']
    
    print(f"📊 Feature matrix shape: {X.shape}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"📊 Training samples: {X_train.shape[0]}")
    print(f"📊 Testing samples: {X_test.shape[0]}")
    
    # Train model
    print("\n🔄 Training Random Forest Classifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    print(f"\n📊 Training Accuracy: {train_score * 100:.2f}%")
    print(f"📊 Testing Accuracy: {test_score * 100:.2f}%")
    
    # Cross validation
    cv_scores = cross_val_score(model, X, y, cv=5)
    print(f"📊 Cross-validation Score: {cv_scores.mean() * 100:.2f}% (+/- {cv_scores.std() * 100:.2f}%)")
    
    # Detailed report
    print("\n📊 Classification Report:")
    print(classification_report(y_test, model.predict(X_test)))
    
    # Save model
    os.makedirs('models', exist_ok=True)
    joblib.dump(vectorizer, 'models/hsn_vectorizer.pkl')
    joblib.dump(model, 'models/hsn_classifier.pkl')
    
    print("\n✅ Model saved to models/ directory")
    
    # Test predictions
    print("\n🔍 Testing predictions:")
    test_products = [
        "Dell XPS laptop with Intel i7 processor",
        "iPhone 15 Pro Max 256GB smartphone",
        "Paracetamol 500mg tablets for fever",
        "Toyota Camry sedan petrol automatic",
        "Cotton shirt for men formal wear"
    ]
    
    for product in test_products:
        X_test_input = vectorizer.transform([product])
        pred = model.predict(X_test_input)[0]
        proba = model.predict_proba(X_test_input)[0].max()
        
        # Map HSN to description
        hsn_map = {
            '84713000': 'Electronics/Laptop',
            '85171300': 'Mobile Phone',
            '30049099': 'Pharmaceutical',
            '87032319': 'Motor Vehicle',
            '62034200': 'Textile/Apparel'
        }
        
        print(f"   • {product[:40]}... → {pred} ({hsn_map.get(pred, 'General')}, {proba*100:.1f}% confidence)")
    
    print("\n" + "=" * 60)
    print("✅ Training completed successfully!")
    print("=" * 60)
    
    return model, vectorizer

if __name__ == "__main__":
    train_model()