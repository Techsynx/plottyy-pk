import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { getAllAgents, saveAgentProfile } from '@/lib/actions/agents';

export async function GET(req: NextRequest) {
  try {
    const agents = await getAllAgents();
    return NextResponse.json({ success: true, agents });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const profile = await req.json();
    if (!profile || !profile.id) {
      return NextResponse.json({ success: false, error: 'Invalid profile data' }, { status: 400 });
    }
    const res = await saveAgentProfile(profile);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
