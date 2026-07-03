// ─────────────────────────────────────────────────────────────────────────────
// src/data/locations.js
// Pakistan province → district → tehsil → city hierarchy.
// Extend this object to add more regions; the cascade dropdowns in
// CheckoutView read from it automatically.
// ─────────────────────────────────────────────────────────────────────────────

export const WHATSAPP_NUMBER = '923084382626';

export const LOCATION_DATA = {
  Punjab: {
    Lahore: {
      'Lahore City': [
        'Model Town', 'DHA', 'Gulberg', 'Johar Town',
        'Township', 'Wapda Town', 'Samanabad',
      ],
      'Lahore Cantonment': ['Cantt Area', 'Defence', 'RA Bazar'],
    },
    Kasur: {
      Pattoki:  ['Pattoki City', 'Habibabad', 'Phool Nagar', 'Halla', 'Changa Manga'],
      Chunian:  ['Chunian City', 'Kanganpur', 'Ellahabad'],
      Kasur:    ['Kasur City', 'Khudian', 'Mustafabad'],
    },
    Rawalpindi: {
      'Rawalpindi City': ['Saddar', 'Satellite Town', 'Bahria Town'],
      'Gujar Khan':      ['Gujar Khan City'],
    },
  },
  Sindh: {
    'Karachi South': {
      Saddar: ['Clifton', 'DHA Phase 1-4', 'Civil Lines'],
    },
    'Karachi East': {
      'Gulshan-e-Iqbal': ['Gulshan-e-Iqbal', 'Bahadurabad'],
    },
  },
  KPK: {
    Peshawar: {
      'Peshawar City': ['Hayatabad', 'University Town', 'Saddar'],
    },
    Mardan: {
      Mardan: ['Mardan City', 'Sheikh Maltoon Town'],
    },
  },
};
