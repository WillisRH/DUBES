
import Admin from "@/models/Admin";
import { getDataFromToken } from "@/utils/getDataFromToken";
import connectMongoDB from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";

connectMongoDB();

export async function GET(req: NextRequest) {
    const tokenData = getDataFromToken(req);
    if (!tokenData) {
        // If there's no token, return an error response
        return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('userId');
  console.log(id)

  try {
    if (id) {
      // Fetch user by ID
      const user = await Admin.findById(id);
      if (!user) {
        return new Response(JSON.stringify({ error: 'Admin not found' }), { status: 404 });
      }
      return new Response(JSON.stringify({ user }), { status: 200 });
    } else {
      // Fetch all users
      const users = await Admin.find({});
      return new Response(JSON.stringify({ users }), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch Admin user' }), { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
    const tokenData = getDataFromToken(req);
    if (!tokenData) {
        // If there's no token, return an error response
        return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    try {
      const { id } = await req.json();
  
      const user = await Admin.findByIdAndDelete(id);
  
      if (!user) {
        return new Response(JSON.stringify({ error: 'Admin not found' }), { status: 404 });
      }
  
      return new Response(JSON.stringify({ message: 'Admin deleted successfully' }), { status: 200 });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }