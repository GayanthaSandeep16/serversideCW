import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-4xl mb-8">Welcome to the API System</h1>
      <div className="space-x-4">
        <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </Link>
        <Link href="/register" className="bg-green-500 text-white px-4 py-2 rounded">
          Register
        </Link>
      </div>
    </div>
  );
}