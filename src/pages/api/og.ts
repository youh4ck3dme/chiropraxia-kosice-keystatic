import { ImageResponse } from '@vercel/og';
import { createElement as h } from 'react';
import type { APIRoute } from 'astro';

export const runtime = 'edge';

export const GET: APIRoute = async ({ url }) => {
  try {
    const { searchParams } = new URL(url);
    const title = searchParams.get('title') || 'Chiropraxia Košice';

    return new ImageResponse(
      h(
        'div',
        {
          style: {
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#050505',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #006fb820 0%, transparent 70%)',
            padding: '40px 60px',
            textAlign: 'center',
          },
        },
        h(
          'h1',
          {
            style: {
              fontSize: '64px',
              fontWeight: '900',
              color: 'white',
              marginBottom: '18px',
              fontFamily: 'Outfit, sans-serif',
              lineHeight: '1.2',
            },
          },
          title
        ),
        h(
          'p',
          {
            style: {
              fontSize: '32px',
              color: '#14b8a6',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontFamily: 'Inter, sans-serif',
              margin: 0,
            },
          },
          'Chiropraxia Košice • Fyzioterapia'
        )
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    return new Response('Failed to generate image', { status: 500 });
  }
};
