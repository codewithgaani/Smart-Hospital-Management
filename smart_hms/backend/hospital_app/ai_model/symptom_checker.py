import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import pickle
import os
from django.conf import settings


class SymptomCheckerAI:
    """AI-powered symptom checker using scikit-learn"""
    
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.conditions = []
        self.model_path = os.path.join(settings.BASE_DIR, 'hospital_app', 'ai_model', 'symptom_model.pkl')
        self.data_path = os.path.join(settings.BASE_DIR, 'hospital_app', 'ai_model', 'symptom_data.csv')
        
        # Initialize with dummy data if no model exists
        self._initialize_model()
    
    def _create_dummy_data(self):
        """Create dummy symptom-disease data for demonstration"""
        dummy_data = {
            'symptoms': [
                'fever headache fatigue',
                'cough chest pain shortness of breath',
                'nausea vomiting diarrhea',
                'joint pain swelling stiffness',
                'rash itching redness',
                'dizziness confusion memory loss',
                'chest pain shortness of breath sweating',
                'abdominal pain bloating nausea',
                'back pain stiffness limited movement',
                'sore throat fever swollen glands',
                'high blood pressure chest pain',
                'skin rash joint pain fatigue',
                'headache blurred vision nausea',
                'difficulty breathing wheezing cough',
                'stomach pain nausea vomiting',
                'muscle pain weakness fatigue',
                'anxiety depression mood changes',
                'sleep problems fatigue irritability',
                'weight loss fatigue weakness',
                'frequent urination thirst fatigue'
            ],
            'condition': [
                'flu', 'pneumonia', 'gastroenteritis', 'arthritis', 'dermatitis',
                'alzheimer', 'heart_attack', 'ibs', 'back_problems', 'strep_throat',
                'hypertension', 'lupus', 'migraine', 'asthma', 'food_poisoning',
                'fibromyalgia', 'depression', 'insomnia', 'diabetes', 'diabetes'
            ]
        }
        
        df = pd.DataFrame(dummy_data)
        df.to_csv(self.data_path, index=False)
        return df
    
    def _initialize_model(self):
        """Initialize or load the symptom checker model"""
        try:
            if os.path.exists(self.model_path):
                with open(self.model_path, 'rb') as f:
                    model_data = pickle.load(f)
                    self.model = model_data['model']
                    self.vectorizer = model_data['vectorizer']
                    self.conditions = model_data['conditions']
            else:
                self._train_model()
        except Exception as e:
            print(f"Error loading model: {e}")
            self._train_model()
    
    def _train_model(self):
        """Train the symptom checker model"""
        try:
            # Load or create data
            if os.path.exists(self.data_path):
                df = pd.read_csv(self.data_path)
            else:
                df = self._create_dummy_data()
            
            # Prepare data
            X = df['symptoms']
            y = df['condition']
            
            # Get unique conditions
            self.conditions = y.unique().tolist()
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            # Create pipeline
            self.vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
            self.model = MultinomialNB()
            
            # Train model
            X_train_vectorized = self.vectorizer.fit_transform(X_train)
            self.model.fit(X_train_vectorized, y_train)
            
            # Save model
            model_data = {
                'model': self.model,
                'vectorizer': self.vectorizer,
                'conditions': self.conditions
            }
            
            with open(self.model_path, 'wb') as f:
                pickle.dump(model_data, f)
                
        except Exception as e:
            print(f"Error training model: {e}")
            # Fallback to simple keyword matching
            self._create_fallback_model()
    
    def _create_fallback_model(self):
        """Create a simple fallback model based on keyword matching"""
        self.conditions = [
            'flu', 'pneumonia', 'gastroenteritis', 'arthritis', 'dermatitis',
            'alzheimer', 'heart_attack', 'ibs', 'back_problems', 'strep_throat',
            'hypertension', 'lupus', 'migraine', 'asthma', 'food_poisoning',
            'fibromyalgia', 'depression', 'insomnia', 'diabetes'
        ]
        
        # Simple keyword-based conditions
        self.keyword_conditions = {
            'flu': ['fever', 'headache', 'fatigue', 'body aches'],
            'pneumonia': ['cough', 'chest pain', 'shortness of breath', 'fever'],
            'gastroenteritis': ['nausea', 'vomiting', 'diarrhea', 'stomach pain'],
            'arthritis': ['joint pain', 'swelling', 'stiffness'],
            'dermatitis': ['rash', 'itching', 'redness'],
            'alzheimer': ['dizziness', 'confusion', 'memory loss'],
            'heart_attack': ['chest pain', 'shortness of breath', 'sweating'],
            'ibs': ['abdominal pain', 'bloating', 'nausea'],
            'back_problems': ['back pain', 'stiffness', 'limited movement'],
            'strep_throat': ['sore throat', 'fever', 'swollen glands'],
            'hypertension': ['high blood pressure', 'chest pain'],
            'lupus': ['skin rash', 'joint pain', 'fatigue'],
            'migraine': ['headache', 'blurred vision', 'nausea'],
            'asthma': ['difficulty breathing', 'wheezing', 'cough'],
            'food_poisoning': ['stomach pain', 'nausea', 'vomiting'],
            'fibromyalgia': ['muscle pain', 'weakness', 'fatigue'],
            'depression': ['anxiety', 'depression', 'mood changes'],
            'insomnia': ['sleep problems', 'fatigue', 'irritability'],
            'diabetes': ['weight loss', 'fatigue', 'weakness', 'frequent urination', 'thirst']
        }
    
    def predict(self, symptoms):
        """Predict conditions based on symptoms"""
        try:
            if self.model and self.vectorizer:
                # Use trained model
                symptoms_vectorized = self.vectorizer.transform([symptoms])
                probabilities = self.model.predict_proba(symptoms_vectorized)[0]
                
                # Get top predictions
                top_indices = np.argsort(probabilities)[::-1][:3]
                predicted_conditions = [self.conditions[i] for i in top_indices]
                confidence_scores = {self.conditions[i]: float(probabilities[i]) for i in top_indices}
                
            else:
                # Use fallback keyword matching
                symptoms_lower = symptoms.lower()
                scores = {}
                
                for condition, keywords in self.keyword_conditions.items():
                    score = sum(1 for keyword in keywords if keyword in symptoms_lower)
                    if score > 0:
                        scores[condition] = score / len(keywords)
                
                # Sort by score and get top 3
                sorted_conditions = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:3]
                predicted_conditions = [condition for condition, _ in sorted_conditions]
                confidence_scores = {condition: score for condition, score in sorted_conditions}
            
            # Generate recommendations
            recommendations = self._generate_recommendations(predicted_conditions, confidence_scores)
            
            return {
                'conditions': predicted_conditions,
                'confidence': confidence_scores,
                'recommendations': recommendations
            }
            
        except Exception as e:
            return {
                'conditions': ['general_consultation'],
                'confidence': {'general_consultation': 0.5},
                'recommendations': 'Please consult with a healthcare professional for proper diagnosis.'
            }
    
    def _generate_recommendations(self, conditions, confidence_scores):
        """Generate recommendations based on predicted conditions"""
        recommendations = []
        
        for condition in conditions:
            confidence = confidence_scores.get(condition, 0)
            
            if confidence > 0.7:
                recommendations.append(f"High probability of {condition.replace('_', ' ')}. Please consult a doctor immediately.")
            elif confidence > 0.4:
                recommendations.append(f"Moderate probability of {condition.replace('_', ' ')}. Consider consulting a doctor.")
            else:
                recommendations.append(f"Low probability of {condition.replace('_', ' ')}. Monitor symptoms and consult if they worsen.")
        
        if not recommendations:
            recommendations.append("Please consult with a healthcare professional for proper diagnosis.")
        
        return " ".join(recommendations)
