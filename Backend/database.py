# Backend/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# MySQL Connection String: mysql+pymysql://user:password@host:port/dbname
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:Kigh201444@localhost:3306/finsight_ai"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()