from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from Backend.auth import (
    create_user,
    authenticate_user,
    create_session,
    get_user_from_token
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


class RegisterRequest(BaseModel):

    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):

    email: EmailStr
    password: str


class TokenRequest(BaseModel):

    token: str


@router.post("/register")
def register(request: RegisterRequest):

    try:

        user = create_user(
            request.name,
            request.email,
            request.password
        )

        return {
            "success": True,
            "message": "Registration successful.",
            "user": user
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post("/login")
def login(request: LoginRequest):

    user = authenticate_user(
        request.email,
        request.password
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    token = create_session(user["id"])

    return {
        "success": True,
        "token": token,
        "user": user
    }


@router.post("/verify")
def verify_token(request: TokenRequest):

    user = get_user_from_token(
        request.token
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid session."
        )

    return {
        "success": True,
        "user": user
    }