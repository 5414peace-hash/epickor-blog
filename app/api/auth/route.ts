/**
 * GitHub OAuth Start Handler for Decap CMS
 * 
 * This API route initiates the GitHub OAuth flow by redirecting
 * the user to GitHub's authorization page.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const provider = searchParams.get('provider');

  if (provider !== 'github') {
    return NextResponse.json(
      { error: 'Unsupported provider' },
      { status: 400 }
    );
  }

  const clientId = process.env.GITHUB_CLIENT_ID || 'Ov23liX8a70a0sNnzgo6';
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.epickor.com'}/api/auth/callback`;
  const scope = 'repo,user';

  // Generate random state for CSRF protection
  const state = Math.random().toString(36).substring(7);

  // Build GitHub authorization URL
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('state', state);

  // Redirect to GitHub
  return NextResponse.redirect(authUrl.toString());
}
