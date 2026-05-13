import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface CityMapProps {
  lat: number;
  lon: number;
  zoom?: number;
  className?: string;
  landmarks?: Array<{ lat: number; lon: number; name: string }>;
  focussedLocation?: [number, number] | null;
}

/** Component to handle map view updates */
function ChangeView({ center, zoom, focussedLocation }: { center: [number, number]; zoom: number; focussedLocation?: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (focussedLocation) {
      map.setView(focussedLocation, 16, { animate: true });
    } else {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, focussedLocation, map]);
  return null;
}

/**
 * Cinematic City Map component
 */
export function CityMap({ lat, lon, zoom = 13, className = '', landmarks = [], focussedLocation = null }: CityMapProps) {
  // Guard against invalid coordinates
  if (lat === undefined || lon === undefined || isNaN(lat) || isNaN(lon)) {
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 animate-pulse flex items-center justify-center text-bloom-text-muted italic ${className}`} style={{ height: '300px' }}>
        Initialising local coordinates...
      </div>
    );
  }

  const center: [number, number] = [lat, lon];

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl ${className}`} style={{ height: '300px' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true} // Enabled scroll zoom
        style={{ height: '100%', width: '100%' }}
        zoomControl={true} // Enabled zoom controls
      >
        {/* Colorful Map Tiles (CartoDB Voyager) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <ChangeView center={center} zoom={zoom} focussedLocation={focussedLocation} />
        
        <Marker position={center}>
          <Popup>
            <div className="text-sm font-medium">City Center</div>
          </Popup>
        </Marker>

        {landmarks
          .filter(poi => poi.lat !== undefined && poi.lon !== undefined && !isNaN(poi.lat) && !isNaN(poi.lon))
          .map((poi, i) => (
            <Marker key={`${poi.name}-${i}`} position={[poi.lat, poi.lon]}>
              <Popup>
                <div className="text-xs">{poi.name}</div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Decorative Overlay */}
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/20 rounded-2xl shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
    </div>
  );
}
