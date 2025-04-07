"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Check if there is a valid token or session stored
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    // If no token is found, redirect to the login page
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen text-white relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/19381.jpg')" }} // ✅ Background image
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* Top-Right Corner: Icon-only Logout with Tooltip */}
      <div className="absolute top-5 right-5 z-20 group">
        {/* ✅ Icon-only button */}
        <LogOut
          size={32}
          className="text-red-500 hover:text-red-700 transition-transform transform hover:scale-110 cursor-pointer"
          onClick={handleLogout}
        />

        {/* Tooltip */}
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900 text-white text-sm px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ fontFamily: "Rajdhani, sans-serif" }}>
          Logout
        </div>
      </div>

      {/* Centralized Content */}
      <motion.div
        className="relative z-20 text-center flex flex-col items-center space-y-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Title */}
        <p
          className="text-5xl mb-30"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            color: "white",
            textShadow: "0 0 15px rgba(255, 0, 0, 0.8)", // Stronger glow effect
          }}
        >
          UNLEASH THE CHAOS
        </p>

        {/* Stacked Text-Based Buttons */}
        <div className="flex flex-col items-center space-y-8 text-2xl">
          <Link href="/player-tournaments">
            <button
              className="text-red-500 hover:text-yellow-400 transition-colors"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              REVEAL BATTLES
            </button>
          </Link>

          
        </div>
      </motion.div>
    </div>
  );
}
