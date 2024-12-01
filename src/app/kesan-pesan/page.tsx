"use client";

import BackButton from "@/components/BackButton";
import Navbar from "@/components/Navbar";
import { useState, useEffect, FormEvent } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaStar } from "react-icons/fa";
import Cookies from "js-cookie";

interface Feedback {
  name: string;
  message: string;
  rating: number;
}

export default function KesanPesan() {
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [submittedFeedback, setSubmittedFeedback] = useState<Feedback | null>(
    null
  );

  useEffect(() => {
    const storedFeedback = Cookies.get("feedback_submission");
    if (storedFeedback) {
      setSubmittedFeedback(JSON.parse(storedFeedback));
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const submission = {
      name: name || "Anonymous",
      message,
      rating,
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      if (!res.ok) throw new Error("Failed to save feedback");

      const data = await res.json();
      Cookies.set("feedback_submission", JSON.stringify(data), { expires: 7 }); // Save to cookies for 7 days
      setSubmittedFeedback(data); // Update state with submitted feedback
      toast.success("Feedback submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit feedback!");
    }
  };

  if (submittedFeedback) {
    // Show the feedback if the user already submitted
    return (
      <div>
        <Navbar />
        <BackButton />
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
          <div className="bg-white p-8 rounded-md shadow-md w-full max-w-lg text-center">
            <h2 className="text-2xl font-bold mb-6 text-black">
              Terimakasih atas masukan dan saran-nya!
            </h2>
            <div className="text-black">
              <div className="flex justify-center mb-4">
                {/* Render stars */}
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={40} // Larger star size
                    className={
                      i < submittedFeedback.rating
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }
                  />
                ))}
              </div>
              <p className="text-2xl font-bold">
                 {submittedFeedback.name}
              </p>
              <p className="text-xl">
                 {submittedFeedback.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  

  // Show the form if no feedback has been submitted
  return (
    <div>
      <Navbar />
      <BackButton />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-md shadow-md w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-black">
            Apa pesan dan kesan anda selaku pengguna website ini?
          </h2>
          <hr className="mb-6" />
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-black font-bold mb-2"
              >
                Name (Optional):
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                style={{ color: "black" }}
              />
            </div>

            {/* Star Rating */}
            <div className="mb-6">
              <label className="block text-black font-bold mb-2">Rating:</label>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={32}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer ${
                      rating >= star ? "text-yellow-500" : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Message Field */}
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-black font-bold mb-2"
              >
                Message:
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                required
                style={{ color: "black" }}
              />
            </div>

            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Submit
            </button>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
