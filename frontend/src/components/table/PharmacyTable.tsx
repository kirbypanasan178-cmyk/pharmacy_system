import { useState, useMemo } from 'react';
import type { PharmacyLocation } from '../maps/PharmacyMap';

interface PharmacyTableProps {
  pharmacies: PharmacyLocation[];
  loading: boolean;
  error: string | null;
  highlightIds?: string[];
  onFlyTo?: (lat: number, lng: number, id: string) => void;
}

export const PharmacyTable = ({
  pharmacies,
  loading,
  error,
  highlightIds = [],
  onFlyTo,
}: PharmacyTableProps) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pharmacies;
    return pharmacies.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        (p.phone ?? '').toLowerCase().includes(q)
    );
  }, [pharmacies, query]);

  return (
    <div style={{ background: 'white', border: '1px solid #e0f0ed', borderRadius: 12, padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
        <h2 style={{
          fontSize: '0.8rem', color: '#085a49', textTransform: 'uppercase',
          letterSpacing: '0.05em', fontWeight: 600, margin: 0, flexShrink: 0,
        }}>
          All pharmacy branches
        </h2>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            fontSize: '0.85rem', color: '#aaa', pointerEvents: 'none',
          }}>
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter list by name, address, or phone…"
            style={{
              width: '100%', paddingLeft: 30, paddingRight: 10, paddingTop: 6, paddingBottom: 6,
              fontSize: '0.82rem', border: '1px solid #d0e8e3', borderRadius: 8,
              outline: 'none', color: '#333', background: '#f8fdfb',
              boxSizing: 'border-box',
            }}
          />
        </div>
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              fontSize: '0.75rem', color: '#085a49', background: 'none',
              border: 'none', cursor: 'pointer', padding: '4px 6px', flexShrink: 0,
            }}
          >
            Clear
          </button>
        )}
      </div>

      {loading && <p style={{ color: '#999', fontSize: '0.875rem' }}>Loading...</p>}
      {error && <p style={{ color: '#c0392b', fontSize: '0.875rem' }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {!loading && !error && filtered.length === 0 && (
          <p style={{ color: '#999', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
            {query ? `No branches match "${query}".` : 'No branches added yet.'}
          </p>
        )}
        {filtered.map((pharmacy, i) => {
          const isHighlighted = highlightIds.includes(pharmacy._id);
          return (
            <div
              key={pharmacy._id}
              onClick={() => onFlyTo?.(pharmacy.location.lat, pharmacy.location.lng, pharmacy._id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px',
                border: isHighlighted ? '1.5px solid #c0392b' : '1px solid #e0f0ed',
                borderRadius: 8,
                background: isHighlighted ? '#fff5f5' : 'white',
                cursor: onFlyTo ? 'pointer' : 'default',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isHighlighted) (e.currentTarget as HTMLDivElement).style.background = '#f6fcfa';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = isHighlighted ? '#fff5f5' : 'white';
              }}
            >
              <span style={{
                width: 26, height: 26, borderRadius: '50%',
                background: isHighlighted ? '#fde8e8' : '#e6f4f1',
                color: isHighlighted ? '#c0392b' : '#085a49',
                fontSize: '0.72rem', fontWeight: 600, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {i + 1}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: isHighlighted ? '#c0392b' : '#085a49' }}>
                  {pharmacy.name}
                  {isHighlighted && (
                    <span style={{ fontSize: '0.7rem', marginLeft: 6, fontWeight: 400, color: '#c0392b' }}>
                      ← on map
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#999' }}>
                  {pharmacy.address} · {pharmacy.location.lat.toFixed(4)}, {pharmacy.location.lng.toFixed(4)}
                </div>
                {pharmacy.phone && (
                  <div style={{ fontSize: '0.75rem', color: '#aaa' }}>📞 {pharmacy.phone}</div>
                )}
              </div>
              <span style={{
                fontSize: '0.72rem', padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                background: pharmacy.isOpen ? '#e6f4f1' : '#fde8e8',
                color: pharmacy.isOpen ? '#085a49' : '#c0392b',
                flexShrink: 0,
              }}>
                {pharmacy.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};