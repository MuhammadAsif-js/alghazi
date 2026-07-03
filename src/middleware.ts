import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

/**
 * Edge Middleware — runs before every request.
 * Protects all /admin/* routes at the edge layer,
 * acting as a second security layer beyond getServerSession().
 */
export default withAuth(
  function middleware(req) {
    // Allow the request to pass through if authenticated
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Must have a valid token (i.e., be logged in)
        return !!token;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

export const config = {
  // Apply middleware ONLY to /admin/* routes (excluding /admin/login itself)
  matcher: ['/admin/((?!login).*)'],
};
