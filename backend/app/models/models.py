from sqlalchemy import Column, Integer, String, Date
from app.db.database import Base

class DailyLog(Base):
    __tablename__ = "daily_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, unique=True, nullable=False)
    day = Column(String, nullable=False)
    peak_count = Column(Integer, default=0)
    
    