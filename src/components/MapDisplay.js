import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import polyline from 'polyline';

const onLocationChange = (message, setEncodedPolyline) => {
  console.log(message);
  // Example: Change the polyline based on location change
  const newEncodedPolyline = ""; // Replace with actual logic or keep empty if no default
  setEncodedPolyline((prevPolyline) => {
    if (prevPolyline !== newEncodedPolyline) {
      console.log(`Polyline changed to: ${newEncodedPolyline}`);
      return newEncodedPolyline;
    }
    return prevPolyline;
  });
};

const CurrentLocationMarker = ({ overrideLocation, setEncodedPolyline }) => {
  const [position, setPosition] = useState(null);
  const [heading, setHeading] = useState(null);

  useEffect(() => {
    if (overrideLocation) {
      setPosition(overrideLocation.position);
      setHeading(overrideLocation.heading);
      onLocationChange(`Location overridden to: ${overrideLocation.position}, Heading: ${overrideLocation.heading}`, setEncodedPolyline);
    } else if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, heading } = pos.coords;
          setPosition([latitude, longitude]);
          setHeading(heading);
          onLocationChange(`Current location updated: [${latitude}, ${longitude}], Heading: ${heading}`, setEncodedPolyline);
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }
  }, [overrideLocation, setEncodedPolyline]);

  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  if (!position) return null;

  const icon = L.divIcon({
    html: `<div style="transform: rotate(${heading || 0}deg);">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-navigation">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
           </div>`,
    className: '',
    iconSize: [24, 24],
  });

  return <Marker position={position} icon={icon}><Popup>Your current location</Popup></Marker>;
};

const PolylineDisplay = ({ overridePolyline, encodedPolyline }) => {
  const map = useMap();

  useEffect(() => {
    const polylineToDisplay = overridePolyline || encodedPolyline;
    if (polylineToDisplay) {
      const decodedPath = polyline.decode(polylineToDisplay, 6);
      const latlngs = decodedPath.map(([lat, lng]) => [lat, lng]);

      const polylineLayer = L.polyline(latlngs, { color: 'blue' }).addTo(map);

      // Fit map bounds to the polyline
      map.fitBounds(polylineLayer.getBounds());

      return () => {
        map.removeLayer(polylineLayer);
      };
    }
  }, [overridePolyline, encodedPolyline, map]);

  return null;
};

const MapDisplay = () => {
  const [overrideLocation, setOverrideLocation] = useState(null);
  const [overridePolyline, setOverridePolyline] = useState(null);

  // Retrieve or initialize encoded polyline from localStorage
  // try: '_bpjfAbkg~gFqaAjcCacDyhC|sBeiFp[eU~XfBrgCxpB'
  const [encodedPolyline, setEncodedPolyline] = useState(() => {
    const savedPolyline = localStorage.getItem('encodedPolyline');
    return savedPolyline || ""; // No default polyline if none is saved
  });

  // Save updated polyline to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('encodedPolyline', encodedPolyline);
  }, [encodedPolyline]);

  // Expose override functions to the browser console
  useEffect(() => {
    window.setOverrideLocation = (position, heading) => {
      setOverrideLocation({ position, heading });
      console.log(`Override location set to: ${position}, Heading: ${heading}`);
    };
    window.clearOverrideLocation = () => {
      setOverrideLocation(null);
      console.log(`Override location cleared. Using GPS location.`);
    };
    window.setOverridePolyline = (encoded) => {
      setOverridePolyline(encoded);
      console.log(`Override polyline set to: ${encoded}`);
    };
    window.clearOverridePolyline = () => {
      setOverridePolyline(null);
      console.log(`Override polyline cleared. Using user-defined polyline.`);
    };
    window.setEncodedPolyline = (encoded) => {
      setEncodedPolyline(encoded);
      console.log(`Encoded polyline saved to localStorage: ${encoded}`);
    };
  }, [encodedPolyline]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={[51.505, -0.09]} // Default center coordinates (latitude, longitude)
        zoom={13} // Default zoom level
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A sample popup.<br />Easily customizable.
          </Popup>
        </Marker>
        <CurrentLocationMarker overrideLocation={overrideLocation} setEncodedPolyline={setEncodedPolyline} />
        <PolylineDisplay overridePolyline={overridePolyline} encodedPolyline={encodedPolyline} />
      </MapContainer>
    </div>
  );
};

export default MapDisplay;
