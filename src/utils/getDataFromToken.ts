// utils/getDataFromToken.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface DecodedToken {
    id: string; // Adjust this based on your token's payload structure
    // Add other fields here if needed
}

export const getDataFromToken = (requestOrToken: NextRequest | string): DecodedToken | null => {
    let token: string | undefined;

    if (typeof requestOrToken === "string") {
        token = requestOrToken;
    } else {
        // Try to get the token from cookies in the request
        token = requestOrToken.cookies.get("token")?.value || '';

        if (!token) {
            // Try to get token from Authorization header if cookies are not available
            const authHeader = requestOrToken.headers.get("Authorization");
            token = authHeader?.split(" ")[1] || ''; // Extract token from "Bearer <token>"
        }
    }

    if (!token) {
        return null; // If no token is found, return null
    }

    try {
        // Verify and decode the token using the secret key
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET || "defaultSecret") as DecodedToken;
        return decodedToken;
    } catch (error) {
        return null; // If token verification fails, return null
    }
};
    