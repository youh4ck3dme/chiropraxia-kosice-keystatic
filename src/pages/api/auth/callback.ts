import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, redirect }) => {
  const authCode = url.searchParams.get('code');

  if (!authCode) {
    return new Response('No code provided', { status: 400 });
  }

  // Supabase is suspended; do not exchange code for session
  return redirect('/admin?error=auth-disabled');
};
