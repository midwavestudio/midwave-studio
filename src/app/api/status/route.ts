import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const deployTimestamp = Date.now();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'Not configured';
  
  return NextResponse.json({
    status: 'ok',
    version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
    environment: process.env.NODE_ENV,
    timestamp: deployTimestamp,
    analytics: {
      gaConfigured: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      gaId: gaId.startsWith('G-') ? `${gaId.substring(0, 4)}...` : 'Invalid format'
    }
  });
} 