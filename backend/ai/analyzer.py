from sentence_transformers import SentenceTransformer, util

# Load AI model once when server starts
print("Loading AI model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("✅ AI model loaded!")


def calculate_score(user_answer: str, expected_answer: str) -> dict:
    """
    Compare user answer with expected answer using AI
    Returns score out of 10 and feedback
    """

    # Handle empty answers
    if not user_answer or len(user_answer.strip()) < 3:
        return {
            "score": 0.0,
            "feedback": "No answer provided. Try to attempt every question.",
            "similarity": 0.0
        }

    # Calculate similarity using AI
    embeddings = model.encode([user_answer, expected_answer])
    similarity = float(util.cos_sim(embeddings[0], embeddings[1]))

    # Convert similarity to score out of 10
    score = round(similarity * 10, 1)

    # Make sure score is between 0 and 10
    score = max(0.0, min(10.0, score))

    # Generate feedback based on score
    feedback = generate_feedback(score, similarity)

    return {
        "score": score,
        "feedback": feedback,
        "similarity": round(similarity, 2)
    }


def generate_feedback(score: float, similarity: float) -> str:
    """Generate helpful feedback based on the score"""

    if score >= 8.5:
        return "Excellent answer! You clearly understand this topic very well. Keep it up!"
    elif score >= 7.0:
        return "Good answer! You covered the main points. Try adding more specific details or examples to make it even better."
    elif score >= 5.5:
        return "Decent attempt! You have some understanding but your answer is missing key concepts. Review this topic more."
    elif score >= 4.0:
        return "Partial answer. You touched on the topic but missed several important points. Study this topic more carefully."
    elif score >= 2.0:
        return "Weak answer. Your response doesn't cover the core concepts well. This topic needs more attention."
    else:
        return "Incorrect or very incomplete answer. Please study this topic thoroughly before your interview."