import React from 'react';
import { Metadata } from 'next';
import { PROFILES_DATA, getHydratedListings } from '@/lib/data/mock-db';
import { AgentDirectoryClientView } from '@/components/agents/AgentDirectoryClientView';

export const metadata: Metadata = {
  title: 'Verified Real Estate Agents & Agencies in Pakistan | plottyy',
  description: 'Connect directly with certified property dealers, estate agencies, and verified plot consultants in DHA, Bahria Town, and major Pakistani cities.',
};

export default function AgentsDirectoryPage() {
  const allListings = getHydratedListings();

  return (
    <AgentDirectoryClientView
      initialAgents={PROFILES_DATA}
      allListings={allListings}
    />
  );
}
