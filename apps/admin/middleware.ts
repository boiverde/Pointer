
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get token from cookies
    const token = request.cookies.get('admin_access_token');
    const isLoginPage = request.nextUrl.pathname === '/login';

    // If trying to access protected route without token
    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If strictly already logged in and trying to access login, send to home
    if (token && isLoginPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
