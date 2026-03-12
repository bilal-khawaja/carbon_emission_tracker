from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlmodel import select, Session, and_
from models import UniversityAssets, DailyEnergyConsumption, EmissionRecord, EmissionFactor, Users
from database import get_session
from datetime import date, timedelta
from typing import Optional, List
from pydantic import BaseModel
from api.methods import calculate_footprint
from auth.jwt_handeler import get_current_user

router = APIRouter()

class DashboardSummary(BaseModel):
    today_emissions: float
    weekly_avg: float
    monthly_total: float
    yearly_total: float
    breakdown: dict
    targets: dict
    recent_records: List[dict]

class UniversityAssetResponse(BaseModel):
    id: int
    name: str
    quantity: int
    power: Optional[float] = None
    fuel_type: Optional[str] = None

class LiveTrackerResponse(BaseModel):
    total_co2_kg: float
    transport_co2: float
    energy_co2: float
    paper_co2: float
    gen_co2: float
    solar_savings_co2: float
    message: str

@router.get("/daily_consumption", response_model=LiveTrackerResponse)
def get_live_tracker(
    consumption_date: Optional[date] = Query(None, description="Date for live emissions calculation"),
    session: Session = Depends(get_session)
):
    record = session.exec(select(EmissionRecord).where(
        EmissionRecord.record_date == (consumption_date or date.today()))).first()

    if not record:
        return LiveTrackerResponse(
            total_co2_kg=0.0,
            transport_co2=0.0,
            energy_co2=0.0,
            paper_co2=0.0,
            gen_co2=0.0,
            solar_savings_co2=0.0,
            message="No emission record found for the specified date"
        )
    return LiveTrackerResponse(
        total_co2_kg=record.total_co2_kg,
        transport_co2=record.transport_co2,
        energy_co2=record.energy_co2,
        paper_co2=record.paper_co2,
        gen_co2=record.gen_co2,
        solar_savings_co2=record.solar_savings_co2,
        message="Live emissions data retrieved successfully"
    )


@router.get("/dashboard_summary", response_model=DashboardSummary)
def get_dashboard_summary(session: Session = Depends(get_session)):

    today = date.today()
    today_record = session.exec(
        select(EmissionRecord).where(EmissionRecord.record_date == today)
    ).first()
    
    week_ago = today - timedelta(days=7)
    weekly_records = session.exec(
        select(EmissionRecord).where(
            and_(
                EmissionRecord.record_date >= week_ago,
                EmissionRecord.record_date <= today
            )
        )
    ).all()
    
    month_start = today.replace(day=1)
    monthly_records = session.exec(
        select(EmissionRecord).where(
            and_(
                EmissionRecord.record_date >= month_start,
                EmissionRecord.record_date <= today
            )
        )
    ).all()
    
    year_start = today.replace(month=1, day=1)
    yearly_records = session.exec(
        select(EmissionRecord).where(
            and_(
                EmissionRecord.record_date >= year_start,
                EmissionRecord.record_date <= today
            )
        )
    ).all()
    
    today_emissions = today_record.total_co2_kg if today_record else 0.0
    weekly_avg = sum(r.total_co2_kg for r in weekly_records) / max(len(weekly_records), 1) if weekly_records else 0.0
    monthly_total = sum(r.total_co2_kg for r in monthly_records) if monthly_records else 0.0
    yearly_total = sum(r.total_co2_kg for r in yearly_records) if yearly_records else 0.0
    
    breakdown = {
        "transport": today_record.transport_co2 if today_record else 0.0,
        "energy": today_record.energy_co2 if today_record else 0.0,
        "paper": today_record.paper_co2 if today_record else 0.0,
        "generator": today_record.gen_co2 if today_record else 0.0,
        "solar_savings": today_record.solar_savings_co2 if today_record else 0.0
    }
    
    targets = {
        "daily": 400.0,
        "weekly": 2800.0,
        "monthly": 12000.0,
        "yearly": 146000.0
    }
    
    recent_records = [
        {
            "date": r.record_date.isoformat(),
            "emissions": r.total_co2_kg,
            "breakdown": {
                "transport": r.transport_co2,
                "energy": r.energy_co2,
                "paper": r.paper_co2,
                "generator": r.gen_co2,
                "solar_savings": r.solar_savings_co2
            }
        } for r in sorted(weekly_records, key=lambda x: x.record_date)
    ]
    
    return DashboardSummary(
        today_emissions=today_emissions,
        weekly_avg=weekly_avg,
        monthly_total=monthly_total,
        yearly_total=yearly_total,
        breakdown=breakdown,
        targets=targets,
        recent_records=recent_records
    )

