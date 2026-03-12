from sqlmodel import SQLModel, Field
from pydantic import BaseModel
from typing import Optional, List
from pydantic import field_validator
import re
from models import AssetCategory
class UserInput(SQLModel):
    name : str
    email : str
    password : str
    @field_validator('email')
    def email_must_be_valid(cls, v):    
        if not re.search(r"\w+@(\w+\.)?\w+\.(com)$",v, re.IGNORECASE):
            raise ValueError("Email must be in valid format and end with .com (e.g., user@example.com)")
        else:
            return v
    @field_validator('password')    
    def password_must_be_strong(cls, p):
             if not re.search(r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%&*^_-])[A-Za-z\d!@#$%^&_*-]{8,}$",p):
                 raise ValueError("Password must be at least 8 characters long and contain: 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character (!@#$%&*^_-)")
             else:
                    return p  

class AssetUpdate(BaseModel):
    category: AssetCategory
    quantity: int
    power: Optional[float] = None
    fuel_type: Optional[str] = None

class BulkAssetRequest(BaseModel):
    assets: List[AssetUpdate]

class DailyConsumptionInput(BaseModel):
    total_distance: float
    grid_consumption: float
    solar_consumption: float
    gen_hrs: float
    lab_active_hrs: float
    paper_consumption: int
    gen_fuel_liters: Optional[float] = None
