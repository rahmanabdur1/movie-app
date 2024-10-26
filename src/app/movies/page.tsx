// src/pages/watchlist.tsx
import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Watchlist</h1>
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {watchlist.map((movie) => (
            <div key={movie.id} className="p-4 border rounded">
              <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
              <h3 className="mt-2 text-lg font-semibold">{movie.title}</h3>
              <button onClick={() => removeFromWatchlist(movie.id)} className="p-2 bg-red-500 text-white rounded mt-2">
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No movies in your watchlist yet.</p>
      )}
    </div>
  );
}
