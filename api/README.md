# Crop Recommendation API

This is a FastAPI backend for the Crop Recommendation system. It loads a pre-trained Random Forest model and LabelEncoder to predict suitable crops based on soil and environmental parameters.

## Setup

### Installation

```bash
pip install -r requirements.txt
```

### Running the API

```bash
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

## API Endpoints

### GET /

Returns a simple health check message.

### POST /predict

Accepts soil and environmental parameters and returns a recommended crop.

#### Request Body

```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.87,
  "humidity": 82.00,
  "ph": 6.5,
  "rainfall": 202.93
}
```

#### Response

```json
{
  "predicted_crop": "rice",
  "confidence": 0.92
}
```

## Docker

To build and run the Docker container:

```bash
docker build -t crop-recommendation-api .
docker run -p 8000:8000 crop-recommendation-api
``` 