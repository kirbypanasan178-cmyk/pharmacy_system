export interface PharmacyFormData {
  name: string;
  address: string;
  phone: string;
  isOpen: boolean;
  lat: string;
  lng: string;
}

interface PharmacyFormProps {
  form: PharmacyFormData;
  saving: boolean;
  successMsg: string;
  onChange: (field: keyof PharmacyFormData, value: string | boolean) => void;
  onCenterSearch: (value: string) => void;
  onSubmit: () => void;
}

export const PharmacyForm = ({
  form,
  saving,
  successMsg,
  onChange,
  onCenterSearch,
  onSubmit,
}: PharmacyFormProps) => {
  return (
    <div style={{ background: 'white', border: '1px solid #e0f0ed', borderRadius: 12, padding: '1.25rem' }}>
      <h2 style={{
        fontSize: '0.8rem', color: '#085a49', textTransform: 'uppercase',
        letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: 600,
      }}>
        Add new branch
      </h2>

      {successMsg && (
        <div style={{
          background: '#e6f4f1', color: '#085a49', padding: '8px 12px',
          borderRadius: 8, fontSize: '0.83rem', marginBottom: '0.75rem',
        }}>
          ✓ {successMsg}
        </div>
      )}

      {/* Basic fields */}
      {(['name', 'address', 'phone'] as const).map((field) => (
        <div key={field} style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.78rem', color: '#666', display: 'block', marginBottom: 4 }}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            type="text"
            className="form-control"
            style={{ fontSize: '0.875rem' }}
            value={form[field]}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={
              field === 'name' ? 'e.g. MedPlus Davao Branch'
              : field === 'phone' ? '+63 82 000 0001'
              : 'Full address'
            }
          />
        </div>
      ))}

      <hr style={{ borderColor: '#e0f0ed', margin: '0.75rem 0' }} />

      <div style={{
        fontSize: '0.78rem', color: '#085a49', textTransform: 'uppercase',
        letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 600,
      }}>
        Set location
      </div>

      {/* Place search */}
      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{ fontSize: '0.78rem', color: '#666', display: 'block', marginBottom: 4 }}>
          Search place (moves map center)
        </label>
        <input
          type="text"
          className="form-control"
          style={{ fontSize: '0.875rem' }}
          onChange={(e) => onCenterSearch(e.target.value)}
          placeholder="e.g. Buhangin, Davao City"
        />
      </div>

      {/* Lat / Lng */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '0.75rem' }}>
        {(['lat', 'lng'] as const).map((coord) => (
          <div key={coord}>
            <label style={{ fontSize: '0.78rem', color: '#666', display: 'block', marginBottom: 4 }}>
              {coord === 'lat' ? 'Latitude' : 'Longitude'}
            </label>
            <input
              type="number"
              className="form-control"
              style={{ fontSize: '0.875rem' }}
              value={form[coord]}
              onChange={(e) => onChange(coord, e.target.value)}
              step="0.000001"
            />
          </div>
        ))}
      </div>

      <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.75rem' }}>
        💡 Or click directly on the map to drop a pin
      </p>

      {/* Open toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
        <input
          type="checkbox"
          id="isOpen"
          checked={form.isOpen}
          onChange={(e) => onChange('isOpen', e.target.checked)}
        />
        <label htmlFor="isOpen" style={{ fontSize: '0.875rem', marginBottom: 0, cursor: 'pointer' }}>
          Currently open
        </label>
      </div>

      <button
        onClick={onSubmit}
        disabled={saving}
        style={{
          width: '100%', padding: '9px', background: '#085a49', color: 'white',
          border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 500,
          cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? 'Saving...' : '＋ Save pharmacy'}
      </button>
    </div>
  );
};