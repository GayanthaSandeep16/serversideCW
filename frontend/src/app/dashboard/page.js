"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [countryName, setCountryName] = useState('');
  const [countryData, setCountryData] = useState(null);
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
      const response = await axios.get('http://localhost:3000/auth/api-key', {
        withCredentials: true, // Include cookies in the request
      });
      setApiKeys(response.data);
    } catch (err) {
      setError('Failed to fetch API keys: ' + (err.response?.data?.error || err.message));
    }
  };

  const generateApiKey = async () => {
    try {
      await axios.post('http://localhost:3000/auth/api-key', {}, {
        withCredentials: true, // Include cookies in the request
      });
      fetchApiKeys();
    } catch (err) {
      setError('Failed to generate API key: ' + (err.response?.data?.error || err.message));
    }
  };

  const fetchCountryData = async (e) => {
    e.preventDefault();
    if (!apiKeys.length) {
      setError('Generate an API key first.');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/api/country/${countryName}`, {
        headers: { Authorization: apiKeys[0].apiKey },
      });
      setCountryData(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch country data: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">User Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Logout
          </button>
        </div>
        {error && (
          <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-6 text-center">{error}</p>
        )}

        {/* API Key Section */}
        <div className="mb-8">
          <button
            onClick={generateApiKey}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Generate API Key
          </button>
          {apiKeys.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Your API Keys:</h3>
              <ul className="space-y-2">
                {apiKeys.map((key) => (
                  <li
                    key={key.id}
                    className="bg-gray-50 p-3 rounded-lg shadow-sm flex justify-between items-center"
                  >
                    <span className="text-gray-600 font-mono">{key.apiKey}</span>
                    <span
                      className={`text-sm font-semibold ${
                        key.isActive ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {key.isActive ? 'Active' : 'Revoked'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-gray-500">No API keys generated yet.</p>
          )}
        </div>

        {/* Country Data Fetch Section */}
        <form onSubmit={fetchCountryData} className="mb-8 flex items-center space-x-3">
          <input
            type="text"
            placeholder="Enter country name (e.g., France)"
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
            className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            Fetch Country Data
          </button>
        </form>

        {/* Country Data Display */}
        {countryData && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{countryData.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong>Currency:</strong> {countryData.currency.name} ({countryData.currency.symbol})
              </p>
              <p className="text-gray-700">
                <strong>Capital:</strong> {countryData.capital}
              </p>
              <p className="text-gray-700">
                <strong>Languages:</strong> {countryData.languages.join(', ')}
              </p>
            </div>
            <img
              src={countryData.flag}
              alt={`${countryData.name} flag`}
              className="mt-4 w-40 rounded-lg shadow-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}