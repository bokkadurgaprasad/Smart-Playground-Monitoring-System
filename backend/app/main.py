from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from app.counter import VideoCounter, save_peak_count_to_db
from sqlalchemy.orm import Session
from app.models import models
from app.db import database
from app import crud
from app.routers import logs
from datetime import datetime
import shutil
import os


# Create tables if not exists
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Smart Playground Monitor API")

# Initialize video counter instance
video_counter = VideoCounter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include logs API
app.include_router(logs.router)

@app.get("/")
def root():
    return {"message": "Smart Playground Monitor is running ✅"}

@app.post("/update-peak/")
def update_peak_count(count: int, db: Session = Depends(database.get_db)):
    today = datetime.today()
    day_name = today.strftime("%A")
    log = crud.create_or_update_daily_log(db, current_day=day_name, new_count=count)
    return {
        "message": "Peak count updated",
        "data": {
            "date": log.date,
            "day": log.day,
            "peak_count": log.peak_count
        }
    }

@app.get("/logs/")
def get_logs(db: Session = Depends(database.get_db)):
    logs = crud.get_all_logs(db)
    return {
        "logs": [
            {
                "date": log.date.strftime("%Y-%m-%d"),
                "day": log.day,
                "peak_count": log.peak_count
            } for log in logs
        ]
    }

@app.post("/process_video_upload")
async def process_video_upload(
    video: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    # Create temp directory if it doesn't exist
    temp_dir = "app/temp_videos"
    os.makedirs(temp_dir, exist_ok=True)
    video_path = os.path.join(temp_dir, video.filename)
    
    try:
        # Save uploaded file
        with open(video_path, 'wb') as buffer:
            shutil.copyfileobj(video.file, buffer)
        
        # Process video
        presence_count = video_counter.process_video(video_path)
        
        # Save peak count (optional - you had this commented out)
        # save_peak_count_to_db(presence_count)
        
        return {"presence_count": presence_count}
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Video processing failed: {str(e)}"
        )
    finally:
        # Clean up temp file
        if os.path.exists(video_path):
            os.remove(video_path)

@app.get("/start_video_feed")
async def start_video_feed():
    try:
        return StreamingResponse(
            video_counter.generate_video_stream(),
            media_type="multipart/x-mixed-replace; boundary=frame",
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
                "Connection": "close",
            }
        )
    except Exception as e:
        video_counter.stop_stream()
        return JSONResponse(
            status_code=500,
            content={"message": f"Failed to start video feed: {str(e)}"}
        )

@app.get("/stop_video_feed")
async def stop_video_feed():
    try:
        video_counter.stop_stream()
        return {"message": "Video feed stopped successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to stop video feed: {str(e)}"
        )