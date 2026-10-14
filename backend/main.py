
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import client, users_collection, assessments_collection
from datetime import datetime, timezone
import bcrypt

app = FastAPI()

app.add_middleware(
CORSMiddleware,
allow_origins=[
"http://127.0.0.1:5500",
"http://localhost:5500",
"http://127.0.0.1:5501",
"http://localhost:5501",
"https://manas-deshpande.github.io"
],
allow_credentials=False,
allow_methods=[""],
allow_headers=[""],
)



@app.get("/")
def home():
    return {"message": "Welcome to The Hope"}


@app.get("/db-test")
def db_test():
    client.admin.command("ping")
    return {"message": "MongoDB connected successfully"}


@app.post("/register")
def register(username: str, email: str, password: str):

    # Check if user already exists
    existing_user = users_collection.find_one({"email": email})

    if existing_user:
        return {"message": "User already exists"}

    # Hash password
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    # Store user
    user = {
        "username": username,
        "email": email,
        "password": hashed_password
    }

    users_collection.insert_one(user)

    return {"message": "Registration successful"}



@app.post("/login")
def login(email: str, password: str):

    # Find user by email
    user = users_collection.find_one({"email": email})

    if not user:
        return {"message": "Invalid email or password"}

    # Check password
    password_match = bcrypt.checkpw(
        password.encode("utf-8"),
        user["password"].encode("utf-8")
    )

    if not password_match:
        return {"message": "Invalid email or password"}

    return {
        "message": "Login successful",
        "username": user["username"]
    }



from datetime import datetime, timezone

@app.post("/assessment")
def assessment(email: str, q1: int, q2: int, q3: int, q4: int, q5: int):
    user = users_collection.find_one({"email": email})

    if not user:
        return {"message": "Please register before taking the assessment"}

    answers = [q1, q2, q3, q4, q5]

    if any(answer not in [0, 1, 2, 3] for answer in answers):
        return {"message": "Each answer must be between 0 and 3"}

    score = sum(answers)

    if score <= 4:
        result = "Low stress"
    elif score <= 9:
        result = "Moderate stress"
    else:
        result = "High stress"

    assessment_data = {
        "email": email,
        "answers": answers,
        "score": score,
        "result": result,
        "created_at": datetime.now(timezone.utc)
    }

    assessments_collection.insert_one(assessment_data)

    return {
        "message": "Assessment submitted successfully",
        "score": score,
        "result": result,
        "note": "This is a general stress-level indication, not a medical diagnosis."
    }
