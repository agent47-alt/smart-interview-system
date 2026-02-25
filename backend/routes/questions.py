from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/questions", tags=["Questions"])


# Get all categories available
@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(models.Question.category).distinct().all()
    return {"categories": [c[0] for c in categories]}


# Get questions by category
@router.get("/{category}")
def get_questions_by_category(category: str, db: Session = Depends(get_db)):
    questions = db.query(models.Question).filter(
        models.Question.category == category
    ).all()

    return {"category": category, "total": len(questions), "questions": [
        {
            "id": q.id,
            "question_text": q.question_text,
            "difficulty": q.difficulty
        }
        for q in questions
    ]}


# Get single question by ID
@router.get("/single/{question_id}")
def get_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(models.Question).filter(
        models.Question.id == question_id
    ).first()

    if not question:
        return {"error": "Question not found"}

    return {
        "id": question.id,
        "question_text": question.question_text,
        "category": question.category,
        "difficulty": question.difficulty
    }