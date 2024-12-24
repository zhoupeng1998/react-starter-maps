import React from 'react';

function LeftBar({ onGetLuckyRoute, onCancel }) {
  return (
    <div className="sidebar">
      <button onClick={onGetLuckyRoute}>Get Lucky Route</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

export default LeftBar;
