import React from 'react';
import { Metadata } from 'next';
import { PROFILES_DATA, getHydratedListings } from '@/lib/data/mock-db';
import { getAgentProfileByHandleOrId } from '@/lib/actions/agents';
import { AgentProfileView } from '@/components/agents/AgentProfileView';

interface AgentDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AgentDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const agent = (await getAgentProfileByHandleOrId(id)) || PROFILES_DATA.find(
    (p) => p.username?.toLowerCase() === id.toLowerCase() || p.id === id
  );

  if (!agent) {
    return { title: 'Agency Profile | plottyy' };
  }

  return {
    title: `${agent.full_name} (@${agent.username || 'agent'}) — ${agent.agency_name} | plottyy`,
    description: `${agent.bio || 'Verified real estate consultant in Pakistan.'} View all verified plot and property listings.`,
    openGraph: {
      title: `${agent.full_name} - ${agent.agency_name}`,
      description: agent.bio || 'Verified Pakistani Real Estate Agency',
      images: agent.avatar_url ? [agent.avatar_url] : [],
    },
  };
}

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { id } = await params;
  const agent = (await getAgentProfileByHandleOrId(id)) || PROFILES_DATA.find(
    (p) => p.username?.toLowerCase() === id.toLowerCase() || p.id === id
  );

  const allListings = getHydratedListings();

  return (
    <AgentProfileView
      initialAgent={agent || null}
      initialListings={allListings}
      handleOrId={id}
    />
  );
}
