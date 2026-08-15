import { z } from 'zod';

export const listingSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(150, 'Title is too long'),
  purpose: z.enum(['sale', 'rent']),
  property_type: z.enum(['plot', 'house', 'flat', 'commercial', 'agricultural']),
  subtype: z.string().optional(),
  
  city_id: z.number().int().positive('Please select a city'),
  location_id: z.number().int().positive('Please select an area/society'),
  address_details: z.string().optional(),
  
  size: z.number().positive('Size must be greater than 0'),
  size_unit: z.enum(['marla', 'kanal', 'sqft', 'sqyd']),
  
  price: z.number().positive('Price must be greater than 0 in PKR'),
  is_price_negotiable: z.boolean().default(true),
  installment_available: z.boolean().default(false),
  
  bedrooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  floor_number: z.number().int().optional(),
  total_floors: z.number().int().optional(),
  facing: z.string().optional(),
  features: z.array(z.string()).default([]),
  
  description: z.string().min(20, 'Please write a descriptive summary of at least 20 characters'),
  contact_phone: z.string().min(10, 'Valid Pakistani phone number required (e.g. 03001234567)'),
  contact_whatsapp: z.string().optional(),
  
  photos: z.array(
    z.object({
      url: z.string().min(1, 'Photo URL or image data is required'),
      alt_text: z.string().optional(),
      is_cover: z.boolean().default(false),
    })
  ).min(1, 'Please upload at least 1 photo of the property'),
});

export type ListingInput = z.infer<typeof listingSchema>;
