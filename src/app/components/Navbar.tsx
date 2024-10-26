// src/app/components/Navbar.tsx
"use client"; // Enable client component features

import React from 'react';
import Link from 'next/link'; // Make sure to import Link from Next.js
import { useWatchlist } from '@/app/context/WatchlistContext'; // Import your context provider

export default function Navbar() {
  const { watchlist } = useWatchlist(); // Access watchlist from context

  return (
    <nav className="p-4 flex justify-between items-center bg-gray-800 text-white">
      <Link href="/" className="text-2xl font-bold">Movie App</Link>
      
      <Link href="/watchlist" className="relative">
        <span className="text-lg">Cart</span>
        {watchlist.length > 0 && (
          <span className="absolute top-[-3px] right-0 text-white bg-red-500  text-[11px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {watchlist.length}
          </span>
        )}
      </Link>
    </nav>
  );
}
