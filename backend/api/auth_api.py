from fastapi import APIRouter, HTTPException, status, Depends, Body
from sqlmodel import select, Session
from models import Users
from database import get_session
from schema import UserInput
from auth.jwt_handeler import hash_password, check_hashed_password, create_access_token

router = APIRouter()

@router.post('/signup')
def signup(
    user : UserInput, session : Session = Depends(get_session)):
    user.name = user.name.strip()
    user.email = user.email.strip()
    user.password = user.password.strip()
    query = session.exec(select(Users).where(Users.email == user.email)).first()
    if query:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail = "Email already registered")
    
    try:
        hashed_password = hash_password(user.password)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=str(e))
    
    create = Users(
        name = user.name,
        email = user.email,
        password = hashed_password
    )    
    
    session.add(create)
    session.commit()
    session.refresh(create)
    return {"message" : "User created"}

@router.post('/signin')
def signin(
    email : str = Body(...), 
    password : str = Body(...), 
    session : Session = Depends(get_session)):
    
    
    
    all_users = session.exec(select(Users)).all()
    print(f"All users in database:") 
    for user in all_users:
        print(f"  - ID: {user.id}, Email: '{user.email}', Name: {user.name}") 
    
    query = session.exec(select(Users).where(Users.email == email)).first()
    print(f"Query result: {query}") 
    
    if not query:
        print(f"User not found with email: '{email}'") 
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail = f"Wrong email: {email}")
        
    print(f"User found: {query.name} ({query.email})") 
    print(f"Checking password...")  
    
    if not check_hashed_password(password, query.password):
        print(f"Password check failed for user: {query.email}") 
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail = "Invalid password") 
  
    print(f"Password check successful. Creating token...")  
    access_token = create_access_token(
                                        data = {
                                            'sub' : query.email,'id' : query.id,
                                                                     'role' : query.role
                                                                     }
                                                                     )
    print(f"Token created successfully for user: {query.email}")  
    return {'message':'Login succesful','access_token' : access_token, 'token_type' : 'bearer'}    
