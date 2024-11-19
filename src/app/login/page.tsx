"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callback = searchParams.get('callback'); // Get callback from query params
  
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Login");
  const [buttonClass, setButtonClass] = useState(
    "mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50"
  );
  const [user, setUser] = useState({
    email: "",
    password: "",
  });


  const onLogin = async () => {
    try {
      setLoading(true);
      setButtonText("Logging in...");
      setButtonClass(
        "mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50"
      );
  
      const response = await axios.post("/api/admin/login", user);
      if (response.status === 200) {
        toast.success(`Logged in as ${response.data.username}`, {
          position: "top-right",
        });
  
        // Show a swal confirmation after login
        swal({
          title: "Success",
          text: `Welcome, ${response.data.username}!`,
          icon: "success",
          timer: 3000, // Close after 3 seconds
          buttons: undefined, // Disable buttons to ensure auto-close
        }).then(() => {
          // Redirect to callback URL or home after closing
          router.push(callback || "/");
        });
        
        
  
        // Redirect to callback URL or home
        router.push(callback || "/");
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
  
        if (status === 400) {
          setButtonText("Wrong Credentials");
  
          // Show a toast and swal for wrong credentials
          toast.error("Wrong Credentials!", {
            position: "top-right",
          });
          swal("Error", "Wrong credentials. Please try again.", "error");
  
          setButtonClass(
            "mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 disabled:opacity-50"
          );
        } else if (status === 403) {
          setButtonText("Account Locked!");
  
          // Show a toast and swal for account lock
          toast.error("Account locked!", {
            position: "top-right",
          });
          swal("Error", error.response.data.error, "error"); // Use the error message from the server
  
          setButtonClass(
            "mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 disabled:opacity-50"
          );
        } else {
          // Show a swal alert for a general error
          swal("Error", "Login failed. Please try again later.", "error");
        }
      } else {
        console.error("Login failed", error.message);
        swal("Error", "Login failed. Please try again later.", "error");
      }
    } finally {
      setLoading(false);
    }
  };
  

  const handleFocus = () => {
    if (buttonText === "Wrong Credentials") {
      setButtonText("Login");
      setButtonClass(
        "mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50"
      );
    }
  };

  return (
    <div>
      <Navbar />
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50 p-4">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Login
        </h1>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          onFocus={handleFocus}
          className="appearance-none mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50 text-black"
          placeholder="Enter your email"
        />
        <label htmlFor="password" className="block mt-4 text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          onFocus={handleFocus}
          className="appearance-none mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50 text-black"
          placeholder="Enter your password"
        />

        <button
          onClick={onLogin}
          disabled={loading}
          className={buttonClass}
        >
          {loading ? "Logging in..." : buttonText}
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="font-medium text-blue-500 hover:text-blue-600">
            Sign up here
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
    </div>
  );
}
