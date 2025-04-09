"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Function to check authentication state
  const checkAuthState = () => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    setIsAuthenticated(!!userId);
    setIsAdmin(role === "admin");
  };

  useEffect(() => {
    // Initial check on mount
    checkAuthState();

    // Listen for route changes to re-check auth state
    const handleRouteChange = () => {
      checkAuthState();
    };

    // Subscribe to route change events
    router.events.on("routeChangeComplete", handleRouteChange);

    // Clean up the event listener on unmount
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]); // Depend on router.events to ensure the listener is set up correctly

  const handleLogout = async () => {
    try {
      await axios.post("http://backend:3000/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      setIsAuthenticated(false); // Update state immediately
      setIsAdmin(false); // Update state immediately
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="navbar">
      <div className="container mx-auto flex justify-between items-center">
        <div className="space-x-4">
          <Link href="/">Home</Link>
          {!isAuthenticated ? (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard">User Dashboard</Link>
              {isAdmin && <Link href="/admin/dashboard">Admin Dashboard</Link>}
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}