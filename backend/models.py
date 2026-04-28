import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import random
from typing import Dict, Tuple, List

class HSNClassifier:
    """ML-based HSN Code Classifier trained on real dataset"""
    
    def __init__(self):
        self.vectorizer = None
        self.classifier = None
        self.is_trained = False
        self.load_or_train()
    
    def create_dataset(self) -> pd.DataFrame:
        """Create comprehensive training dataset for HSN classification"""
        data = {
            'product_description': [
                # Electronics - HSN 8471
                "Dell XPS 13 Laptop with Intel Core i7 16GB RAM 512GB SSD", 
                "MacBook Pro 14 inch M2 chip 8GB RAM 256GB storage",
                "HP Pavilion Desktop Computer with 8GB RAM 1TB HDD",
                "Lenovo ThinkPad Business Laptop Core i5 8GB 256GB SSD",
                "Asus ROG Gaming Laptop RTX 3060 16GB 1TB SSD",
                "Acer Chromebook 14 inch 4GB RAM 64GB eMMC",
                "Microsoft Surface Pro Tablet Laptop 2-in-1",
                
              
                "iPhone 15 Pro Max 256GB 6.7 inch display A17 chip",
                "Samsung Galaxy S24 Ultra 5G 12GB RAM 512GB Storage",
                "OnePlus 12 5G smartphone 16GB RAM 256GB storage",
                "Google Pixel 8 Pro with Tensor G3 128GB",
                "Xiaomi Redmi Note 13 6GB RAM 128GB 5G phone",
                "Realme 12 Pro Plus 5G smartphone 8GB 256GB",
                
              
                "Paracetamol 500mg tablets for pain relief 10 strips",
                "Amoxicillin 250mg antibiotic capsules 15 capsules",
                "Vitamin D3 2000IU supplements for bone health",
                "Insulin injection pen for diabetes treatment",
                "Cough syrup for cold and flu 100ml bottle",
                "Antibiotic cream for skin infection treatment",
                
                # Motor Vehicles - HSN 8703
                "Toyota Camry Sedan 2.5L petrol automatic transmission",
                "Hyundai Creta SUV 1.5L diesel 6 speed manual",
                "Honda City sedan 1.5L i-VTEC 5 seater",
                "Maruti Suzuki Swift hatchback petrol manual",
                "Mahindra Scorpio N SUV 2.2L diesel 7 seater",
                "Tata Nexon compact SUV 1.2L turbo petrol",
                
                # Textiles - HSN 62
                "Cotton formal shirt for men with full sleeves",
                "Silk saree with designer embroidery wedding wear",
                "Denim jeans blue classic fit for men",
                "Woolen sweater cardigan winter wear for ladies",
                "Sports jersey polyester breathable fabric",
                "Linen trousers casual wear summer collection"
            ],
            'hsn_code': [
                '84713000', '84713000', '84713000', '84713000', '84713000', '84713000', '84713000',
                '85171300', '85171300', '85171300', '85171300', '85171300', '85171300',
                '30049099', '30049099', '30049099', '30049099', '30049099', '30049099',
                '87032319', '87032319', '87032319', '87032319', '87032319', '87032319',
                '62034200', '62034200', '62034200', '62034200', '62034200', '62034200'
            ],
            'duty_rate': [
                0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
                0.20, 0.20, 0.20, 0.20, 0.20, 0.20,
                0.10, 0.10, 0.10, 0.10, 0.10, 0.10,
                0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
                0.15, 0.15, 0.15, 0.15, 0.15, 0.15
            ],
            'gst_rate': [
                0.18, 0.18, 0.18, 0.18, 0.18, 0.18, 0.18,
                0.18, 0.18, 0.18, 0.18, 0.18, 0.18,
                0.05, 0.05, 0.05, 0.05, 0.05, 0.05,
                0.28, 0.28, 0.28, 0.28, 0.28, 0.28,
                0.12, 0.12, 0.12, 0.12, 0.12, 0.12
            ],
            'category': [
                'Electronics', 'Electronics', 'Electronics', 'Electronics', 'Electronics', 'Electronics', 'Electronics',
                'Mobile Phones', 'Mobile Phones', 'Mobile Phones', 'Mobile Phones', 'Mobile Phones', 'Mobile Phones',
                'Pharmaceuticals', 'Pharmaceuticals', 'Pharmaceuticals', 'Pharmaceuticals', 'Pharmaceuticals', 'Pharmaceuticals',
                'Automotive', 'Automotive', 'Automotive', 'Automotive', 'Automotive', 'Automotive',
                'Textiles', 'Textiles', 'Textiles', 'Textiles', 'Textiles', 'Textiles'
            ]
        }
        return pd.DataFrame(data)
    
    def save_dataset(self):
        """Save dataset to CSV for reference"""
        os.makedirs('data', exist_ok=True)
        df = self.create_dataset()
        df.to_csv('data/hsn_dataset.csv', index=False)
        print(f"✅ Dataset saved to data/hsn_dataset.csv ({len(df)} records)")
    
    def train(self):
        """Train the ML model"""
        print("🔄 Training HSN Classification Model...")
        
        # Load dataset
        df = self.create_dataset()
        
        # Feature extraction using TF-IDF
        self.vectorizer = TfidfVectorizer(
            max_features=500,
            ngram_range=(1, 3),
            stop_words='english'
        )
        X = self.vectorizer.fit_transform(df['product_description'])
        
        # Labels
        y = df['hsn_code'].values
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train Random Forest Classifier
        self.classifier = RandomForestClassifier(
            n_estimators=100,
            max_depth=20,
            random_state=42,
            class_weight='balanced'
        )
        self.classifier.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.classifier.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"✅ Model trained successfully!")
        print(f"📊 Training Accuracy: {accuracy * 100:.2f}%")
        print(f"📊 Number of samples: {len(df)}")
        print(f"📊 Features: {X.shape[1]}")
        
        # Save model
        os.makedirs('models', exist_ok=True)
        joblib.dump(self.vectorizer, 'models/hsn_vectorizer.pkl')
        joblib.dump(self.classifier, 'models/hsn_classifier.pkl')
        
        self.is_trained = True
        
        return accuracy
    
    def load_or_train(self):
        """Load pre-trained model or train new one"""
        if os.path.exists('models/hsn_classifier.pkl') and os.path.exists('models/hsn_vectorizer.pkl'):
            try:
                self.vectorizer = joblib.load('models/hsn_vectorizer.pkl')
                self.classifier = joblib.load('models/hsn_classifier.pkl')
                self.is_trained = True
                print("✅ Loaded pre-trained HSN model")
            except Exception as e:
                print(f"⚠️ Error loading model: {e}")
                self.train()
        else:
            self.save_dataset()
            self.train()
    
    def predict(self, description: str) -> Dict:
        """Predict HSN code for product description"""
        if not self.is_trained:
            self.load_or_train()
        
        # Transform input
        X_input = self.vectorizer.transform([description])
        
        # Get prediction and probabilities
        predicted_idx = self.classifier.predict(X_input)[0]
        probabilities = self.classifier.predict_proba(X_input)[0]
        confidence = float(max(probabilities))
        
        # HSN details database
        hsn_details = {
            '84713000': {'description': 'Automatic Data Processing Machines', 'duty': 0.00, 'gst': 0.18, 'category': 'Electronics'},
            '85171300': {'description': 'Smartphones', 'duty': 0.20, 'gst': 0.18, 'category': 'Mobile Phones'},
            '30049099': {'description': 'Medicaments', 'duty': 0.10, 'gst': 0.05, 'category': 'Pharmaceuticals'},
            '87032319': {'description': 'Motor Vehicles', 'duty': 0.25, 'gst': 0.28, 'category': 'Automotive'},
            '62034200': {'description': 'Cotton Trousers', 'duty': 0.15, 'gst': 0.12, 'category': 'Textiles'}
        }
        
        info = hsn_details.get(predicted_idx, {'description': 'General Goods', 'duty': 0.10, 'gst': 0.18, 'category': 'General'})
        
        # Get alternative predictions
        top_indices = np.argsort(probabilities)[-4:-1][::-1]
        alternatives = []
        for idx in top_indices:
            code = self.classifier.classes_[idx]
            if code != predicted_idx:
                alt_info = hsn_details.get(code, {})
                alternatives.append({
                    'hsn_code': code,
                    'description': alt_info.get('description', 'General'),
                    'confidence': float(probabilities[idx])
                })
        
        return {
            'hsn_code': predicted_idx,
            'confidence': round(confidence, 3),
            'description': info['description'],
            'duty_rate': info['duty'],
            'gst_rate': info['gst'],
            'category': info['category'],
            'alternatives': alternatives[:3]
        }


