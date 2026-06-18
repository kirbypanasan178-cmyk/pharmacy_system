import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const makeIcon = (color: string) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const greenIcon  = makeIcon('green');
const blueIcon   = makeIcon('blue');
const redIcon    = makeIcon('red');
const orangeIcon = makeIcon('orange');

export interface PharmacyLocation {
  _id: string;
  name: string;
  address: string;
  phone?: string;
  isOpen: boolean;
  location: { lat: number; lng: number };
}

interface PharmacyMapProps {
  pharmacies: PharmacyLocation[];
  center?: [number, number];
  radiusCenter?: [number, number];
  zoom?: number;
  height?: string;
  showRadius?: boolean;
  radiusMeters?: number;
  settingLocation?: boolean;
  highlightIds?: string[];
  searchCenter?: [number, number] | null;
  onMapClick?: (lat: number, lng: number) => void;
}

const MapRecenter = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  const prevCenter = useRef<[number, number]>(center);
  useEffect(() => {
    if (prevCenter.current[0] !== center[0] || prevCenter.current[1] !== center[1]) {
      prevCenter.current = center;
      map.flyTo(center, map.getZoom(), { animate: true, duration: 0.8 });
    }
  }, [center, map]);
  return null;
};

const FitBounds = ({ pharmacies }: { pharmacies: PharmacyLocation[] }) => {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current || pharmacies.length === 0) return;
    const real = pharmacies.filter((p) => p._id !== '__preview__');
    if (real.length === 0) return;
    const bounds = L.latLngBounds(
      real.map((p) => [p.location.lat, p.location.lng] as [number, number])
    );
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    fitted.current = true;
  }, [pharmacies, map]);
  return null;
};

const ClickHandler = ({
  settingLocation,
  onPin,
  onMapClick,
}: {
  settingLocation: boolean;
  onPin: (lat: number, lng: number) => void;
  onMapClick?: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onPin(e.latlng.lat, e.latlng.lng);
      if (settingLocation) onMapClick?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const PharmacyMap = ({
  pharmacies,
  center = [7.1907, 125.4553],
  radiusCenter,
  zoom = 13,
  height = '450px',
  showRadius = false,
  radiusMeters = 1000,
  settingLocation = false,
  highlightIds = [],
  searchCenter,
  onMapClick,
}: PharmacyMapProps) => {
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);

  const validPharmacies = pharmacies.filter(
    (p) =>
      p.location &&
      typeof p.location.lat === 'number' &&
      typeof p.location.lng === 'number' &&
      !isNaN(p.location.lat) &&
      !isNaN(p.location.lng)
  );

  return (
    <div
      className="w-100 rounded-3 overflow-hidden shadow-sm"
      style={{
        height,
        cursor: settingLocation ? 'crosshair' : 'grab',
        outline: settingLocation ? '2px solid #085a49' : 'none',
        borderRadius: 8,
      }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter center={center} />
        <FitBounds pharmacies={validPharmacies} />
        <ClickHandler
          settingLocation={settingLocation}
          onPin={(lat, lng) => setPin({ lat, lng })}
          onMapClick={onMapClick}
        />

        {showRadius && (
          <Circle
            center={radiusCenter ?? center}
            radius={radiusMeters}
            pathOptions={{
              color: '#085a49', fillColor: '#085a49',
              fillOpacity: 0.06, weight: 2, dashArray: '6 4',
            }}
          />
        )}

        {/* 🟢 Green — center / default location */}
        <Marker position={radiusCenter ?? center} icon={greenIcon}>
          <Popup>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem' }}>
              <strong style={{ color: '#085a49' }}>📍 Default / Center Location</strong>
              <p style={{ margin: '4px 0 0', color: '#666' }}>
                {(radiusCenter ?? center)[0].toFixed(6)}, {(radiusCenter ?? center)[1].toFixed(6)}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: '#aaa' }}>🟢 Green marker</p>
            </div>
          </Popup>
        </Marker>

        {/* 🟠 Orange — temp clicked pin */}
        {pin && (
          <Marker position={[pin.lat, pin.lng]} icon={orangeIcon}>
            <Popup>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem' }}>
                <strong style={{ color: '#085a49' }}>
                  {settingLocation ? '📍 New default location' : '📍 Selected location'}
                </strong>
                <p style={{ margin: '4px 0 0', color: '#666' }}>
                  {pin.lat.toFixed(6)}, {pin.lng.toFixed(6)}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: '#aaa' }}>🟠 Orange marker</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 🔴 Red — place search result pin */}
        {searchCenter && (
          <Marker position={searchCenter} icon={redIcon}>
            <Popup>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem' }}>
                <strong style={{ color: '#c0392b' }}>📍 Search Result</strong>
                <p style={{ margin: '4px 0 0', color: '#666' }}>
                  {searchCenter[0].toFixed(6)}, {searchCenter[1].toFixed(6)}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: '#aaa' }}>🔴 Red marker</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 🔵 Blue = saved | 🔴 Red = highlighted */}
        {validPharmacies.map((pharmacy) => (
          <Marker
            key={pharmacy._id}
            position={[pharmacy.location.lat, pharmacy.location.lng]}
            icon={highlightIds.includes(pharmacy._id) ? redIcon : blueIcon}
          >
            <Popup>
              <div style={{ minWidth: '180px', fontFamily: "'DM Sans', sans-serif" }}>
                <h4 style={{ fontSize: '0.95rem', color: '#085a49', fontWeight: 700, marginBottom: 4 }}>
                  {pharmacy.name}
                </h4>
                <p style={{ fontSize: '0.82rem', lineHeight: '1.4', color: '#666', marginBottom: 4 }}>
                  {pharmacy.address}
                </p>
                {pharmacy.phone && (
                  <p style={{ fontSize: '0.82rem', color: '#666', marginBottom: 8 }}>
                    📞 {pharmacy.phone}
                  </p>
                )}
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: pharmacy.isOpen ? '#085a49' : '#c0392b' }}>
                  {pharmacy.isOpen ? '● Open' : '● Closed'}
                </span>
                {highlightIds.includes(pharmacy._id) && (
                  <p style={{ margin: '6px 0 0', fontSize: '0.72rem', color: '#c0392b' }}>🔴 Search result</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};