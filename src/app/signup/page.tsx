"use client"; // Ensure this is still marked as a client-side component
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "@/components/Navbar";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const onSignup = async () => {
    try {
      const response = await axios.post("/api/admin/signup", {
        ...user,
        email: `${user.username}@lapor.com`,
      });
      toast.success(`Signup an account as ${user.username}`, {
        position: "top-right",
      });
      router.push("/login");
    } catch (error) {
      // console.log("Signup failed", error.message);
      toast.error(`Error occured when trying to make an account!`, {
        position: "top-right",
      });
    }
  };

  const handleUsernameChange = (e: any) => {
    const inputChar = e.target.value.slice(-1);
    if (inputChar.match(/[a-zA-Z0-9-_]/)) {
      setUser({ ...user, username: e.target.value });
    }
  };
  

  return (
    <div>
      <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 p-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign up for an account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={user.username}
                onChange={handleUsernameChange} // Updated onChange handler
                placeholder="Username"
              />
            </div>
            <div>
               <label htmlFor="password" className="sr-only">password</label>
               <input
                  id="password"
                  type="password" 
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  placeholder="Password"
                />
            </div>
          </div>

          <div>
            <button
              onClick={onSignup}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>

          <div className="text-sm text-center text-gray-900">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-500 hover:text-indigo-600">
              Visit login page
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
    </div>
  );
}
