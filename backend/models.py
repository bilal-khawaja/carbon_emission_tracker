from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date
from enum import Enum

class Users(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    created_date: date = Field(default_factory=date.today, nullable=False)
    name: str = Field(default=None, nullable=False)
    role: str = Field(default="user", nullable=False)
    email: str = Field(default=None, nullable=False, unique=True)
    password: str = Field(default=None, nullable=False)

class AssetCategory(str, Enum):
    BUS = "bus"
    SOLAR = "solar"
    PAPER = "paper"
    GENERATOR = "generator"
    LAB = "lab"
    GRID = "grid"

class UniversityAssets(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(default=AssetCategory.BUS, nullable=False)
    quantity: int = Field(default=0, nullable=False)
    power: Optional[float] = Field(default=None, nullable=True)
    fuel_type: Optional[str] = Field(default=None, nullable=True)


class DailyEnergyConsumption(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    record_date: date = Field(default_factory=date.today, nullable=False)
    total_distance: float = Field(default=0.0, nullable=False)
    grid_consumption: float = Field(default=0.0, nullable=False)
    solar_consumption: float = Field(default=0.0, nullable=False)
    gen_hrs: float = Field(default=0.0, nullable=False)
    lab_active_hrs: float = Field(default=0.0, nullable=False)
    paper_consumption: int = Field(default=0, nullable=False)
    gen_fuel_liters: Optional[float] = Field(default=0.0, nullable=True)

class UnitCategory(str, Enum):
    KM = "km"
    KWH = "kwh"
    SHEET = "sheet"
    LITRE = "litre"

class EmissionFactor(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    category: str = Field(index=True)  
    activity_type: str = Field(unique=True) 
    unit: str  = Field(default=UnitCategory.KM, nullable=False)
    co2_per_unit: float = Field(default=0.0, nullable=False)

class EmissionRecord(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    record_date: date = Field(default_factory=date.today, nullable=False)
    total_co2_kg: float = Field(default=0.0, nullable=False)
    transport_co2: float = Field(default=0.0, nullable=False)
    energy_co2: float = Field(default=0.0, nullable=False)
    paper_co2: float = Field(default=0.0, nullable=False)
    gen_co2: float = Field(default=0.0, nullable=True)
    solar_savings_co2: float = Field(default=0.0, nullable=False)
