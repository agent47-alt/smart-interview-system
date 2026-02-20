from pydantic import BaseModel, EmailStr

# Data needed to register a new user
class UserRegister(BaseModel):
    name: str
    email: str
    password: str


# Data needed to login
class UserLogin(BaseModel):
    email: str
    password: str


# Data returned after successful login
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_name: str
    user_id: int