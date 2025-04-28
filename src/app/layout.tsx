import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import LoginButton from "../components/LoginButton";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Liverpool SEN Schools Directory",
  description: "Directory of Special Educational Needs schools in Liverpool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row justify-between items-center">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <Link href="/" className="inline-block">
                  <h1 className="text-3xl font-bold mb-2 hover:text-blue-100 transition-colors">
                    Liverpool SEN Schools
                  </h1>
                </Link>
                <p className="text-blue-100">Directory of Special Educational Needs schools in Liverpool</p>
              </div>
              <div className="self-center">
                <LoginButton />
              </div>
            </div>
          </header>
          
          <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 animate-fade-in">
            {children}
          </main>
          
          <footer className="bg-gray-800 text-white py-10 mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-300">Liverpool SEN Schools</h3>
                  <p className="text-gray-300 text-sm">
                    A comprehensive directory of Special Educational Needs schools in the Liverpool area.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-300">Quick Links</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                    <li><a href="https://www.liverpool.gov.uk/schools-and-learning/special-educational-needs/" className="text-gray-300 hover:text-white transition-colors">Liverpool Council SEN</a></li>
                    <li><a href="https://www.gov.uk/children-with-special-educational-needs" className="text-gray-300 hover:text-white transition-colors">UK Government SEN Resources</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-300">Contact</h3>
                  <p className="text-gray-300 text-sm">
                    For information about SEN services in Liverpool, please contact Liverpool City Council.
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
                <p>&copy; {new Date().getFullYear()} Liverpool SEN Schools Directory. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
