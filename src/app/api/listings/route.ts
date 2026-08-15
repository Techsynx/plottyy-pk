import { NextRequest, NextResponse } from 'next/server';
import { getFilteredListings, createListing } from '@/lib/actions/listings';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city') || undefined;
    const type = (searchParams.get('type') as any) || undefined;
    const purpose = (searchParams.get('purpose') as any) || undefined;

    const data = await getFilteredListings({ city, type, purpose });
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { input, isDraft, userId } = await req.json();
    const res = await createListing(input, isDraft, userId);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
