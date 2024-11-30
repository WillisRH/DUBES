"use client";

import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { useRouter } from "next/navigation";

interface Feedback {
  _id: string;
  name: string;
  message: string;
  rating: number;
}

export default function AllFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0); // State to store average rating
  const router = useRouter();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const response = await fetch("/api/feedback");
      const data = await response.json();
      setFeedbacks(data);

      // Calculate the average rating
      if (data.length > 0) {
        const totalRating = data.reduce((acc: number, feedback: Feedback) => acc + feedback.rating, 0);
        setAverageRating(totalRating / data.length); // Set the average rating
      }
    };

    fetchFeedbacks();
  }, []);

  const handleCardClick = (id: string) => {
    router.push(`/kesan-pesan/${id}`);
  };

  return (
    <div>
      <Navbar />
      <BackButton />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
        <h1 className="text-3xl font-bold mb-8 text-black mt-4">All Feedbacks</h1>

        {/* Display the average rating */}
        <div className="mb-6 text-xl font-semibold text-black">
          <h1 className="text-s">Overall Rating</h1>
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={24}
                className={i < Math.round(averageRating) ? "text-yellow-500" : "text-gray-400"}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl px-4">
          {feedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="bg-white p-6 rounded-lg shadow-lg w-full h-auto cursor-pointer"
              onClick={() => handleCardClick(feedback._id)}
            >
              <h3 className="text-xl font-semibold text-black mb-2">{feedback.name}</h3>
              {/* Stars - Hide on small screens */}
              <div className="hidden sm:flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={24}
                    className={i < feedback.rating ? "text-yellow-500" : "text-gray-400"}
                  />
                ))}
              </div>
              {/* Truncated message */}
              <p className="text-black mb-2">
                {feedback.message.length > 100
                  ? feedback.message.slice(0, 100) + "..."
                  : feedback.message}
              </p>
              {/* Read more on click */}
              {feedback.message.length > 100 && (
                <span className="text-blue-500 cursor-pointer">Read More</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
