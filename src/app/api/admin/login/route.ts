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

const loginAttempts: { [email: string]: LoginAttempt } = {};

async function POST(request: NextRequest) {
  try {
    const { TOKEN_SECRET, NEXT_PUBLIC_DEFAULT_EMAIL, NEXT_PUBLIC_DEFAULT_USERNAME, NEXT_PUBLIC_DEFAULT_PASSWORD } = process.env;

    // Ensure all necessary environment variables are set
    if (!TOKEN_SECRET) {
      throw new Error("TOKEN_SECRET environment variable is not defined.");
    }
    if (!NEXT_PUBLIC_DEFAULT_EMAIL || !NEXT_PUBLIC_DEFAULT_USERNAME || !NEXT_PUBLIC_DEFAULT_PASSWORD) {
      throw new Error("Default credentials are missing in environment variables.");
    }

    // Set default credentials from environment variables
    const defaultEmail = NEXT_PUBLIC_DEFAULT_EMAIL;
    const defaultUsername = NEXT_PUBLIC_DEFAULT_USERNAME;
    const defaultPassword = NEXT_PUBLIC_DEFAULT_PASSWORD;

    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Check login attempts and lock status
    const userAttempts = loginAttempts[email] || { attempts: 0, lockUntil: null };
    if (userAttempts.lockUntil && userAttempts.lockUntil > Date.now()) {
      const timeLeft = Math.ceil((userAttempts.lockUntil - Date.now()) / 1000 / 60);
      console.log(`Account locked. Try again in ${timeLeft} minutes.`);
      return new NextResponse(
        JSON.stringify({ error: `Account locked. Try again in ${timeLeft} minutes.` }),
        { status: 403 }
      );
    }

    // Check if user exists
    let user = await Admin.findOne({ email });
    let userExists = await Admin.countDocuments();
    // If user does not exist, create a default user
    if (!userExists) {
      const hashedPassword = await bcryptjs.hash(defaultPassword, 10);
      user = new Admin({
        email: defaultEmail,
        username: defaultUsername,
        password: hashedPassword,
      });
      await user.save();
      console.log(`Default user created: ${defaultEmail}`);
    }

    // Check password
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      userAttempts.attempts += 1;
      if (userAttempts.attempts >= MAX_ATTEMPTS) {
        userAttempts.lockUntil = Date.now() + LOCK_TIME;
      }
      loginAttempts[email] = userAttempts;
      console.log(`Invalid auth attempt. User: ${email}`);
      return new NextResponse(JSON.stringify({ error: "Invalid password" }), { status: 400 });
    }

    // Reset attempts on successful login
    loginAttempts[email] = { attempts: 0, lockUntil: null };

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = await jwt.sign(tokenData, TOKEN_SECRET, { expiresIn: "1d" });

    const response = new NextResponse(
      JSON.stringify({
        message: "Login successful",
        username: user.username,
        success: true,
      })
    );

    response.cookies.set("token", token, { httpOnly: false });

    return response;
  } catch (error: any) {
    // console.log(error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export { POST };
