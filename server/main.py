import tensorflow as tf
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from PIL import Image
import numpy as np
import io

app = FastAPI()

# Load the trained model
model = tf.keras.models.load_model("model.h5")

# Define ReportRequest model
class ReportRequest(BaseModel):
    postId: str
    reason: str
    reportedBy: str
    timestamp: str
    textContent: str
    imageUrl: str

# Function to fetch and preprocess image from URL
def preprocess_image(image_url: str):
    try:
        # Fetch image
        response = requests.get(image_url)
        img = Image.open(io.BytesIO(response.content))

        # Resize image to match the model input size
        img = img.resize((128, 128))
        img = np.array(img) / 255.0  # Normalize the image

        # Add batch dimension
        img = np.expand_dims(img, axis=0)

        return img
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching or processing image: {str(e)}")

# Function to analyze content (NSFW Check)
def analyze_content(image_url: str):
    # Preprocess image
    img = preprocess_image(image_url)

    # Predict using the model
    prediction = model.predict(img)

    # Define thresholds for NSFW (e.g., if the probability is higher than 0.5, it's NSFW)
    nsfw_score = prediction[0][0]  # The model gives us a score between 0 and 1
    is_harmful = nsfw_score > 0.5

    return {
        "nsfw_score": nsfw_score,
        "is_harmful": is_harmful,
        "review_message": "Post is harmful and under review." if is_harmful else "Post is safe."
    }

@app.post("/report/")
async def report_post(report: ReportRequest):
    # Analyze content (text + image)
    analysis_result = analyze_content(report.imageUrl)

    # Save report into the system (you can integrate with your database here)
    report_id = np.random.randint(1000, 9999)  # Simulate a report ID
    print(f"Report saved with ID: {report_id}")

    # Return analysis result
    return {
        "status": "success",
        "message": analysis_result["review_message"],
        "nsfw_score": analysis_result["nsfw_score"],
        "is_harmful": analysis_result["is_harmful"]
    }
