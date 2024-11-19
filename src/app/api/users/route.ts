import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import connectMongoDB from '@/utils/mongodb';
import { getDataFromToken } from '@/utils/getDataFromToken';  // Import the function to extract token data

export async function GET(req: NextRequest) {
    // Check if the token exists in the request
    const tokenData = getDataFromToken(req);
    if (!tokenData) {
        // If there's no token, return an error response
        return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // Proceed with database operation if token exists
    await connectMongoDB();

    try {
        const users = await User.find({}, { __v: 0 }); // Exclude _id and __v from the response
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        // console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
    }
}
