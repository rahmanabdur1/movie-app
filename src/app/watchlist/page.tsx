// src/app/watchlist/page.tsx
"use client"; // Make this component a Client Component

import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { Movie } from '@/types';

const Watchlist: React.FC = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">My Watchlist</h1>
      {watchlist.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        <ul>
          {watchlist.map((movie: Movie) => (
            <li key={movie.id} className="flex items-center mb-4">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-16 h-24 mr-2"
              />
              <div>
                <h2 className="text-xl">{movie.title}</h2>
                <button
                  onClick={() => removeFromWatchlist(movie.id)}
                  className="mt-2 p-1 bg-red-500 text-white rounded"
                >
                  Remove from Watchlist
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Watchlist;
