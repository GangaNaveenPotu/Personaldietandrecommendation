from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import os

app = Flask(__name__)

# Configure CORS for separate deployment
CORS(app, origins=[
    "http://localhost:3000",  # Local development
    "https://your-frontend.vercel.app",  # Replace with your actual frontend URL
    "https://your-frontend.netlify.app"   # Replace with your actual frontend URL
])

# Load Q&A pipeline
qa_pipeline = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")

# Basic nutrition knowledge base
nutrition_data = """
Apples are rich in fiber and vitamin C.
Bananas contain potassium and help in digestion.
Oatmeal is a healthy breakfast option with slow-releasing carbs.
A healthy adult needs around 2000-2500 calories daily depending on activity.
"""

# Function to calculate daily calorie needs (Mifflin-St Jeor Equation)
def calculate_calories(age, gender, weight, height, activity_level):
    if gender.lower() == "male":
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161

    activity_factors = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very active": 1.9
    }
    factor = activity_factors.get(activity_level.lower(), 1.2)
    return round(bmr * factor)

# Root route for quick browser test
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "ML Service is running"})

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    question = data.get("message", "")
    # Some clients may send an object for message; normalize to string
    if isinstance(question, dict):
        question = (
            question.get("text")
            or question.get("message")
            or question.get("content")
            or ""
        )
    question = str(question)

    # Normalize profile and expected keys
    profile = data.get("userProfile") or {}

    # Check if user is asking for calorie needs
    if "calorie" in question.lower() and profile:
        try:
            age = float(profile.get("age") or 0)
            gender = profile.get("gender", "male")
            weight = float(profile.get("weight") or 0)  # in kg
            height = float(profile.get("height") or 0)  # in cm
            activity_level = (
                profile.get("activityLevel")
                or profile.get("activity")
                or "sedentary"
            )

            calories = calculate_calories(age, gender, weight, height, activity_level)
            return jsonify({"reply": f"You need around {calories} calories per day to maintain your weight."})
        except Exception as e:
            return jsonify({
                "reply": "Please provide your age, gender, weight, height, and activity level.",
                "error": str(e),
            })

    # Otherwise use Q&A model
    answer = qa_pipeline({
        "context": nutrition_data,
        "question": question
    })["answer"]

    return jsonify({"reply": answer})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
