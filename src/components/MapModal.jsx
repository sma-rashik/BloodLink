import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { X } from 'lucide-react';

// Fix for default marker icons not showing in React Leaflet with Vite
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapModal = ({ onClose, donors, userLocation }) => {
  const center = userLocation || [23.8103, 90.4125]; // Target user location or default to Dhaka 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl overflow-hidden w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200">
        <header className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 shadow-sm relative">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Nearby Donors MAP</h2>
            <p className="text-sm text-gray-500">Live map view of active donors</p>
          </div>
          <button 
            onClick={onClose} className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex-1 w-full bg-gray-100 relative">
          {/* Map Container from react-leaflet */}
          <MapContainer center={center} zoom={12} scrollWheelZoom={true} className="h-[60vh] sm:h-[70vh] w-full z-0 font-sans">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {donors.map(donor => (
              <Marker key={donor.id} position={donor.coordinates}>
                <Popup className="rounded-2xl shadow-lg border-0 overflow-hidden">
                  <div className="font-sans min-w-[150px] p-1">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-gray-900 text-base">{donor.name}</div>
                      <div className="bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded text-xs">{donor.group}</div>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">{donor.address}</div>
                    <a 
                      href={`tel:${donor.phone}`} className="block w-full text-center bg-red-600 text-white font-semibold rounded-lg py-2 px-3 text-sm hover:bg-red-700 transition shadow-sm"
                    >
                      Call Now
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
