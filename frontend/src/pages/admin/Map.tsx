import { useState, useRef, useMemo } from 'react';
import { useGetAllPharmacies } from '../../hooks/pharmacy/useGetAllPharmacies';
import { useCreatePharmacy } from '../../hooks/pharmacy/useCreatePharmacy';
import { PharmacyForm, type PharmacyFormData } from '../../components/forms/PharmacyForm';
import { PharmacyMapPanel } from '../../components/maps/PharmacyMapPanel';
import { PharmacyTable } from '../../components/table/PharmacyTable';
import type { PharmacyLocation } from '../../components/maps/PharmacyMap';

const STORAGE_KEY = 'pharmacare_map_center';
const DEFAULT_CENTER: [number, number] = [7.1907, 125.4553];

const loadCenter = (): [number, number] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 2 && !isNaN(parsed[0]) && !isNaN(parsed[1]))
        return [parsed[0], parsed[1]];
    }
  } catch { /* ignore */ }
  return DEFAULT_CENTER;
};

const saveCenter = (center: [number, number]) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(center)); } catch { /* ignore */ }
};

const EMPTY_FORM: PharmacyFormData = {
  name: '', address: '', phone: '', isOpen: true, lat: '7.1907', lng: '125.4553',
};

export const Map = () => {
  const { data: pharmacies, loading, error } = useGetAllPharmacies();
  const { createPharmacy, loading: saving } = useCreatePharmacy();

  const [form, setForm] = useState<PharmacyFormData>(EMPTY_FORM);

  // ✅ mapCenter = the real saved default location (Set Location writes here)
  const [mapCenter, setMapCenter] = useState<[number, number]>(loadCenter);

  // ✅ searchCenter = ephemeral fly-to from search (never overwrites mapCenter)
  const [searchCenter, setSearchCenter] = useState<[number, number] | null>(null);

  const [successMsg, setSuccessMsg] = useState('');
  const [highlightIds, setHighlightIds] = useState<string[]>([]);
  const [topSearch, setTopSearch] = useState('');
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'pharmacy' | 'place' | 'none'>('idle');
  const [searchLabel, setSearchLabel] = useState('');

  const nominatimRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formNominatimRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allPharmacies: PharmacyLocation[] = useMemo(
    () =>
      (pharmacies ?? []).map((p) => ({
        _id: p._id,
        name: p.name,
        address: p.address,
        phone: p.phone,
        isOpen: p.isOpen,
        location: p.location,
      })),
    [pharmacies]
  );

  const handleTopSearch = (value: string) => {
    setTopSearch(value);
    if (nominatimRef.current) clearTimeout(nominatimRef.current);

    if (!value.trim()) {
      setHighlightIds([]);
      setSearchStatus('idle');
      setSearchLabel('');
      setSearchCenter(null); // ✅ restore map to mapCenter
      return;
    }

    const q = value.trim().toLowerCase();

    // 1. Try matching saved pharmacies first
    const pharmacyMatches = allPharmacies.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        (p.phone ?? '').toLowerCase().includes(q)
    );

    if (pharmacyMatches.length > 0) {
      setHighlightIds(pharmacyMatches.map((p) => p._id));
      // ✅ Only update searchCenter — mapCenter (Set Location) is untouched
      setSearchCenter([pharmacyMatches[0].location.lat, pharmacyMatches[0].location.lng]);
      setSearchStatus('pharmacy');
      setSearchLabel(`${pharmacyMatches.length} branch${pharmacyMatches.length > 1 ? 'es' : ''} found`);
      return;
    }

    // 2. Fall back to Nominatim geocoding
    setHighlightIds([]);
    setSearchStatus('searching');
    setSearchLabel('Searching map...');

    nominatimRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value + ' Philippines')}&format=json&limit=1`,
          { headers: { 'User-Agent': 'PharmaCare/1.0 (pharmacare@email.com)' } }
        );
        const data = await res.json();
        if (data[0]) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          // ✅ Only update searchCenter — mapCenter (Set Location) is untouched
          setSearchCenter([lat, lng]);
          setSearchStatus('place');
          setSearchLabel(data[0].display_name.split(',').slice(0, 2).join(','));
        } else {
          setSearchStatus('none');
          setSearchLabel('No results');
        }
      } catch {
        setSearchStatus('none');
        setSearchLabel('Search failed');
      }
    }, 600);
  };

  const handleFormChange = (field: keyof PharmacyFormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // ✅ Only this writes to mapCenter — search never touches it
  const handleLocationSet = (lat: number, lng: number) => {
    const newCenter: [number, number] = [lat, lng];
    setMapCenter(newCenter);
    saveCenter(newCenter);
  };

  const handleFlyTo = (lat: number, lng: number, id: string) => {
    // ✅ Table row click also uses searchCenter, not mapCenter
    setSearchCenter([lat, lng]);
    setHighlightIds([id]);
    setSearchStatus('pharmacy');
  };

  const handleCenterSearch = (value: string) => {
    if (formNominatimRef.current) clearTimeout(formNominatimRef.current);
    formNominatimRef.current = setTimeout(async () => {
      if (!value.trim()) return;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value + ' Philippines')}&format=json&limit=1`,
          { headers: { 'User-Agent': 'PharmaCare/1.0 (pharmacare@email.com)' } }
        );
        const data = await res.json();
        if (data[0]) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          setForm((prev) => ({ ...prev, lat: lat.toFixed(6), lng: lng.toFixed(6) }));
        }
      } catch (err) {
        console.error('Geocode failed:', err);
      }
    }, 700);
  };

  const handleSubmit = async () => {
    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    if (!form.name || !form.address || isNaN(lat) || isNaN(lng)) {
      alert('Please fill in name, address, and valid coordinates.');
      return;
    }
    await createPharmacy({ name: form.name, address: form.address, phone: form.phone, isOpen: form.isOpen });
    setForm(EMPTY_FORM);
    setSuccessMsg('Pharmacy saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const previewPharmacies: PharmacyLocation[] =
    form.lat && form.lng && form.name
      ? [...allPharmacies, {
          _id: '__preview__', name: `📍 ${form.name} (preview)`,
          address: form.address, isOpen: form.isOpen,
          location: { lat: parseFloat(form.lat), lng: parseFloat(form.lng) },
        }]
      : allPharmacies;

  const clearSearch = () => {
    setTopSearch('');
    setHighlightIds([]);
    setSearchStatus('idle');
    setSearchLabel('');
    setSearchCenter(null); // ✅ map snaps back to real mapCenter
    if (nominatimRef.current) clearTimeout(nominatimRef.current);
  };

  const badgeStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    padding: '3px 10px', borderRadius: 20, fontWeight: 600, flexShrink: 0,
    color: searchStatus === 'pharmacy' ? '#085a49'
         : searchStatus === 'place'    ? '#5a4b08'
         : searchStatus === 'none'     ? '#c0392b'
         : '#666',
    background: searchStatus === 'pharmacy' ? '#e6f4f1'
              : searchStatus === 'place'    ? '#fff8e1'
              : searchStatus === 'none'     ? '#fde8e8'
              : '#f0f0f0',
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: '#085a49', marginBottom: 4 }}>
        Pharmacy Location Manager
      </h1>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
        Add branches and manage their map locations
      </p>

      {/* ── TOP SEARCH BAR ── */}
      <div style={{
        background: 'white', border: '1.5px solid #d0e8e3', borderRadius: 12,
        padding: '0.9rem 1.1rem', marginBottom: '0.75rem',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 1px 6px rgba(8,90,73,0.06)',
      }}>
        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>
          {searchStatus === 'searching' ? '⏳' : '🔍'}
        </span>
        <input
          type="text"
          value={topSearch}
          onChange={(e) => handleTopSearch(e.target.value)}
          placeholder='Search a pharmacy branch or any place… e.g. "MedPlus" or "Roxas Night Market"'
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: '0.95rem', color: '#1a1a1a', background: 'transparent',
          }}
        />
        {topSearch && searchStatus !== 'idle' && searchStatus !== 'searching' && (
          <span style={badgeStyle}>{searchLabel}</span>
        )}
        {searchStatus === 'searching' && (
          <span style={{ fontSize: '0.75rem', color: '#999', flexShrink: 0 }}>Searching…</span>
        )}
        {topSearch && (
          <button
            onClick={clearSearch}
            style={{
              fontSize: '0.78rem', color: '#999', background: 'none',
              border: 'none', cursor: 'pointer', padding: '2px 4px', flexShrink: 0,
            }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {searchStatus === 'place' && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginBottom: '0.75rem', fontSize: '0.78rem', color: '#7a5c00',
          background: '#fff8e1', border: '1px solid #ffe082',
          borderRadius: 8, padding: '6px 12px',
        }}>
          <span>📍</span>
          <span>Showing map location for: <strong>{searchLabel}</strong> — no saved pharmacies match this search.</span>
        </div>
      )}

      {highlightIds.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
          {allPharmacies.filter((p) => highlightIds.includes(p._id)).map((p) => (
            <button
              key={p._id}
              onClick={() => handleFlyTo(p.location.lat, p.location.lng, p._id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem',
                background: '#fde8e8', color: '#c0392b',
                border: '1px solid #f5c6c6', cursor: 'pointer', fontWeight: 500,
              }}
            >
              🔴 {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
        {[
          { label: 'Total branches', value: allPharmacies.length },
          { label: 'Currently open', value: allPharmacies.filter((p) => p.isOpen).length },
          { label: 'Search radius', value: '1 km' },
        ].map((s) => (
          <div key={s.label} style={{ background: '#f0f9f6', borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 600, color: '#085a49' }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', color: '#666', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <PharmacyForm
          form={form} saving={saving} successMsg={successMsg}
          onChange={handleFormChange} onCenterSearch={handleCenterSearch} onSubmit={handleSubmit}
        />
        <PharmacyMapPanel
          pharmacies={previewPharmacies}
          center={searchCenter ?? mapCenter}
          defaultCenter={mapCenter}
          highlightIds={highlightIds}
          onLocationSet={handleLocationSet}
          searchCenter={searchCenter}
        />
      </div>

      <PharmacyTable
        pharmacies={allPharmacies}
        loading={loading}
        error={error}
        highlightIds={highlightIds}
        onFlyTo={handleFlyTo}
      />
    </div>
  );
};