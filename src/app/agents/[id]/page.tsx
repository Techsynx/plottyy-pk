import React from 'react';
import { Metadata } from 'next';
import { PROFILES_DATA } from '@/lib/data/mock-db';
import { getAgentProfileByHandleOrId } from '@/lib/actions/agents';
import { getFilteredListings } from '@/lib/actions/listings';
import { AgentProfileView } from '@/components/agents/AgentProfileView';

interface AgentDetailPageProps {
  params: Promise<{ id: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://plotty.unicorn-realtors.com';

export async function generateMetadata({ params }: AgentDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const agent = (await getAgentProfileByHandleOrId(id)) || PROFILES_DATA.find(
    (p) => p.username?.toLowerCase() === id.toLowerCase() || p.id === id
  );

  if (!agent) {
    return { title: 'Agency Profile | plottyy' };
  }

  const handle = agent.username || id;
  const agencyTitle = agent.agency_name || `${agent.full_name} Real Estate`;
  const areas = agent.operating_areas?.join(', ') || 'DHA Defence, Bahria Town';

  return {
    title: `${agent.full_name} (@${handle}) — ${agencyTitle} | Verified Plot & Property Consultant`,
    description: `${agencyTitle} by ${agent.full_name} (@${handle}) on Plottyy. Specializing in verified residential plots and commercial properties in ${areas}. Direct WhatsApp & call.`,
    keywords: [
      `${agent.full_name}`,
      `${agent.agency_name}`,
      `@${handle}`,
      `exhuzaifa`,
      `unicorn realtors`,
      `real estate agent ${areas}`,
      `plot dealer ${areas}`,
      `plot finder pakistan`,
      `plottyy`,
    ],
    alternates: {
      canonical: `${SITE_URL}/agents/${handle}`,
    },
    openGraph: {
      title: `${agent.full_name} (@${handle}) — ${agencyTitle}`,
      description: `${agent.bio || 'Verified real estate consultant in Pakistan.'} Direct property portfolio and verified inventory.`,
      url: `${SITE_URL}/agents/${handle}`,
      images: agent.avatar_url ? [{ url: agent.avatar_url, alt: agent.full_name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${agent.full_name} (@${handle}) - ${agencyTitle}`,
      description: agent.bio || 'Verified Real Estate Agent on Plottyy',
      images: agent.avatar_url ? [agent.avatar_url] : [],
    },
  };
}

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { id } = await params;
  const agent = (await getAgentProfileByHandleOrId(id)) || PROFILES_DATA.find(
    (p) => p.username?.toLowerCase() === id.toLowerCase() || p.id === id
  );

  const { listings: allListings } = await getFilteredListings();

  const handle = agent?.username || id;
  const jsonLd = agent ? {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    'name': agent.full_name,
    'alternateName': `@${handle}`,
    'description': agent.bio || 'Certified Real Estate Agent in Pakistan',
    'url': `${SITE_URL}/agents/${handle}`,
    'image': agent.avatar_url,
    'telephone': agent.phone_number,
    'parentOrganization': {
      '@type': 'Organization',
      'name': agent.agency_name || 'Unicorn Realtors',
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': agent.rating || '5.0',
      'reviewCount': agent.reviews_count || 1,
    },
    'areaServed': agent.operating_areas?.map((area) => ({
      '@type': 'AdministrativeArea',
      'name': area,
    })) || [{ '@type': 'AdministrativeArea', 'name': 'DHA Lahore' }],
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <AgentProfileView
        initialAgent={agent || null}
        initialListings={allListings}
        handleOrId={id}
      />
    </>
  );
}
