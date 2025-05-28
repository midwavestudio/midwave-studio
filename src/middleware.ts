import { NextRequest, NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the request is for an admin page
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // In a real application, you would check for authentication here
    // For now, we'll just allow access, but in production you should implement proper auth
    
    // Example of how to check for authentication:
    // const token = request.cookies.get('authToken')?.value;
    // const isAuthenticated = token && verifyAuthToken(token);
    
    const isAuthenticated = true; // Replace with real auth check in production
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      // You would implement a login page
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // Continue to the requested page if authenticated or not an admin route
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Apply to all admin routes
    '/admin/:path*',
  ],
}; 