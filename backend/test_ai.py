from ai.analyzer import calculate_score

# Test 1 - Good answer
result = calculate_score(
    user_answer="SQL stands for Structured Query Language and is used to manage relational databases",
    expected_answer="SQL stands for Structured Query Language. It is used to manage and manipulate relational databases by performing operations like select, insert, update and delete."
)
print("Test 1 - Good answer:")
print(f"Score: {result['score']}/10")
print(f"Feedback: {result['feedback']}")
print()

# Test 2 - Partial answer
result2 = calculate_score(
    user_answer="SQL is for databases",
    expected_answer="SQL stands for Structured Query Language. It is used to manage and manipulate relational databases by performing operations like select, insert, update and delete."
)
print("Test 2 - Partial answer:")
print(f"Score: {result2['score']}/10")
print(f"Feedback: {result2['feedback']}")
print()

# Test 3 - Wrong answer
result3 = calculate_score(
    user_answer="I dont know what SQL is",
    expected_answer="SQL stands for Structured Query Language. It is used to manage and manipulate relational databases by performing operations like select, insert, update and delete."
)
print("Test 3 - Wrong answer:")
print(f"Score: {result3['score']}/10")
print(f"Feedback: {result3['feedback']}")