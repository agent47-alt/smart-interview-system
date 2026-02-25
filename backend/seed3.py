from database import SessionLocal
from models import Question

db = SessionLocal()

questions = [
    # Data Structures
    Question(
        question_text="What is an array and how is it different from a linked list?",
        expected_answer="An array is a collection of elements stored in contiguous memory locations with fixed size. A linked list stores elements in nodes where each node points to the next. Arrays allow random access while linked lists require sequential access but allow dynamic sizing.",
        category="Data Structures",
        difficulty="medium"
    ),
    Question(
        question_text="What is a stack and where is it used?",
        expected_answer="A stack is a linear data structure that follows the Last In First Out principle. Elements are added and removed from the top only. It is used in function call management, undo operations, expression evaluation and backtracking algorithms.",
        category="Data Structures",
        difficulty="easy"
    ),
    Question(
        question_text="What is a binary search tree?",
        expected_answer="A binary search tree is a tree data structure where each node has at most two children. The left subtree contains nodes with values less than the parent and the right subtree contains nodes with values greater than the parent. It allows efficient searching, insertion and deletion.",
        category="Data Structures",
        difficulty="medium"
    ),
    Question(
        question_text="What is the difference between a stack and a queue?",
        expected_answer="A stack follows Last In First Out where the last element added is the first to be removed. A queue follows First In First Out where the first element added is the first to be removed. Stacks use push and pop operations while queues use enqueue and dequeue.",
        category="Data Structures",
        difficulty="easy"
    ),
    Question(
        question_text="What is a hash table?",
        expected_answer="A hash table is a data structure that stores key value pairs. It uses a hash function to compute an index into an array where the value is stored. Hash tables provide average O(1) time complexity for insert, delete and search operations.",
        category="Data Structures",
        difficulty="medium"
    ),

    # System Design
    Question(
        question_text="What is REST API and what are its principles?",
        expected_answer="REST stands for Representational State Transfer. It is an architectural style for building web APIs. Its principles include statelessness, client server separation, uniform interface, cacheability, layered system and use of HTTP methods like GET POST PUT DELETE.",
        category="System Design",
        difficulty="medium"
    ),
    Question(
        question_text="What is the difference between SQL and NoSQL databases?",
        expected_answer="SQL databases are relational and store data in tables with fixed schemas. They use structured query language and are good for complex queries. NoSQL databases are non relational and can store data as documents, key value pairs or graphs. They are more flexible and scalable for large amounts of unstructured data.",
        category="System Design",
        difficulty="medium"
    ),
    Question(
        question_text="What is caching and why is it important?",
        expected_answer="Caching is the process of storing frequently accessed data in a fast storage layer so future requests can be served faster. It reduces database load, improves response times and increases application performance. Common caching tools include Redis and Memcached.",
        category="System Design",
        difficulty="medium"
    ),
    Question(
        question_text="What is load balancing?",
        expected_answer="Load balancing is the process of distributing incoming network traffic across multiple servers to ensure no single server is overwhelmed. It improves availability, reliability and performance of applications. Common algorithms include round robin, least connections and IP hash.",
        category="System Design",
        difficulty="medium"
    ),
    Question(
        question_text="What is the difference between authentication and authorization?",
        expected_answer="Authentication is the process of verifying who a user is, typically through passwords or tokens. Authorization is the process of verifying what a user is allowed to do. Authentication comes first and authorization comes after. For example logging in is authentication and checking if you can access admin pages is authorization.",
        category="System Design",
        difficulty="easy"
    ),
]

db.add_all(questions)
db.commit()
db.close()

print("✅ New categories added successfully!")