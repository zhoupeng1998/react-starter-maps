import React, { useState, useEffect } from 'react';
import './App.css';
import LeftBar from './components/LeftBar';
import MapDisplay from './components/MapDisplay';

function App() {
  // State to manage the display result
  const [result, setResult] = useState('');

  // Load the initial state from localStorage
  useEffect(() => {
    const savedResult = localStorage.getItem('result');
    if (savedResult) {
      setResult(savedResult);
    }
  }, []);

  // Function to handle "Get Lucky Route" button click
  const handleGetLuckyRouteClick = () => {
    //
  };

  // Function to handle "Cancel" button click
  const handleCancelClick = () => {
    localStorage.removeItem('encodedPolyline');
  };

  return (
    <div className="app">
      {/* Left Sidebar */}
      <LeftBar
        onGetLuckyRoute={handleGetLuckyRouteClick}
        onCancel={handleCancelClick}
      />

      {/* Right Section */}
      <MapDisplay result={result} />
    </div>
  );
}

export default App;
