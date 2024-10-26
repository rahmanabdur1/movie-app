// src/components/MovieCard.tsx

import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { Movie } from '@/types';
import { useRouter } from 'next/navigation'; // Import the router hook

type MovieCardProps = {
  movie: Movie;
};

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const router = useRouter();
  const isInWatchlist = watchlist.some((item) => item.id === movie.id);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
      router.push('/watchlist'); // Navigate to watchlist after adding
    }
  };

  return (
    <div className="movie-card">
      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      <h2>{movie.title}</h2>
      <button onClick={handleWatchlistToggle}>
      Add to Watchlist
      </button>
    </div>
  );
};

export default MovieCard;
