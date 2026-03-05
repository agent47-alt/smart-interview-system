from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/questions", tags=["Questions"])


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(models.Question.category).distinct().all()
    return {"categories": [c[0] for c in categories]}


@router.get("/{category}")
def get_questions_by_category(
    category: str,
    difficulty: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Question).filter(
        models.Question.category == category
    )

    # Filter by difficulty if provided
    if difficulty and difficulty != "all":
        query = query.filter(models.Question.difficulty == difficulty)

    questions = query.all()

    return {
        "category": category,
        "difficulty": difficulty or "all",
        "total": len(questions),
        "questions": [
            {
                "id": q.id,
                "question_text": q.question_text,
                "difficulty": q.difficulty
            }
            for q in questions
        ]
    }


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