from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from database import get_db
from ai.analyzer import calculate_score
import models

router = APIRouter(prefix="/interview", tags=["Interview"])


class AnswerSubmit(BaseModel):
    question_id: int
    user_answer: str
    user_id: int


@router.post("/submit")
def submit_answer(data: AnswerSubmit, db: Session = Depends(get_db)):
    question = db.query(models.Question).filter(
        models.Question.id == data.question_id
    ).first()

    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    result = calculate_score(data.user_answer, question.expected_answer)

    new_result = models.Result(
        user_id=data.user_id,
        question_id=data.question_id,
        user_answer=data.user_answer,
        score=result["score"],
        feedback=result["feedback"]
    )

    db.add(new_result)
    db.commit()
    db.refresh(new_result)

    return {
        "score": result["score"],
        "feedback": result["feedback"],
        "expected_answer": question.expected_answer,
        "result_id": new_result.id
    }


@router.get("/results/{user_id}")
def get_user_results(user_id: int, db: Session = Depends(get_db)):
    results = db.query(models.Result, models.Question).join(
        models.Question, models.Result.question_id == models.Question.id
    ).filter(
        models.Result.user_id == user_id
    ).order_by(models.Result.created_at.desc()).all()

    if not results:
        return {"results": [], "stats": {}}

    formatted = []
    for result, question in results:
        formatted.append({
            "id": result.id,
            "question": question.question_text,
            "category": question.category,
            "score": result.score,
            "feedback": result.feedback,
            "date": result.created_at.strftime("%Y-%m-%d %H:%M")
        })

    scores = [r["score"] for r in formatted]
    avg_score = round(sum(scores) / len(scores), 1)

    category_scores = {}
    for r in formatted:
        cat = r["category"]
        if cat not in category_scores:
            category_scores[cat] = []
        category_scores[cat].append(r["score"])

    category_avg = {
        cat: round(sum(s) / len(s), 1)
        for cat, s in category_scores.items()
    }

    weak_area = min(category_avg, key=category_avg.get) if category_avg else None

    return {
        "results": formatted,
        "stats": {
            "total_answered": len(formatted),
            "average_score": avg_score,
            "category_averages": category_avg,
            "weak_area": weak_area,
            "highest_score": max(scores),
            "lowest_score": min(scores)
        }
    }


@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    # Get all users
    users = db.query(models.User).all()

    leaderboard = []

    for user in users:
        results = db.query(models.Result).filter(
            models.Result.user_id == user.id
        ).all()

        if not results:
            continue

        scores = [r.score for r in results]
        avg_score = round(sum(scores) / len(scores), 1)
        total = len(scores)
        best = max(scores)

        leaderboard.append({
            "user_id": user.id,
            "name": user.name,
            "average_score": avg_score,
            "total_answered": total,
            "best_score": best
        })

    # Sort by average score descending
    leaderboard.sort(key=lambda x: x["average_score"], reverse=True)

    # Add rank
    for i, entry in enumerate(leaderboard):
        entry["rank"] = i + 1

    return {"leaderboard": leaderboard}