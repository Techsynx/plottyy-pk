'use server';

import { Lead, LeadStatus, LeadType } from '@/types';
import { LEADS_DATA, LISTINGS_DATA, getHydratedLeads } from '@/lib/data/mock-db';
import { revalidatePath } from 'next/cache';

export interface RecordLeadInput {
  listingId: string;
  leadType: LeadType;
  buyerName?: string;
  buyerPhone?: string;
  buyerEmail?: string;
  message?: string;
}

export async function recordLead(input: RecordLeadInput): Promise<{ success: boolean; leadId?: string }> {
  try {
    const listing = LISTINGS_DATA.find((l) => l.id === input.listingId);
    if (!listing) return { success: false };

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      listing_id: input.listingId,
      lister_id: listing.user_id,
      lead_type: input.leadType,
      buyer_name: input.buyerName || (input.leadType === 'phone_reveal' ? 'Phone Visitor' : 'Direct Inquirer'),
      buyer_phone: input.buyerPhone || null,
      buyer_email: input.buyerEmail || null,
      message: input.message || (input.leadType === 'phone_reveal' ? 'Revealed owner phone number on listing page.' : 'Initiated WhatsApp inquiry.'),
      status: 'new',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    LEADS_DATA.unshift(newLead);
    listing.leads_count += 1;

    revalidatePath('/dashboard');
    revalidatePath(`/listings/${listing.slug}`);

    return { success: true, leadId: newLead.id };
  } catch (e) {
    console.error('Error recording lead:', e);
    return { success: false };
  }
}

export async function getListerLeads(listerId = 'a0000000-0000-0000-0000-000000000001'): Promise<Lead[]> {
  const all = getHydratedLeads();
  return all.filter((lead) => lead.lister_id === listerId);
}

export async function updateLeadStatus(leadId: string, status: LeadStatus, notes?: string): Promise<boolean> {
  const lead = LEADS_DATA.find((l) => l.id === leadId);
  if (lead) {
    lead.status = status;
    if (notes !== undefined) lead.notes = notes;
    lead.updated_at = new Date().toISOString();
    revalidatePath('/dashboard');
    return true;
  }
  return false;
}
