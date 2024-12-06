"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";

// Define an interface for user data
interface UserData {
  _id: string;
  username: string;
  email: string;
}

// Define the props for the ProfilePicture component
interface ProfilePictureProps {
  username: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null); // Set type for userData

  const getUserDetails = async () => {
    try {
      const res = await axios.get('/api/admin/me');
      setUserData(res.data.data);
    } catch (error: any) {
      console.error("Failed to get user details:", error.message);
    }
  };

  const logout = async () => {
    try {
      await axios.get('/api/admin/logout');
      sessionStorage.removeItem('username');
      router.push('/login?cS=true');
    } catch (error: any) {
      console.error(error.message);
    }
  };

  function ProfilePicture({ username }: ProfilePictureProps) {
    if (!username) return null;

    const firstLetter = username.charAt(0).toUpperCase();
    return (
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-200 text-gray-600 text-4xl mb-4">
        {firstLetter}
      </div>
    );
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    if (userData) {
        document.title = `Profile [${userData?.username}]`;
    }
}, [userData]);

  return (
    <div>
      <Navbar />
      <BackButton />
      <div className="flex flex-col items-center justify-center min-h-screen py-2 text-black">
        <ProfilePicture username={userData?.username || ""} />
        {userData ? (
          <div className="bg-gray-200 p-4 rounded-lg shadow-md text-black mb-8">
            <p className="text-2xl text-center mb-4">{userData.username}</p>
            <p className="text-lg">Email: {userData.email}</p>
            <p className="text-lg">Username: {userData.username}</p>
            <p className="text-lg">ID: {userData._id}</p>
            <button 
              onClick={logout} 
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="text-lg text-gray-800 flex items-center justify-center min-h-screen">Loading...</p>
        )}

        {/* Button Section with Colorful Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-4 items-center">
          <div className="w-full">
            <button
              onClick={() => router.push('/list-siswa')}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105"
            >
              List Siswa
            </button>
          </div>
          <div className="w-full">
            <button
              onClick={() => router.push('/kesan-pesan/show')}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all transform hover:scale-105"
            >
              Kesan Pesan
            </button>
          </div>
          <div className="w-full">
            <button
              onClick={() => router.push('/list-admin')}
              className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all transform hover:scale-105"
            >
              List Admin
            </button>
          </div>
          <div className="w-full">
            <button
              onClick={() => router.push('/xlsx')}
              className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all transform hover:scale-105"
            >
              Import Student
            </button>
          </div>
          <div className="w-full">
            <button
              onClick={() => router.push('/signup')}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all transform hover:scale-105"
            >
              Signup
            </button>
          </div>
          <div className="w-full">
            <button
              onClick={() => router.push('/login')}
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all transform hover:scale-105"
            >
              Login
            </button>
          </div>
          <div className="w-full">
            <button
              onClick={logout}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
