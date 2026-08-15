import React from 'react';
import { Metadata } from 'next';
import { getFilteredListings } from '@/lib/actions/listings';
import { getListerLeads } from '@/lib/actions/leads';
import { ListerDashboardView } from '@/components/dashboard/ListerDashboardView';

export const metadata: Metadata = {
  title: 'Lister Dashboard & Leads Inbox | plottyy',
  description: 'Manage your property listings, track buyer phone reveals, WhatsApp inquiries, and manage lead statuses.',
};

export default async function DashboardPage() {
  const { listings } = await getFilteredListings();
  const leads = await getListerLeads();

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E3DC]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2420] tracking-tight">
              Lister Portal & Leads Hub
            </h1>
            <p className="text-xs sm:text-sm text-[#6B726D]">
              Real-time performance metrics, buyer inquiries, and listing controls
            </p>
          </div>
        </div>

        <ListerDashboardView initialListings={listings} initialLeads={leads} />

      </div>
    </div>
  );
}
