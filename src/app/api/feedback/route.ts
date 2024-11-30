import { NextRequest, NextResponse } from "next/server";
import Feedback from "@/models/Feedback";
import connectMongoDB from "@/utils/mongodb";
import { getDataFromToken } from "@/utils/getDataFromToken";
import mongoose, { ObjectId } from "mongoose";


export async function POST(req: Request) {
  try {
    await connectMongoDB();

    const { name = "Anonymous", message, rating } = await req.json();

    if (!message || !rating) {
      return NextResponse.json(
        { error: "Message and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const feedback = new Feedback({ name, message, rating });
    const savedFeedback = await feedback.save();

    return NextResponse.json(savedFeedback, { status: 201 });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}



export async function GET(req: NextRequest) {
    await connectMongoDB(); // Connect to MongoDB
  
    // Check for the token in the request
    const tokenData = getDataFromToken(req);
    if (!tokenData) {
      // If there's no token, return an error response
      return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
    }
  
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Get the `id` query parameter
  
    try {
      // If the `id` query parameter is provided, fetch a specific feedback by id
      if (id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
        }
  
        const feedback = await Feedback.findById(id);
  
        if (!feedback) {
          return NextResponse.json({ message: "Feedback not found" }, { status: 404 });
        }
  
        return NextResponse.json(feedback); // Return the specific feedback
      }
  
      // If no `id` query parameter, fetch all feedbacks
      const feedbacks = await Feedback.find();
  
      return NextResponse.json(feedbacks, { status: 200 }); // Return all feedbacks
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      return NextResponse.json({ message: "Failed to fetch feedbacks" }, { status: 500 });
    }
  }