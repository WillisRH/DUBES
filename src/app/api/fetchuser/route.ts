// /api/fetchuser/route.ts
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import connectMongoDB from '@/utils/mongodb';
import { getDataFromToken } from '@/utils/getDataFromToken';

export async function GET(req: NextRequest) {
    try {
        const tokenData = getDataFromToken(req);  // Assuming this returns token data
        const url = new URL(req.url);
        const nisnParam = url.searchParams.get('nisn');  // Get nisn from query parameters

        await connectMongoDB();

        if (tokenData) {
            // If token data exists, return users based on nisn condition
            if (nisnParam === 'true') {
                const users = await User.find({});  // Fetch all users including nisn
                return NextResponse.json({ users }, { status: 200 });
            }

            if (nisnParam && !isNaN(Number(nisnParam))) {
                const user = await User.findOne({ nisn: nisnParam });  // Fetch specific user based on nisn
                if (user) {
                    return NextResponse.json({ user }, { status: 200 });
                } else {
                    return NextResponse.json({ error: 'User not found' }, { status: 404 });
                }
            }

            // If nisn is not provided, return users with only their names
            const users = await User.find({}, 'name');
            return NextResponse.json({ users }, { status: 200 });
        } else {
            // If no token data, just return the names
            const users = await User.find({}, 'name');
            return NextResponse.json({ users }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }
}
