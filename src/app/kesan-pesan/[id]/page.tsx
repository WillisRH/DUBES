"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Feedback {
  _id: string;
  name: string;
  message: string;
  rating: number;
}

export default function KesanPesanDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchFeedback = async () => {
      try {
        const response = await fetch(`/api/feedback?id=${id}`);
        const data = await response.json();

        if (data.error) {
          toast.error(data.error);
        } else {
          setFeedback(data);
        }
      } catch (error) {
        toast.error("Failed to fetch feedback");
      }
    };

    fetchFeedback();
  }, [id]);

  useEffect(() => {
    if (feedback) {
        document.title = `${feedback?.name}'s Feedback`;
    }
}, [feedback]);

  if (!feedback) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <BackButton />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8 p-4">
        <div className="bg-white p-8 rounded-md shadow-md w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-black">
            Feedback from {feedback.name}
          </h2>
          {/* Display stars */}
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={32}
                className={
                  i < feedback.rating ? "text-yellow-500" : "text-gray-400"
                }
              />
            ))}
          </div>
          {/* Display message */}
          <div className="text-left text-black mb-4">
            <p>
              <strong>Message:</strong>
              <br />
              {feedback.message}
            </p>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
