import { PropertyType, SizeUnit } from '@/types';

export const PROPERTY_TYPES_CONFIG: {
  id: PropertyType;
  label: string;
  subtypes: { id: string; label: string }[];
  requiresBeds: boolean;
}[] = [
  {
    id: 'plot',
    label: 'Plot / Land',
    subtypes: [
      { id: 'residential_plot', label: 'Residential Plot' },
      { id: 'commercial_plot', label: 'Commercial Plot' },
      { id: 'plot_file', label: 'Plot File / Allocation' },
      { id: 'farmhouse_plot', label: 'Farmhouse Plot' },
      { id: 'industrial_land', label: 'Industrial Land' },
    ],
    requiresBeds: false,
  },
  {
    id: 'house',
    label: 'House / Villa',
    subtypes: [
      { id: 'independent_house', label: 'Independent House' },
      { id: 'villa', label: 'Luxury Villa' },
      { id: 'upper_portion', label: 'Upper Portion' },
      { id: 'lower_portion', label: 'Lower Portion' },
      { id: 'farmhouse', label: 'Farmhouse' },
    ],
    requiresBeds: true,
  },
  {
    id: 'flat',
    label: 'Flat / Apartment',
    subtypes: [
      { id: 'apartment', label: 'Apartment' },
      { id: 'penthouse', label: 'Penthouse' },
      { id: 'studio', label: 'Studio Apartment' },
      { id: 'duplex', label: 'Duplex' },
    ],
    requiresBeds: true,
  },
  {
    id: 'commercial',
    label: 'Commercial',
    subtypes: [
      { id: 'shop', label: 'Shop' },
      { id: 'office', label: 'Office' },
      { id: 'plaza', label: 'Commercial Building / Plaza' },
      { id: 'warehouse', label: 'Warehouse / Godown' },
    ],
    requiresBeds: false,
  },
];

export const SIZE_UNITS_CONFIG: { id: SizeUnit; label: string; sqftMultiplier: number }[] = [
  { id: 'marla', label: 'Marla', sqftMultiplier: 225 }, // Standard 225 sqft/marla
  { id: 'kanal', label: 'Kanal', sqftMultiplier: 4500 }, // 20 Marlas = 4500 sqft
  { id: 'sqyd', label: 'Sq. Yd (Guz)', sqftMultiplier: 9 },
  { id: 'sqft', label: 'Sq. Ft', sqftMultiplier: 1 },
];

export const AMENITY_TAGS = [
  { id: 'corner', label: 'Corner Plot', category: 'plot' },
  { id: 'park_facing', label: 'Park Facing', category: 'plot' },
  { id: 'main_boulevard', label: 'Main Boulevard', category: 'plot' },
  { id: 'possession_paid', label: 'Possession Paid', category: 'plot' },
  { id: 'boundary_wall', label: 'Boundary Wall', category: 'plot' },
  { id: 'sui_gas', label: 'Sui Gas Available', category: 'utility' },
  { id: 'electricity', label: 'Electricity Available', category: 'utility' },
  { id: 'water_supply', label: 'Water Supply', category: 'utility' },
  { id: 'sewerage', label: 'Sewerage Connected', category: 'utility' },
  { id: 'security', label: '24/7 Gated Security', category: 'feature' },
  { id: 'mosque', label: 'Near Jamia Mosque', category: 'feature' },
  { id: 'commercial_market', label: 'Near Commercial Market', category: 'feature' },
  { id: 'car_porch', label: 'Car Porch / Garage', category: 'house' },
  { id: 'servant_quarter', label: 'Servant Quarter', category: 'house' },
  { id: 'modern_kitchen', label: 'Modern Imported Kitchen', category: 'house' },
];

/**
 * Converts any Pakistani price number into readable PKR representation (Crore, Lakh, Thousand)
 */
export function formatPKR(amount: number, isRent = false): string {
  if (!amount || isNaN(amount)) return 'PKR 0';
  
  if (amount >= 10000000) {
    const crores = amount / 10000000;
    const formatted = crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(2).replace(/\.?0+$/, '');
    return `PKR ${formatted} Crore${isRent ? '/mo' : ''}`;
  }
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    const formatted = lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(2).replace(/\.?0+$/, '');
    return `PKR ${formatted} Lakh${isRent ? '/mo' : ''}`;
  }
  if (amount >= 1000) {
    const thousands = amount / 1000;
    const formatted = thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1).replace(/\.?0+$/, '');
    return `PKR ${formatted}K${isRent ? '/mo' : ''}`;
  }
  return `PKR ${amount.toLocaleString('en-PK')}${isRent ? '/mo' : ''}`;
}

/**
 * Returns formatted words for a numeric price input
 */
export function getPKRInWords(amount: number): string {
  if (!amount || isNaN(amount) || amount <= 0) return '';
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2).replace(/\.?0+$/, '');
    return `${cr} Crore Rupees`;
  }
  if (amount >= 100000) {
    const lk = (amount / 100000).toFixed(2).replace(/\.?0+$/, '');
    return `${lk} Lakh Rupees`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)} Thousand Rupees`;
  }
  return `${amount} Rupees`;
}

/**
 * Formats size with units and auto-appends equivalent sq. ft
 */
export function formatSize(size: number, unit: SizeUnit): string {
  const unitLabel = SIZE_UNITS_CONFIG.find(u => u.id === unit)?.label || unit;
  return `${size} ${unitLabel}`;
}

export function convertToSqft(size: number, unit: SizeUnit): number {
  const config = SIZE_UNITS_CONFIG.find(u => u.id === unit);
  return size * (config?.sqftMultiplier || 225);
}

export function formatSqftToMarlaOrKanal(sqft: number): string {
  if (sqft >= 4500) {
    const kanal = (sqft / 4500).toFixed(1).replace(/\.?0+$/, '');
    return `${kanal} Kanal`;
  }
  const marla = (sqft / 225).toFixed(1).replace(/\.?0+$/, '');
  return `${marla} Marla`;
}
