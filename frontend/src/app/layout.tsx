import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"; // Import the Navbar component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Navbar at the top */}
        <Navbar />

        {/* Main content area, takes up remaining space */}
        <main className="flex-grow container mx-auto ">
          {children}
        </main>

        {/* Footer at the bottom */}
        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto px-4 text-center">
            <p>
              &copy; Country API System. Created by Gayantha Sandeep for
              server Coursework 1.
            </p>
            <p className="mt-2">
              <a
                href="https://restcountries.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-300"
              >
                Powered by RestCountries API
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}