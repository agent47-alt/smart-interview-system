from database import SessionLocal
from models import Question

db = SessionLocal()

questions = [
    # Python Questions
    Question(
        question_text="What is a Python list?",
        expected_answer="A list is an ordered collection of items in Python that is mutable and allows duplicate values. It is defined using square brackets.",
        category="Python",
        difficulty="easy"
    ),
    Question(
        question_text="What is a Python decorator?",
        expected_answer="A decorator is a function that takes another function as input and extends its behavior without modifying it. It uses the @ symbol.",
        category="Python",
        difficulty="medium"
    ),
    Question(
        question_text="What is the difference between a list and a tuple?",
        expected_answer="A list is mutable meaning it can be changed after creation while a tuple is immutable meaning it cannot be changed. Lists use square brackets and tuples use parentheses.",
        category="Python",
        difficulty="easy"
    ),

    # SQL Questions
    Question(
        question_text="What is SQL?",
        expected_answer="SQL stands for Structured Query Language. It is used to manage and manipulate relational databases by performing operations like select, insert, update and delete.",
        category="SQL",
        difficulty="easy"
    ),
    Question(
        question_text="What is the difference between WHERE and HAVING?",
        expected_answer="WHERE filters rows before grouping while HAVING filters groups after the GROUP BY clause. WHERE cannot be used with aggregate functions but HAVING can.",
        category="SQL",
        difficulty="medium"
    ),
    Question(
        question_text="What is a JOIN in SQL?",
        expected_answer="A JOIN is used to combine rows from two or more tables based on a related column. Types include INNER JOIN, LEFT JOIN, RIGHT JOIN and FULL JOIN.",
        category="SQL",
        difficulty="easy"
    ),

    # HR Questions
    Question(
        question_text="Tell me about yourself.",
        expected_answer="A good answer covers your educational background, technical skills, projects you have worked on, and what you are looking for in your career.",
        category="HR",
        difficulty="easy"
    ),
    Question(
        question_text="What are your strengths?",
        expected_answer="Good strengths to mention include problem solving, quick learning ability, teamwork, communication skills, and technical expertise relevant to the role.",
        category="HR",
        difficulty="easy"
    ),
    Question(
        question_text="Where do you see yourself in 5 years?",
        expected_answer="A good answer shows ambition and alignment with the company. Mention growing your technical skills, taking on more responsibilities, and contributing to the team.",
        category="HR",
        difficulty="easy"
    ),
]

# Add all questions to database
db.add_all(questions)
db.commit()
db.close()

print("✅ Questions added to database successfully!")