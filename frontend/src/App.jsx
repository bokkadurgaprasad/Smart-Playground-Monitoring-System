import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TodaysLog from './pages/TodaysLog';
import AllLogs from './pages/AllLogs';
import UploadVideo from './pages/Uploadvideo';
import RealTimeCount from './pages/RealTimeCount';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TodaysLog />} />
        <Route path="/all-logs" element={<AllLogs />} />
        <Route path="/upload-video" element={<UploadVideo />} />
        <Route path="/real-time-monitoring" element={<RealTimeCount />} />
      </Routes>
    </Router>
  );
}

export default App;
