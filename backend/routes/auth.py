from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


# REGISTER endpoint
@router.post("/register")
def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):

    # Check if email already exists
    existing_user = db.query(models.User).filter(
        models.User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password before saving
    hashed = hash_password(user_data.password)

    # Create new user
    new_user = models.User(
        name=user_data.name,
        email=user_data.email,
        password=hashed
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Account created successfully!", "user_id": new_user.id}


# LOGIN endpoint
@router.post("/login")
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):

    # Find user by email
    user = db.query(models.User).filter(
        models.User.email == user_data.email
    ).first()

    # Check if user exists and password is correct
    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Create JWT token
    token = create_access_token(data={"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_name": user.name,
        "user_id": user.id
    }