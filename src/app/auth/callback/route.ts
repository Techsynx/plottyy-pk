import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase/client';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code && SUPABASE_ANON_KEY) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.session?.user) {
      const user = data.session.user;
      const meta = user.user_metadata || {};
      const fullName = meta.full_name || meta.name || user.email?.split('@')[0] || 'Verified Agent';
      const avatarUrl = meta.avatar_url || meta.picture || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400';
      const cleanHandle = (user.email?.split('@')[0] || `agent_${user.id.slice(0, 5)}`).replace(/[^a-z0-9_-]/g, '').toLowerCase();

      // Upsert profile in Supabase table
      try {
        await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          full_name: fullName,
          username: cleanHandle,
          avatar_url: avatarUrl,
          agency_name: `${fullName} Real Estate`,
          is_verified: true,
          role: 'lister',
          rating: 5.0,
          reviews_count: 1,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
      } catch (e) {
        console.error('Error upserting Supabase profile:', e);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to home or next URL
  return NextResponse.redirect(`${origin}${next}`);
}
