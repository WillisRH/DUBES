import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/utils/mongodb';
import Report from '@/models/Report';
import User from '@/models/User'; // Import the User model
interface IUser extends Document {
    nisn: string;
    name: string;
}
// POST Method: Save report data
export async function POST(req: NextRequest) {
    await connectMongoDB();

    try {
        const { 
            name,
            physicalPercentage, 
            mentalPercentage, 
            bodyScore, 
            physicalSymptoms, 
            mentalSymptoms ,
            answers,
            suggestion,
            city
        } = await req.json();

        // Fetch user by name
        const user = await User.findOne({ name }) as IUser | null;

        if (!user) {
            return NextResponse.json({ message: 'User not found', error: 'User with the provided name does not exist!' }, { status: 404 });
        }

        const { nisn } = user; // Extract NISN from the found user

        // Create the new report
        const newReport = new Report({
            name,
            nisn,
            physicalPercentage,
            mentalPercentage,
            bodyScore,
            physicalSymptoms,
            mentalSymptoms,
            answers,
            suggestion,
            city,
            createdAt: new Date(),
        });

        // Save the new report
        await newReport.save();

        return NextResponse.json({ message: 'Data saved successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error saving data:', error);
        return NextResponse.json({ message: 'Failed to save data', error: 'Failed to save!' }, { status: 500 });
    }
}

// GET Method: Retrieve all reports
export async function GET(req: NextRequest) {
    await connectMongoDB();

    try {
        const reports = await Report.find(); // Fetch all reports
        return NextResponse.json(reports, { status: 200 });
    } catch (error) {
        console.error('Error retrieving data:', error);
        return NextResponse.json({ message: 'Failed to retrieve data', error: 'Failed to retrieve!' }, { status: 500 });
    }
}


export async function PUT(req: NextRequest) {
    await connectMongoDB();

    try {
        const { id, handled } = await req.json();
        await Report.findByIdAndUpdate(id, { handled });
        
        return NextResponse.json({ message: 'Report updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating report:', error);
        return NextResponse.json({ message: 'Failed to update report', error: 'Failed to update!' }, { status: 500 });
    }
}