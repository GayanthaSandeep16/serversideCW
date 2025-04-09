"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      router.push('/login');
      return;
    }
    fetchApiKeys();
  }, [router]);

  const fetchApiKeys = async () => {
    try {
      const response = await axios.get('http://localhost:3000/admin/api-keys', {
        withCredentials: true,
      });
      setApiKeys(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to fetch API keys. Ensure you have admin privileges.'
      );
    }
  };

  const revokeApiKey = async (id) => {
    try {
      await axios.post(`http://localhost:3000/auth/revoke-key/${id}`, {}, {
        withCredentials: true,
      });
      fetchApiKeys(); // Refresh the list after revoking
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to revoke API key.'
      );
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout failed:', err);
    }
    localStorage.removeItem('userId');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
          <div className="space-x-3">
            <Link href="/dashboard" className="text-blue-500 hover:underline font-semibold">
              User Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
        {error && (
          <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-6 text-center">
            {error}
          </p>
        )}
        <ul className="space-y-4">
          {apiKeys.map((key) => (
            <li
              key={key.id}
              className="bg-gray-50 p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <p className="text-gray-700">
                  <strong>Email:</strong> {key.User?.email || 'Unknown'}
                </p>
                <p className="text-gray-700 font-mono">
                  <strong>API Key:</strong> {key.apiKey}
                </p>
                <p className="text-gray-700">
                  <strong>Status:</strong>{' '}
                  <span className={key.isActive ? 'text-green-500' : 'text-red-500'}>
                    {key.isActive ? 'Active' : 'Revoked'}
                  </span>
                </p>
                <p className="text-gray-700">
                  <strong>Usage Count:</strong> {key.ApiKeyUsage?.usageCount || 0}
                </p>
                <p className="text-gray-700">
                  <strong>Last Used:</strong>{' '}
                  {key.ApiKeyUsage?.lastUsed
                    ? new Date(key.ApiKeyUsage.lastUsed).toLocaleString()
                    : 'Never'}
                </p>
              </div>
              {key.isActive && (
                <button
                  onClick={() => revokeApiKey(key.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                  Revoke
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}