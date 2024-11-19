import connectMongoDB from "@/utils/mongodb";
import Admin from "@/models/Admin";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

connectMongoDB();

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 3 * 60 * 1000; // 3 minutes

interface LoginAttempt {
    attempts: number;
    lockUntil: number | null;
  }
  
  // Define `loginAttempts` with the proper type
  const loginAttempts: { [email: string]: LoginAttempt } = {};

async function POST(request: NextRequest) {
  try {
    const { TOKEN_SECRET } = process.env;

    if (!TOKEN_SECRET) {
      throw new Error("TOKEN_SECRET environment variable is not defined.");
    }

    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Check login attempts and lock status
    const userAttempts = loginAttempts[email] || { attempts: 0, lockUntil: null };
    if (userAttempts.lockUntil && userAttempts.lockUntil > Date.now()) {
      const timeLeft = Math.ceil((userAttempts.lockUntil - Date.now()) / 1000 / 60);
      console.log(`Account locked. Try again in ${timeLeft} minutes.`)
      return new NextResponse(
        JSON.stringify({ error: `Account locked. Try again in ${timeLeft} minutes.` }),
        { status: 403 }
      );
    }

    const user = await Admin.findOne({ email });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User does not exist" }), { status: 400 });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      userAttempts.attempts += 1;
      if (userAttempts.attempts >= MAX_ATTEMPTS) {
        userAttempts.lockUntil = Date.now() + LOCK_TIME;
      }
      loginAttempts[email] = userAttempts;
      console.log(`Invalid auth attempt. User: ${email}`)
      return new NextResponse(JSON.stringify({ error: "Invalid password" }), { status: 400 });
    }

    // Reset attempts on successful login
    loginAttempts[email] = { attempts: 0, lockUntil: null };

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    const token = await jwt.sign(tokenData, TOKEN_SECRET, { expiresIn: "1d" });

    const response = new NextResponse(
      JSON.stringify({
        message: "Login successful",
        username: user.username,
        success: true
      })
    );

    response.cookies.set("token", token, { httpOnly: false });

    return response;

  } catch (error: any) {
    console.log(error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export { POST };
