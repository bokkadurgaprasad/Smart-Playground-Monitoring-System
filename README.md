# Smart Playground Monitor

A real-time people counting system that tracks visitors entering/exiting playgrounds and maintains daily logs.

## Features
- Live video streaming with people counting
- Upload and process recorded videos
- Daily visitor count tracking
- Peak crowd detection
- Simple web interface

## Technology Stack
### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI (Python)
- **Computer Vision**: OpenCV
- **Object Tracking**: Centroid Tracker
- **Database**: SQLite
- **API Documentation**: Automatic Swagger UI

## Prerequisites
- Python 3.8+
- Node.js 16+
- npm/yarn
- Webcam (for live counting)

## Installation Guide

### Backend Setup
1. Navigate to backend folder:
    ```bash
    cd backend
    ```
2. Create virtual environment:
    ```bash
    python -m venv .venv
    ```
3. Activate virtual environment: <br>
    **Windows:**
    ```bash
    .venv\Scripts\activate
    ```
    **Mac/Linux:**
    ```bash
    source .venv/bin/activate
    ```
4. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
### Frontend Setup
1. Navigate to frontend folder:
    ```bash
    cd frontend/smart-frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
## Running the Application
### Start Backend Servers
    cd backend
    uvicorn app.main:app --reload
- API will run at: http://localhost:8000
- Swagger docs: http://localhost:8000/docs

### Start Frontend Development Server
    cd frontend/smart-frontend
    npm run dev
- Frontend will run at: http://localhost:5173

## How to Use
### Live People Counting
1. Click "Start Live Counting" to begin webcam feed
2. System will automatically count people crossing center line
3. Click "Stop Live Counting" when finished

### Video Upload
1. Click "Upload Video" button
2. Select recorded video file
3. System will process and return people count

### Viewing Logs
1. **Today's Log:** Shows current day's peak count
2. **All Logs:** Displays historical data

## Troubleshooting
- **Webcam not working:** Check camera permissions
- **Stream errors:** Ensure no other app is using camera
- **Installation issues:** Verify Python and Node versions

## Future Improvements
- Message alert before the playground closes
- Implement crowd density alerts
- Support multiple camera feeds
- Add user authentication
- Mobile app integration
