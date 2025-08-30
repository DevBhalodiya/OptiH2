import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    // Handle OAuth callback
    try {
      // Here you would exchange the code for tokens
      // For now, we'll just redirect to the dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url));
    }
  }
  
  // Initiate OAuth flow
  const googleAuthUrl = new URL('https://accounts.google.com/oauth/authorize');
  googleAuthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID || 'your-client-id');
  googleAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/google`);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  
  return NextResponse.redirect(googleAuthUrl.toString());
}
