"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [countryName, setCountryName] = useState("");
  const [countryData, setCountryData] = useState(null);
  const [selectedApiKey, setSelectedApiKey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      router.push("/login");
      return;
    }
    fetchApiKeys();
  }, [router]);

  const fetchApiKeys = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth/my-api-keys", {
        withCredentials: true,
      });
      // Filter to only include active keys for display
      const activeKeys = response.data.filter((key) => key.isActive);
      setApiKeys(activeKeys);
    } catch (err) {
      setError("Failed to fetch API keys: " + (err.response?.data?.error || err.message));
    }
  };

  const generateApiKey = async () => {
    try {
      await axios.post("http://localhost:3000/auth/generate-key", {}, {
        withCredentials: true,
      });
      fetchApiKeys();
    } catch (err) {
      setError("Failed to generate API key: " + (err.response?.data?.error || err.message));
    }
  };

  const revokeApiKey = async (id) => {
    try {
      await axios.post(`http://localhost:3000/auth/revoke-key/${id}`, {}, {
        withCredentials: true,
      });
      fetchApiKeys(); // This will re-fetch and filter out revoked keys
    } catch (err) {
      setError("Failed to revoke API key: " + (err.response?.data?.error || err.message));
    }
  };

  const fetchCountryData = async (e) => {
    e.preventDefault();
    if (!selectedApiKey) {
      setError("Please select an API key.");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/api/country/${countryName}`, {
        headers: { Authorization: selectedApiKey },
      });
      setCountryData(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch country data: " + (err.response?.data?.error || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">User Dashboard</h2>
        {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-6 text-center">{error}</p>}

        {/* API Key Management Section */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">API Key Management</h3>
          <button
            onClick={generateApiKey}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg mb-4 transition duration-300"
          >
            Generate New API Key
          </button>
          {apiKeys.length > 0 ? (
            <div className="mt-4">
              <h4 className="text-lg font-semibold text-gray-600 mb-2">Your API Keys:</h4>
              <ul className="space-y-2">
                {apiKeys.map((key) => (
                  <li
                    key={key.id}
                    className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <span className="text-gray-600 font-mono">{key.apiKey}</span>
                      <span
                        className={`ml-2 text-sm font-semibold ${
                          key.isActive ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {key.isActive ? "Active" : "Revoked"}
                      </span>
                    </div>
                    <div>
                      {/* Removed the Copy button */}
                      {key.isActive && (
                        <button
                          onClick={() => revokeApiKey(key.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-lg"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
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
          <select
            value={selectedApiKey}
            onChange={(e) => setSelectedApiKey(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an API Key</option>
            {apiKeys
              .filter((key) => key.isActive)
              .map((key) => (
                <option key={key.id} value={key.apiKey}>
                  {key.apiKey.substring(0, 8)}... (Last Used: {key.ApiKeyUsage?.lastUsed
                    ? new Date(key.ApiKeyUsage.lastUsed).toLocaleString()
                    : "Never"})
                </option>
              ))}
          </select>
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
            disabled={!selectedApiKey}
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
                <strong>Languages:</strong> {countryData.languages.join(", ")}
              </p>
            </div>
            <img
              src={countryData.flag}
              alt={`${countryData.name} flag`}
              className="mt-4 w-40 rounded-lg shadow-sm"
            />
          </div>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg mt-6"
        >
          Logout
        </button>
      </div>
    </div>
  );
}