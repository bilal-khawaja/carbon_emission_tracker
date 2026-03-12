from fastapi import APIRouter, HTTPException, status, Depends, Body
from sqlmodel import select, Session
from models import Users, UniversityAssets, DailyEnergyConsumption, EmissionFactor, EmissionRecord
from database import get_session
from auth.jwt_handeler import get_current_user
from schema import BulkAssetRequest, AssetUpdate, DailyConsumptionInput
from api.methods import calculate_footprint

app = APIRouter()

@app.put("/university_resources")
def set_resources(data: BulkAssetRequest, 
        current_user: Users = Depends(get_current_user("admin")),
             session: Session = Depends(get_session)):
    
    print(f"Authenticated user: {current_user.email}")  # Debug log
    print(f"Received asset data: {data}")  # Debug log
    for items in data.assets:
        print(f"Processing asset: {items.category}, quantity: {items.quantity}")  # Debug log
        asset = session.exec(select(UniversityAssets).where(UniversityAssets.name == items.category)).first()

        if asset:
            print(f"Updating existing asset: {asset.name}")  # Debug log
            asset.quantity = items.quantity
            asset.power = items.power
            asset.fuel_type = items.fuel_type if items.fuel_type else None
        else:
            print(f"Creating new asset: {items.category}")  # Debug log
            new_asset = UniversityAssets(
                name=items.category,
                quantity=items.quantity,
                power=items.power,
                fuel_type=items.fuel_type if items.fuel_type else None
            )
            session.add(new_asset)
    session.commit()
    print("Assets saved successfully")  # Debug log
    return {"message": "University resources updated successfully"}

@app.put("/daily_consumption")
def set_daily_consumption(data: DailyConsumptionInput,
                         current_user: Users = Depends(get_current_user("admin")),
                         session: Session = Depends(get_session)):
    
    factors = session.exec(select(EmissionFactor)).all()
    record = DailyEnergyConsumption(
        total_distance=data.total_distance,
        grid_consumption=data.grid_consumption,
        solar_consumption=data.solar_consumption,
        gen_hrs=data.gen_hrs,
        lab_active_hrs=data.lab_active_hrs,
        paper_consumption=data.paper_consumption,
        gen_fuel_liters=data.gen_fuel_liters
    )
    session.add(record)
    session.flush()
    results = calculate_footprint(record, factors, session)

    session.commit()

    return {"message": "Daily consumption data updated successfully"}

