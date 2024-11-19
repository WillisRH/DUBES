import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/utils/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    await connectMongoDB();

    try {
        const users = await req.json();
        console.log(users)

        // Create an array of bulk operations
        const bulkOperations = users.map((user: { nisn: string; name: string; class: string; }) => ({
            updateOne: {
                filter: { nisn: user.nisn },
                update: { $set: { nisn: user.nisn, name: user.name, class: user.class } },
                upsert: true,
            }
        }));

        // Execute bulk operations
        await User.bulkWrite(bulkOperations);

        return NextResponse.json({ message: 'Data saved successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error saving data:', error);
        return NextResponse.json({ message: 'Failed to save data', error: 'Failed to save!' }, { status: 500 });
    }
}
