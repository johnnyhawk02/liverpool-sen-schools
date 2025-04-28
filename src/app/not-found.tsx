import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">404 - Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        The page you were looking for doesn't exist or you may have mistyped the address.
      </p>
      <Link
        href="/"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
      >
        Go back to homepage
      </Link>
    </div>
  );
} 