import sys
import os

# Add backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine
import models

# Create tables
models.Base.metadata.create_all(bind=engine)

# Check if questions exist
db = SessionLocal()
count = db.query(models.Question).count()

if count == 0:
    print("Seeding database with questions...")
    from models import Question

    questions = [
        Question(question_text="What is a Python list?", expected_answer="A list is an ordered collection of items in Python that is mutable and allows duplicate values. It is defined using square brackets.", category="Python", difficulty="easy"),
        Question(question_text="What is a Python decorator?", expected_answer="A decorator is a function that takes another function as input and extends its behavior without modifying it. It uses the @ symbol.", category="Python", difficulty="medium"),
        Question(question_text="What is the difference between a list and a tuple?", expected_answer="A list is mutable meaning it can be changed after creation while a tuple is immutable meaning it cannot be changed. Lists use square brackets and tuples use parentheses.", category="Python", difficulty="easy"),
        Question(question_text="What is object oriented programming?", expected_answer="Object oriented programming is a programming paradigm that organizes code into objects that contain data and methods. It uses concepts like classes, inheritance, encapsulation and polymorphism.", category="Python", difficulty="medium"),
        Question(question_text="What are Python generators?", expected_answer="Generators are functions that return an iterator using the yield keyword. They generate values one at a time and are memory efficient because they don't store all values in memory at once.", category="Python", difficulty="hard"),
        Question(question_text="What is SQL?", expected_answer="SQL stands for Structured Query Language. It is used to manage and manipulate relational databases by performing operations like select, insert, update and delete.", category="SQL", difficulty="easy"),
        Question(question_text="What is the difference between WHERE and HAVING?", expected_answer="WHERE filters rows before grouping while HAVING filters groups after the GROUP BY clause. WHERE cannot be used with aggregate functions but HAVING can.", category="SQL", difficulty="medium"),
        Question(question_text="What is a JOIN in SQL?", expected_answer="A JOIN is used to combine rows from two or more tables based on a related column. Types include INNER JOIN, LEFT JOIN, RIGHT JOIN and FULL JOIN.", category="SQL", difficulty="easy"),
        Question(question_text="What is a primary key?", expected_answer="A primary key is a column or set of columns that uniquely identifies each row in a table. It cannot contain null values and must be unique for every record.", category="SQL", difficulty="easy"),
        Question(question_text="What is normalization in databases?", expected_answer="Normalization is the process of organizing a database to reduce data redundancy and improve data integrity. It involves dividing large tables into smaller ones and defining relationships between them.", category="SQL", difficulty="medium"),
        Question(question_text="Tell me about yourself.", expected_answer="A good answer covers your educational background, technical skills, projects you have worked on, and what you are looking for in your career.", category="HR", difficulty="easy"),
        Question(question_text="What are your strengths?", expected_answer="Good strengths to mention include problem solving, quick learning ability, teamwork, communication skills, and technical expertise relevant to the role.", category="HR", difficulty="easy"),
        Question(question_text="Where do you see yourself in 5 years?", expected_answer="A good answer shows ambition and alignment with the company. Mention growing your technical skills, taking on more responsibilities, and contributing to the team.", category="HR", difficulty="easy"),
        Question(question_text="Why do you want to work for our company?", expected_answer="A good answer shows research about the company, alignment with company values, enthusiasm for the role, and how your skills match what they are looking for.", category="HR", difficulty="easy"),
        Question(question_text="What is an array and how is it different from a linked list?", expected_answer="An array is a collection of elements stored in contiguous memory locations with fixed size. A linked list stores elements in nodes where each node points to the next. Arrays allow random access while linked lists require sequential access but allow dynamic sizing.", category="Data Structures", difficulty="medium"),
        Question(question_text="What is a stack and where is it used?", expected_answer="A stack is a linear data structure that follows the Last In First Out principle. Elements are added and removed from the top only. It is used in function call management, undo operations, expression evaluation and backtracking algorithms.", category="Data Structures", difficulty="easy"),
        Question(question_text="What is REST API and what are its principles?", expected_answer="REST stands for Representational State Transfer. It is an architectural style for building web APIs. Its principles include statelessness, client server separation, uniform interface, cacheability, layered system and use of HTTP methods like GET POST PUT DELETE.", category="System Design", difficulty="medium"),
        Question(question_text="What is the difference between SQL and NoSQL databases?", expected_answer="SQL databases are relational and store data in tables with fixed schemas. NoSQL databases are non relational and can store data as documents, key value pairs or graphs. They are more flexible and scalable for large amounts of unstructured data.", category="System Design", difficulty="medium"),
    ]

    db.add_all(questions)
    db.commit()
    print(f"✅ Added {len(questions)} questions!")
else:
    print(f"✅ Database already has {count} questions")

db.close()
print("✅ Startup complete!")