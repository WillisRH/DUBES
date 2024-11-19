"use client";

import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import logodubes from '@/components/logodubes.png';
import { getUserData } from '@/utils/getUserData';

interface ProfilePictureProps {
  username: string;
}

const ProfilePicture = React.memo(({ username }: ProfilePictureProps) => {
  const firstLetter = username.charAt(0).toUpperCase();
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600 text-lg">
      {firstLetter}
    </div>
  );
});



ProfilePicture.displayName = "ProfilePicture";

function Navbar() {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('cS') === 'true') {
      sessionStorage.removeItem('username');
    }
  }, []);

  // Fetch user data once and cache it
  useEffect(() => {
    const fetchUserData = async () => {
      const cachedUsername = sessionStorage.getItem('username');
      if (cachedUsername) {
        setUsername(cachedUsername); // Display cached username immediately
      }

      try {
        const user = await getUserData("username");
        if (user) {
          setUsername(user); // Update state with the fetched user
          sessionStorage.setItem('username', user); // Cache the username for future sessions
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []); // Run once on mount to fetch user data

  

  // Resize logic with debounce
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    handleResize(); // Initial check
    const resizeListener = () => handleResize();
    window.addEventListener('resize', resizeListener);

    return () => window.removeEventListener('resize', resizeListener);
  }, [handleResize]);

  // Conditional profile link and content
  const profileLink = username ? "/profile" : "/login";
  const profileContent = username ? (
    <ProfilePicture username={username} />
  ) : (
    <span>Login</span>
  );

  return (
    <nav className="bg-gray-800 text-white p-2 flex justify-between items-center">
      <Image src={logodubes} alt="Logo" width={50} height={50} className="ml-3" />
      <div className="absolute font-bold text-xl ml-20">
        <Link href="/">DUBES</Link>
      </div>
      <ul className="flex space-x-6 items-center mr-4">
        <li>
          <Link href={profileLink}>
            <div className="hover:bg-gray-700 p-2 rounded-full">
              {profileContent}
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
