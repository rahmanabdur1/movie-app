// src/components/MovieCard.tsx

import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { Movie } from '@/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link component

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
      {/* Link to the movie details page */}
      <Link href={`/movie/${movie.id}`}>
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
        <h2>{movie.title}</h2>
      </Link>
      <button onClick={handleWatchlistToggle}>
        {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
      </button>
    </div>
  );
};

export default MovieCard;
