from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

# Table 1 - Users (stores registered accounts)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    results = relationship("Result", back_populates="user")


# Table 2 - Questions (stores interview questions)
class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String, nullable=False)
    expected_answer = Column(String, nullable=False)
    category = Column(String, nullable=False)  # e.g. Python, SQL, HR
    difficulty = Column(String, default="medium")  # easy, medium, hard


# Table 3 - Results (stores user interview scores)
class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    user_answer = Column(String)
    score = Column(Float)
    feedback = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="results")