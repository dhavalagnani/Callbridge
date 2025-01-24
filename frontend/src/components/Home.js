import React, { useState } from 'react';
import Navbar from './Navbar';
import 'font-awesome/css/font-awesome.min.css';

const Home = () => {
  const handleScheduleCall = () => {
    console.log('Schedule Call button clicked');
  };

  const handleJoinMeeting = () => {
    console.log('Join Meeting button clicked');
  };

  const handleChat = () => {
    console.log('Chat button clicked');
  };

  return (
    <div className="bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-3xl font-bold mb-6">Welcome to CallBridge!</h2>
        <div className="flex space-x-4">
          <button onClick={handleScheduleCall} className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600">
            <i className="fa fa-calendar" aria-hidden="true"></i> Schedule Call
          </button>
          <button onClick={handleJoinMeeting} className="bg-green-500 text-white p-4 rounded hover:bg-green-600">
            <i className="fa fa-video-camera" aria-hidden="true"></i> Join Meeting
          </button>
          <button onClick={handleChat} className="bg-purple-500 text-white p-4 rounded hover:bg-purple-600">
            <i className="fa fa-comments" aria-hidden="true"></i> Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
