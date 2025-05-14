import os
import pickle
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Create FastAPI app
app = FastAPI(title="Crop Recommendation API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to model files
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "crop_recommendation_model.pkl")
ENCODER_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "label_encoder.pkl")

# Load model and encoder on startup
model = None
label_encoder = None

@app.on_event("startup")
async def load_model():
    global model, label_encoder
    try:
        # Load the trained model
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)
        
        # Load the label encoder
        with open(ENCODER_PATH, "rb") as f:
            label_encoder = pickle.load(f)
            
        print("Model and encoder loaded successfully!")
    except Exception as e:
        print(f"Error loading model or encoder: {e}")
        raise HTTPException(status_code=500, detail="Failed to load model or encoder")

# Define request body model
class CropFeatures(BaseModel):
    N: float  # Nitrogen content in soil
    P: float  # Phosphorus content in soil
    K: float  # Potassium content in soil
    temperature: float  # Temperature in Celsius
    humidity: float  # Humidity in percentage
    ph: float  # pH value of soil
    rainfall: float  # Rainfall in mm

# Define response model
class CropPrediction(BaseModel):
    predicted_crop: str
    confidence: float = None

@app.get("/")
async def root():
    return {"message": "Crop Recommendation API is running"}

@app.post("/predict", response_model=CropPrediction)
async def predict_crop(features: CropFeatures):
    if model is None or label_encoder is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Create feature array
        feature_array = np.array([
            features.N,
            features.P,
            features.K,
            features.temperature,
            features.humidity,
            features.ph,
            features.rainfall
        ]).reshape(1, -1)
        
        # Make prediction
        prediction = model.predict(feature_array)
        
        # Get prediction probabilities (if available)
        confidence = None
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(feature_array)
            confidence = float(np.max(probabilities))
        
        # Decode prediction
        predicted_crop = label_encoder.inverse_transform(prediction)[0]
        
        return CropPrediction(
            predicted_crop=predicted_crop,
            confidence=confidence
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 