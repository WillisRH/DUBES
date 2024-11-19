"use client";

import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="absolute mt-2 ml-2 bg-gray-100 text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-all p-4"
    >
      ← Back
    </button>
  );
};

export default BackButton;
