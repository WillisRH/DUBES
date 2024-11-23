import connectMongoDB from "@/utils/mongodb";
import Admin from "@/models/Admin";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/utils/getDataFromToken";

connectMongoDB();

async function POST(request: NextRequest) {
  const tokenData = getDataFromToken(request);
    if (!tokenData) {
        // If there's no token, return an error response
        return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }


  try {
    const reqBody = await request.json();
    const { username, password } = reqBody;

    const user = await Admin.findOne({ username });

    if (user) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new Admin({
      username,
      email: `${username}@lapor.sman12`,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    return new Response(
      JSON.stringify({
        message: "User created successfully",
        success: true,
        savedUser,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export { POST };
