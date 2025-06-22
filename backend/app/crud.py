from sqlalchemy.orm import Session
from datetime import date
from .models import models
# from app.models.models import DailyLog

def get_today_log(db: Session):
    today = date.today()
    log = db.query(models.DailyLog).filter(models.DailyLog.date == today).first()
    return log


def create_or_update_daily_log(db: Session, current_day: str, new_count: int):
    today = date.today()
    existing_log = db.query(models.DailyLog).filter(models.DailyLog.date == today).first()
    
    if existing_log:
        # Only update if new peak is higher
        if new_count > existing_log.peak_count:
            existing_log.peak_count = new_count
            db.commit()
            db.refresh(existing_log)
        return existing_log
    else:
        new_log = models.DailyLog(
            date=today,
            day=current_day,
            peak_count=new_count
        )
        db.add(new_log)
        db.commit()
        db.refresh(new_log)
        return new_log
def get_all_logs(db: Session):
    return db.query(models.DailyLog).order_by(models.DailyLog.date.desc()).all()