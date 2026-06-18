import { useState } from 'react';
import { PharmacyMap, type PharmacyLocation } from './PharmacyMap';

interface PharmacyMapPanelProps {
  pharmacies: PharmacyLocation[];
  center: [number, number];
  defaultCenter: [number, number];
  highlightIds?: string[];
  searchCenter?: [number, number] | null;
  onLocationSet: (lat: number, lng: number) => void;
}

export const PharmacyMapPanel = ({
  pharmacies,
  center,
  defaultCenter,
  highlightIds = [],
  searchCenter,
  onLocationSet,
}: PharmacyMapPanelProps) => {
  const [settingLocation, setSettingLocation] = useState(false);

  const handleMapClick = (lat: number, lng: number) => {
    if (!settingLocation) return;
    onLocationSet(lat, lng);
    setSettingLocation(false);
  };

  return (
    <div style={{ background: 'white', border: '1px solid #e0f0ed', borderRadius: 12, padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            fontSize: '0.78rem', color: '#085a49', textTransform: 'uppercase',
            letterSpacing: '0.05em', fontWeight: 600,
          }}>
            Map Preview
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { color: '#2d7a3a', label: 'Center' },
              { color: '#2a6cb8', label: 'Pharmacy' },
              { color: '#c0392b', label: 'Match' },
              { color: '#e67e22', label: 'Pin' },
            ].map(({ color, label }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.68rem', color: '#888' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => setSettingLocation((prev) => !prev)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 8,
            border: '2px solid #085a49',
            background: settingLocation ? '#085a49' : 'white',
            color: settingLocation ? 'white' : '#085a49',
            fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {settingLocation
            ? <><span style={{ fontSize: '1rem' }}>✕</span> Cancel</>
            : <><span style={{ fontSize: '1rem' }}>📍</span> Set Location</>}
        </button>
      </div>

      {settingLocation && (
        <div style={{
          background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 8,
          padding: '8px 12px', marginBottom: '0.75rem',
          fontSize: '0.78rem', color: '#7a5c00', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span>⚠️</span>
          <span>Click anywhere on the map to set the default location. The radius will move there.</span>
        </div>
      )}

      <PharmacyMap
        pharmacies={pharmacies}
        center={center}
        radiusCenter={defaultCenter}
        zoom={13}
        height="380px"
        showRadius={true}
        radiusMeters={1000}
        settingLocation={settingLocation}
        highlightIds={highlightIds}
        searchCenter={searchCenter}
        onMapClick={handleMapClick}
      />

      <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
        {settingLocation
          ? 'Click the map to place the location pin, or press Cancel to exit.'
          : `Default location: ${defaultCenter[0].toFixed(4)}, ${defaultCenter[1].toFixed(4)}`}
      </p>
    </div>
  );
};