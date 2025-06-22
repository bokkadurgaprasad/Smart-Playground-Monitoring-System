from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import DailyLog
from datetime import date

router = APIRouter()

@router.get("/logs", tags=["Logs"])
def get_all_logs(db: Session = Depends(get_db)):
    return db.query(DailyLog).order_by(DailyLog.date.desc()).all()

@router.get("/logs/today", tags=["Logs"])
def get_today_log(db: Session = Depends(get_db)):
    today = date.today()
    log = db.query(DailyLog).filter(DailyLog.date == today).first()
    return log or {"message": "No log found for today"}
