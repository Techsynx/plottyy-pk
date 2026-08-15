import { ListingInput } from '@/lib/validations/listing';
import { createListing } from '@/lib/actions/listings';

export interface BulkPropertyRaw {
  title: string;
  description: string;
  purpose: 'sale' | 'rent';
  property_type: 'plot' | 'house' | 'flat' | 'commercial';
  subtype?: string;
  city_name: string;
  location_name: string;
  size: number;
  size_unit: 'marla' | 'kanal' | 'sqft' | 'sqyd';
  price: number;
  contact_phone: string;
  contact_whatsapp?: string;
  photos: string[];
  bedrooms?: number;
  bathrooms?: number;
  facing?: string;
  features?: string[];
}

export async function bulkImportProperties(
  properties: BulkPropertyRaw[],
  fallbackPhone = '+923008456123'
): Promise<{ success: boolean; importedCount: number; errors: string[] }> {
  let count = 0;
  const errors: string[] = [];

  for (const item of properties) {
    try {
      const listingInput: ListingInput = {
        title: item.title,
        description: item.description,
        purpose: item.purpose || 'sale',
        property_type: item.property_type || 'plot',
        subtype: item.subtype || 'residential_plot',
        city_id: 1, // Default Lahore if not resolved
        location_id: 102, // Default DHA Phase 6 if not resolved
        size: Number(item.size),
        size_unit: item.size_unit || 'marla',
        price: Number(item.price),
        is_price_negotiable: true,
        installment_available: false,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        facing: item.facing || 'Main Boulevard',
        features: item.features || ['possession_paid', 'sui_gas', 'electricity'],
        contact_phone: item.contact_phone || fallbackPhone,
        contact_whatsapp: item.contact_whatsapp || item.contact_phone || fallbackPhone,
        photos: item.photos && item.photos.length > 0
          ? item.photos.map((url, idx) => ({
              url,
              alt_text: item.title,
              is_cover: idx === 0,
            }))
          : [
              {
                url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
                alt_text: item.title,
                is_cover: true,
              },
            ],
      };

      const res = await createListing(listingInput, false);
      if (res.success) {
        count++;
      } else {
        errors.push(`Failed for "${item.title}": ${res.error}`);
      }
    } catch (err: any) {
      errors.push(`Error on "${item.title}": ${err?.message}`);
    }
  }

  return {
    success: count > 0,
    importedCount: count,
    errors,
  };
}
