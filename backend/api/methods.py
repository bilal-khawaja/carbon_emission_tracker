from database import get_session
from models import DailyEnergyConsumption, EmissionFactor, UniversityAssets, EmissionRecord
from sqlmodel import select, Session
from fastapi import Depends
from datetime import date

def set_emission_factors(session:Session):
    factors = [
        EmissionFactor(category="transport", activity_type="diesel", co2_per_unit=1.1),#might need to change co2 per unit based on fuel_type
        EmissionFactor(category="energy", activity_type="grid_electricity", co2_per_unit=0.45),
        EmissionFactor(category="energy", activity_type="diesel_generator", co2_per_unit=2.68),
        EmissionFactor(category="energy", activity_type="solar_electricity", co2_per_unit=-0.45),
        EmissionFactor(category="paper", activity_type="paper_a4", co2_per_unit=0.005)
    ]
    for factor in factors:
        existing = session.exec(select(EmissionFactor).where(
            EmissionFactor.category == factor.category,
            EmissionFactor.activity_type == factor.activity_type
        )).first()
        if not existing:
            session.add(factor)
    session.commit()
    print("========================================EMISSION FACTORS SAVED========================================")
    return {"message": "Emission factors set successfully"}


def calculate_footprint(log: DailyEnergyConsumption, factors_list:list[EmissionFactor],
                        session:Session):
    
    lab_info = session.exec(select(UniversityAssets).where(UniversityAssets.name == "lab")).first()
    asset_stats = {
        "total_pc_kw": 0 if lab_info is None else lab_info.quantity * (lab_info.power or 0.2) 
    }
    f = {factor.activity_type: factor.co2_per_unit for factor in factors_list}

    def get_f(key): return f.get(key, 0)

    transport_kg = log.total_distance * get_f("diesel")
    grid_kg = log.grid_consumption * get_f("grid_electricity")
    gen_kg = (log.gen_fuel_liters or 0) * get_f("diesel_generator")
    lab_kg = (asset_stats["total_pc_kw"] * log.lab_active_hrs) * get_f("grid_electricity")
    solar_savings_kg = log.solar_consumption * get_f("grid_electricity")
    paper_kg = log.paper_consumption * get_f("paper_a4")

    total_kg = transport_kg + grid_kg + gen_kg + lab_kg + paper_kg
    save_record = EmissionRecord(
        record_date=date.today(),
        total_co2_kg=total_kg,
        transport_co2=transport_kg,
        energy_co2=grid_kg + lab_kg,
        paper_co2=paper_kg,
        gen_co2=gen_kg,
        solar_savings_co2=solar_savings_kg
    )
    try:
        session.add(save_record)
        session.commit()
        session.refresh(save_record)
    except Exception as e:
        session.rollback()
        print("Error saving emission record:", e)
        raise e

    return {
        "total_emission": total_kg,
        "breakdown": {
            "transport": transport_kg,
            "grid": grid_kg,
            "generator": gen_kg,
            "lab": lab_kg,
            "paper": paper_kg,
            "solar_savings": solar_savings_kg
        }
    }