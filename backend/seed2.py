from database import SessionLocal
from models import Question

db = SessionLocal()

questions = [
    # More Python Questions
    Question(
        question_text="What is object oriented programming?",
        expected_answer="Object oriented programming is a programming paradigm that organizes code into objects that contain data and methods. It uses concepts like classes, inheritance, encapsulation and polymorphism.",
        category="Python",
        difficulty="medium"
    ),
    Question(
        question_text="What is the difference between append and extend in Python?",
        expected_answer="Append adds a single element to the end of a list while extend adds all elements of an iterable to the end of a list.",
        category="Python",
        difficulty="easy"
    ),
    Question(
        question_text="What are Python generators?",
        expected_answer="Generators are functions that return an iterator using the yield keyword. They generate values one at a time and are memory efficient because they don't store all values in memory at once.",
        category="Python",
        difficulty="hard"
    ),

    # More SQL Questions
    Question(
        question_text="What is a primary key?",
        expected_answer="A primary key is a column or set of columns that uniquely identifies each row in a table. It cannot contain null values and must be unique for every record.",
        category="SQL",
        difficulty="easy"
    ),
    Question(
        question_text="What is normalization in databases?",
        expected_answer="Normalization is the process of organizing a database to reduce data redundancy and improve data integrity. It involves dividing large tables into smaller ones and defining relationships between them.",
        category="SQL",
        difficulty="medium"
    ),
    Question(
        question_text="What is an index in SQL?",
        expected_answer="An index is a database object that improves the speed of data retrieval operations. It works like a pointer to data in a table and speeds up SELECT queries but slows down INSERT and UPDATE.",
        category="SQL",
        difficulty="medium"
    ),

    # More HR Questions
    Question(
        question_text="Why do you want to work for our company?",
        expected_answer="A good answer shows research about the company, alignment with company values, enthusiasm for the role, and how your skills match what they are looking for.",
        category="HR",
        difficulty="easy"
    ),
    Question(
        question_text="How do you handle pressure and tight deadlines?",
        expected_answer="A good answer mentions prioritizing tasks, breaking work into smaller steps, staying calm, communicating with the team, and giving a real example of handling pressure successfully.",
        category="HR",
        difficulty="medium"
    ),
    Question(
        question_text="What is your biggest weakness?",
        expected_answer="A good answer honestly mentions a real weakness but focuses on steps you are taking to improve it. Avoid saying you have no weaknesses or mentioning weaknesses critical to the job.",
        category="HR",
        difficulty="easy"
    ),
]

db.add_all(questions)
db.commit()
db.close()

print("✅ More questions added successfully!")