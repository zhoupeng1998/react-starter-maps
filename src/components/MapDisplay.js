import React from 'react';

function MapDisplay({ result }) {
  return (
    <div className="result">
      {result && <p>{result}</p>}
    </div>
  );
}

export default MapDisplay;
