import React, { useState } from 'react';
import { uploadVideo } from '../api';
import Layout from '../components/Layout';

const UploadVideo = () => {
  const [uploadMessage, setUploadMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('video/')) {
      setError('Please upload a valid video file');
      return;
    }

    setIsLoading(true);
    setError('');
    setUploadMessage('');

    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await uploadVideo(formData);
       const count = response.presence_count ?? 0;
      setUploadMessage(`Video processed successfully. Peak count: ${count}`);
    } catch (err) {
      setError('Failed to process video. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Upload Playground Video
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
            <label className="cursor-pointer">
              <div className="flex flex-col items-center justify-center space-y-2">
                <svg 
                  className="w-12 h-12 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                  />
                </svg>
                <p className="text-gray-600 font-medium">
                  {isLoading ? 'Processing video...' : 'Click to select a video file'}
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: MP4, MOV, AVI
                </p>
              </div>
              <input 
                type="file" 
                accept="video/mp4,video/x-m4v,video/*" 
                onChange={handleVideoUpload} 
                className="hidden" 
                disabled={isLoading}
              />
            </label>
          </div>

          {isLoading && (
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}

          {uploadMessage && (
            <div className="p-4 mb-4 text-center bg-green-50 text-green-700 rounded-lg">
              {uploadMessage}
            </div>
          )}

          {error && (
            <div className="p-4 mb-4 text-center bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="text-center text-sm text-gray-500 mt-4">
            The video will be processed to detect and count people entering and exiting of a playground.
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UploadVideo;