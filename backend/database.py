import os
from pymongo import MongoClient

MONGO_URL = os.getenv(
    "MONGO_URL",
    "mongodb://127.0.0.1:27017/"
)

client = MongoClient(MONGO_URL)

db = client["the_hope"]

users_collection = db["users"]
assessments_collection = db["assessments"]