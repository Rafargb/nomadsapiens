import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Protect Admin Routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
        if (!session) {
            // Redirect to login if not authenticated
            return NextResponse.redirect(new URL('/', req.url));
        }

        // Optional: Check for specific admin email claim
        // This is a basic check. In production, use Custom Claims or a separate table.
        const userEmail = session.user.email;
        const isAdmin = userEmail?.includes('admin') || userEmail === 'rafaelbarbosa85rd@gmail.com';

        if (!isAdmin) {
            // Redirect unauthorized users to home
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return res;
}

export const config = {
    matcher: ['/admin/:path*'],
};
