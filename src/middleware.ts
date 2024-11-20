import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/' || path === "/body-score-test" || path.startsWith("/about-us");
  const token = request.cookies.get('token')?.value;

  // Call the /api/admin/me endpoint if the path is protected and a token is present
  if (!isPublicPath && token) {
    try { 
      // Call /api/admin/me to validate the token or user session
      const response = await fetch(`${request.nextUrl.origin}/api/admin/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Print the response to the console
      const responseData = await response.json();
      console.log("Response from /api/admin/me:", responseData);

      // If the response is not OK and the user is trying to access /list or /stats, redirect to login
      if (!response.ok && (path === '/list-siswa' || path === '/profile' || path.startsWith('/stats'))) {
        const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
        return NextResponse.redirect(new URL(`/login?callback=${callbackUrl}&cS=true`, request.nextUrl));
      }
      

    } catch (error) {
      console.error("Error calling /api/admin/me:", error);
      sessionStorage.removeItem('username')
      const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
      return NextResponse.redirect(new URL(`/login?callback=${callbackUrl}&cS=true`, request.nextUrl));
    }
  }

  // Redirect to login if accessing a protected path without a token
  if (!isPublicPath && !token) {
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
    return NextResponse.redirect(new URL(`/login?callback=${callbackUrl}&cS=true`, request.nextUrl));
  }


  // Allow request to proceed if no redirection condition is met
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next|static|public|favicon.ico).*)',
};
