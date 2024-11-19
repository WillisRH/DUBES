// src/logout.js

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    try {
        // Clear the token cookie by setting it with an expired date
        cookies().set('token', '', { path: '/', expires: new Date(0) });

        const response = NextResponse.json({
            message: "Logout successful",
            success: true,
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