@router.get("/university_assets", response_model=List[UniversityAssetResponse])
def get_university_assets(session: Session = Depends(get_session),
 get_current_user: Users = Depends(get_current_user("admin"))):

    print("Getting university assets from database...") 
    assets = session.exec(select(UniversityAssets)).all()
    print(f"Found {len(assets)} assets") 
    for asset in assets:
        print(f"Asset: {asset.name}, Quantity: {asset.quantity}, Power: {asset.power}")
    return assets

@router.get("/reports")
def get_reports(
    report_type: str = Query("weekly", description="Type of report: weekly, monthly, yearly"),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    session: Session = Depends(get_session)
):
    today = date.today()
    
    if not start_date or not end_date:
        if report_type == "weekly":
            start_date = today - timedelta(days=7)
            end_date = today
        elif report_type == "monthly":
            start_date = today - timedelta(days=30)
            end_date = today
        elif report_type == "yearly":
            start_date = today - timedelta(days=365)
            end_date = today
        else:
            start_date = today - timedelta(days=7)
            end_date = today
    
    records = session.exec(
        select(EmissionRecord).where(
            and_(
                EmissionRecord.record_date >= start_date,
                EmissionRecord.record_date <= end_date
            )
        ).order_by(EmissionRecord.record_date)
    ).all()
    
    if not records:
        return {
            "report_type": report_type,
            "period": {
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat()
            },
            "summary": {
                "total_emissions": 0.0,
                "avg_emissions": 0.0,
                "record_count": 0
            },
            "category_breakdown": {
                "transport": 0.0,
                "energy": 0.0,
                "paper": 0.0,
                "generator": 0.0,
                "solar_savings": 0.0
            },
            "chart_data": {
                "dates": [],
                "emissions": [],
                "breakdown": []
            },
            "message": "No emission records found for the specified period"
        }
    
    total_emissions = sum(r.total_co2_kg for r in records)
    avg_emissions = total_emissions / len(records)
    
    category_totals = {
        "transport": sum(r.transport_co2 for r in records),
        "energy": sum(r.energy_co2 for r in records),
        "paper": sum(r.paper_co2 for r in records),
        "generator": sum(r.gen_co2 for r in records),
        "solar_savings": sum(r.solar_savings_co2 for r in records)
    }
    
    chart_data = {
        "dates": [r.record_date.isoformat() for r in records],
        "emissions": [r.total_co2_kg for r in records],
        "breakdown": [
            {
                "date": r.record_date.isoformat(),
                "transport": r.transport_co2,
                "energy": r.energy_co2,
                "paper": r.paper_co2,
                "generator": r.gen_co2,
                "solar_savings": r.solar_savings_co2
            } for r in records
        ]
    }
    
    return {
        "report_type": report_type,
        "period": {
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat()
        },
        "summary": {
            "total_emissions": total_emissions,
            "avg_emissions": avg_emissions,
            "record_count": len(records)
        },
        "category_breakdown": category_totals,
        "chart_data": chart_data,
        "records": [
            {
                "date": r.record_date.isoformat(),
                "total_co2_kg": r.total_co2_kg,
                "breakdown": {
                    "transport": r.transport_co2,
                    "energy": r.energy_co2,
                    "paper": r.paper_co2,
                    "generator": r.gen_co2,
                    "solar_savings": r.solar_savings_co2
                }
            } for r in records
        ]
    }