from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from datetime import date
import models

router = APIRouter(prefix="/questions", tags=["Questions"])


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(models.Question.category).distinct().all()
    return {"categories": [c[0] for c in categories]}


@router.get("/daily")
def get_daily_challenge(db: Session = Depends(get_db)):
    # Use today's date as seed to get same question all day
    today = date.today()
    seed = today.year * 10000 + today.month * 100 + today.day

    # Get all questions
    all_questions = db.query(models.Question).all()

    if not all_questions:
        return {"error": "No questions found"}

    # Pick question based on date seed
    index = seed % len(all_questions)
    question = all_questions[index]

    return {
        "id": question.id,
        "question_text": question.question_text,
        "category": question.category,
        "difficulty": question.difficulty,
        "date": str(today)
    }


@router.get("/mock/random")
def get_mock_questions(count: int = 10, db: Session = Depends(get_db)):
    questions = db.query(models.Question).order_by(func.random()).limit(count).all()
    return {
        "total": len(questions),
        "questions": [
            {
                "id": q.id,
                "question_text": q.question_text,
                "category": q.category,
                "difficulty": q.difficulty
            }
            for q in questions
        ]
    }


@router.get("/{category}")
def get_questions_by_category(
    category: str,
    difficulty: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Question).filter(
        models.Question.category == category
    )
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