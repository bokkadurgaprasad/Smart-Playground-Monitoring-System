from fastapi import HTTPException
from app.video_processor import VideoProcessor
from app.db.database import SessionLocal
from app.models.models import DailyLog
from datetime import date
import calendar
import threading
import cv2
import os

class VideoCounter:
    def __init__(self):
        self.stream_active = False
        self.current_capture = None
        self.processor = VideoProcessor()
        self.lock = threading.Lock()

    def process_video(self, video_path):
        """Process uploaded video files"""
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise HTTPException(status_code=400, detail="Could not open video file")
        
        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                processed_frame, count = self.processor.process_frame(frame)
                cv2.imshow("Processing Video", processed_frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
            save_peak_count_to_db(self.processor.presence_count)
            return self.processor.presence_count
        finally:
            cap.release()
            cv2.destroyAllWindows()

    def generate_video_stream(self):
        """Generate frames from webcam"""
        with self.lock:
            if self.stream_active:
                raise HTTPException(status_code=400, detail="Stream already active")
            
            self.stream_active = True
            self.current_capture = cv2.VideoCapture(0)
            
            if not self.current_capture.isOpened():
                self.stream_active = False
                raise HTTPException(status_code=500, detail="Could not open video device")

        try:
            while self.stream_active:
                with self.lock:
                    if not self.stream_active:
                        break
                    ret, frame = self.current_capture.read()
                
                if not ret:
                    break
                
                try:
                    processed_frame, count = self.processor.process_frame(frame)
                    _, buffer = cv2.imencode('.jpg', processed_frame)
                    yield (b'--frame\r\n'
                        b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
                except GeneratorExit:  # Add this exception handler
                    break
                except Exception as e:
                    print(f"Frame processing error: {e}")
                    break
        except Exception as e:
            print(f"Stream error: {str(e)}")
        finally:
            self.stop_stream()

    def stop_stream(self):
        """Safely stop video stream"""
        with self.lock:
            if self.current_capture and self.current_capture.isOpened():
                self.current_capture.release()
            self.current_capture = None
            self.stream_active = False
            self.processor.reset_counter()
    
    def __del__(self):
        """Cleanup when instance is destroyed"""
        self.stop_stream()

def save_peak_count_to_db(peak_count: int):
    db = SessionLocal()
    today = date.today()
    day_name = calendar.day_name[today.weekday()]
    
    try:
        log = db.query(DailyLog).filter(DailyLog.date == today).first()
        if log:
            if peak_count > log.peak_count:
                log.peak_count = peak_count
        else:
            log = DailyLog(date=today, day=day_name, peak_count=peak_count)
            db.add(log)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()