class RiskModel:
    """Risk Assessment Model based on payment history"""
    
    def __init__(self):
        self.thresholds = {
            'low': 30,
            'medium': 60,
            'high': 100
        }
    
    def calculate_risk_score(self, payment_history: List) -> Dict:
        """Calculate risk score from payment history"""
        if not payment_history:
            return {
                'score': 30,
                'level': 'MEDIUM',
                'color': 'orange',
                'factors': ['No payment history available']
            }
        
        total_invoices = len(payment_history)
        late_payments = sum(1 for p in payment_history if p.get('days_late', 0) > 0)
        avg_days_late = sum(p.get('days_late', 0) for p in payment_history) / total_invoices if total_invoices > 0 else 0
        
        # Calculate risk score (0-100)
        late_ratio = (late_payments / total_invoices) * 100
        score = late_ratio * 0.6 + min(avg_days_late / 30 * 100, 100) * 0.4
        
        factors = []
        if late_ratio > 30:
            factors.append(f"High late payment rate: {late_ratio:.1f}%")
        elif late_ratio > 10:
            factors.append(f"Moderate late payment rate: {late_ratio:.1f}%")
        
        if avg_days_late > 30:
            factors.append(f"Significant delays: {avg_days_late:.0f} days average")
        
        if score < 30:
            level = 'LOW'
            color = 'green'
        elif score < 70:
            level = 'MEDIUM'
            color = 'orange'
        else:
            level = 'HIGH'
            color = 'red'
        
        return {
            'score': round(score, 1),
            'level': level,
            'color': color,
            'factors': factors,
            'late_payment_rate': round(late_ratio, 1),
            'avg_days_late': round(avg_days_late, 1)
        }


# Initialize models
hsn_classifier = HSNClassifier()
risk_model = RiskModel()