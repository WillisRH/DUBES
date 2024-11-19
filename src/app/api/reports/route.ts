import { NextRequest, NextResponse } from 'next/server';
import Report from '@/models/Report';
import connectMongoDB from '@/utils/mongodb';
import { getDataFromToken } from '@/utils/getDataFromToken';

export async function GET(req: NextRequest) {
    await connectMongoDB();

    const tokenData = getDataFromToken(req);
    if (!tokenData) {
        // If there's no token, return an error response
        return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const nisn = searchParams.get('nisn');

    try {
        const reports = nisn ? await Report.find({ nisn }) : await Report.find();

        // If searching for a specific `nisn` and no data was found
        if (nisn && reports.length === 0) {
            return NextResponse.json({ message: 'No reports found' }, { status: 404 });
        }

        return NextResponse.json(reports, { status: 200 });
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({ message: 'Failed to fetch reports' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    await connectMongoDB();

    const tokenData = getDataFromToken(req);
    if (!tokenData) {
        return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { _id } = body;

        if (!_id) {
            return NextResponse.json({ message: 'Missing report ID (_id)' }, { status: 400 });
        }

        const deletedReport = await Report.findByIdAndDelete(_id);

        if (!deletedReport) {
            return NextResponse.json({ message: 'Report not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Report deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting report:', error);
        return NextResponse.json({ message: 'Failed to delete report' }, { status: 500 });
    }
}
