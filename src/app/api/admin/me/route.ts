"use server"
import { getDataFromToken } from "@/utils/getDataFromToken";
import connectMongoDB from "@/utils/mongodb";
import Admin from "@/models/Admin";
import { NextRequest, NextResponse } from "next/server";

// Ensure that the MongoDB connection is established
connectMongoDB();

export async function GET(request: NextRequest) {
    try {
        // Extract token data from the authentication token or directly from the request headers
        let tokenData = getDataFromToken(request);

        if (!tokenData) {
            const authHeader = request.headers.get("Authorization");
            const token = authHeader?.split(" ")[1]; // Get the token from "Bearer <token>"

            if (!token) {
                return NextResponse.json({ error: "Token not provided" }, { status: 401 });
            }

            // Attempt to extract token data using the token
            tokenData = getDataFromToken(token);
        }

        // Find the user in the database based on the user ID
        const user = await Admin.findOne({ _id: tokenData?.id }).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "User found",
            data: user
        });
    } catch (error: any) {
        // console.error("Error:", error.message); // Debug log
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
