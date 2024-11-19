// app/not-found.tsx
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const Custom404 = () => {
  return (
    <div>
        <Navbar />
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <div className="text-6xl mb-4">
        {/* Displaying the emoji */}
        <span role="img" aria-label="Crying face">ಥ_ಥ</span>
      </div>
      <div className="text-xl text-gray-800 mt-2">
        404 - NOT FOUND
      </div>
      {/* <Link href="/">
        <a className="mt-6 px-6 py-3 text-lg bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Go Back to Home
        </a>
      </Link> */}
    </div>
    </div>
  );
};

export default Custom404;
