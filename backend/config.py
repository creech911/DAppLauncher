import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'a_secret_key')
    FLASK_APP = os.getenv('FLASK_APP', 'app.py')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DB_NAME = os.getenv('DB_NAME', 'database_name')
    DB_USER = os.getenv('DB_USER', 'user')
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'password')
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', 5432)
    SQLALCHEMY_DATABASE_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    BLOCKCHAIN_NETWORK_URL = os.getenv('BLOCKCHAIN_NETWORK_URL', 'http://localhost:8545')
    BLOCKCHAIN_NETWORK_ID = os.getenv('BLOCKCHAIN_NETWORK_ID', 1) 
    WEB3_PRIVATE_KEY = os.getenv('WEB3_PRIVATE_KEY', 'your_private_key_here')