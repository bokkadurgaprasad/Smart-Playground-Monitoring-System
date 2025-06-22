import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const RealTimeCount = () => {
  const [message, setMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startStream = async () => {
    try {
      setIsLoading(true);
      setMessage('Starting live counting...');
      
      // Clear any previous message
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Start the stream with cache busting
      const streamUrl = `http://localhost:8000/start_video_feed?t=${Date.now()}`;
      setMessage('Live counting started');
      setIsStreaming(true);
    } catch (error) {
      setMessage('Failed to start stream');
      console.error('Stream start error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stopStream = async () => {
    try {
      setMessage('Stopping live counting...');
      await axios.get('http://localhost:8000/stop_video_feed');
      setMessage('Live counting stopped');
      setIsStreaming(false);
    } catch (error) {
      setMessage('Failed to stop stream');
      console.error('Stream stop error:', error);
    }
  };

  return (
    <Layout>
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Real-Time Monitoring</h2>

        {/* Real-time video stream from backend */}
        <div className="flex justify-center my-4">
          {isStreaming ? (
            <img
              src={`http://localhost:8000/start_video_feed?t=${Date.now()}`}
              alt="Live Webcam Feed"
              style={{
                width: '80%',
                maxWidth: '600px',
                height: '400px',
                border: '3px solid #4C1D95',
                borderRadius: '12px',
                boxShadow: '0 0 10px rgba(0,0,0,0.3)'
              }}
            />
          ) : (
            <div style={{
              width: '80%',
              maxWidth: '600px',
              height: '400px',
              border: '3px solid #4C1D95',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f3f4f6'
            }}>
              {isLoading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
              ) : (
                <p className="text-gray-500">Camera feed will appear here</p>
              )}
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={startStream}
            disabled={isStreaming || isLoading}
            className={`px-4 py-2 rounded cursor-pointer ${
              isStreaming || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isLoading ? 'Starting...' : 'Start Live Counting'}
          </button>
          
          <button
            onClick={stopStream}
            disabled={!isStreaming}
            className={`px-4 py-2 rounded cursor-pointer ${
              !isStreaming
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            Stop Live Counting
          </button>
        </div>

        {message && <p className="mt-4 text-blue-600">{message}</p>}
      </div>
    </Layout>
  );
};

export default RealTimeCount;