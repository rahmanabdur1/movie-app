"use client";

import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { Movie } from '@/types';
import Image from 'next/image';

const Watchlist: React.FC = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl sm:text-3xl mb-4 font-bold">My Watchlist</h1>
      {watchlist.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        <ul className="flex flex-col items-center sm:items-start sm:flex-row sm:flex-wrap justify-center gap-4">
          {watchlist.map((movie: Movie) => (
            <li
              key={movie.id}
              className="flex flex-col sm:flex-row items-center mb-4 p-4 w-full sm:w-[48%] md:w-[30%] lg:w-[22%] border rounded shadow"
            >
              <Image
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                 width={80}
                className="object-cover"
                height={100}

              />

              <div className="text-center sm:text-left">
                <h2 className="mt-2 text-[14px] font-semibold sm:text-sm p-1 sm:p-2">{movie.title}</h2>
                <button
                  onClick={() => removeFromWatchlist(movie.id)}
                  className="mt-2 text-[14px] font-semibold sm:text-sm p-1 sm:p-2 text-red-600"
                >
                  Remove Watchlist
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
