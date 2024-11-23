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

            // Fetch user's postcards after getting user data
            // console.log(response.data.postcards)
        } catch (error: any) {
            console.error("Failed to get user details or postcards:", error.message);
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

    return (
        <div>
            <Navbar />
            <BackButton />
            <div className="flex flex-col items-center justify-center min-h-screen py-2 text-black">
                {/* <h1 className="text-4xl font-bold mb-4 text-gray-900 text-center mb-10">About {userData?.username}</h1> */}
                <ProfilePicture username={userData?.username || ""} />
                {userData ? (
                    <div className="bg-gray-200 p-4 rounded-lg shadow-md text-black mb-8">
                        <p className="text-2xl text-center mb-4">{userData.username}</p>
                        <p className="text-lg">Email: {userData.email}</p>
                        <p className="text-lg">Username: {userData.username}</p>
                        <p className="text-lg">ID: {userData._id}</p>
                        <button 
                    onClick={logout} 
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                    Logout
                </button>
                    </div>
                ) : (
                    <p className="text-lg text-gray-800 flex items-center justify-center min-h-screen">
  Loading...
</p>

                )}
                {/* Logout Button */}
                <div className="mt-4 grid grid-cols-2 gap-4 items-center">
    <div className="w-full"> {/* Removed the fixed width, as grid controls layout */}
        <button
            onClick={() => router.push('/list-siswa')}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
            List Siswa
        </button>
    </div>
    <div className="w-full">
        <button
            onClick={() => router.push('/list-admin')}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
            List Admin
        </button>
    </div>
    <div className="w-full">
        <button
            onClick={() => router.push('/signup')}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
            Signup
        </button>
    </div>
    <div className="w-full">
        <button
            onClick={() => router.push('/login')}
            className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
            Login
        </button>
    </div>
    <div className="w-full">
        <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
            Logout
        </button>
    </div>
</div>


            </div>
            
        </div>
    );
}
