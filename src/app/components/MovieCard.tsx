import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { Movie } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

type MovieCardProps = {
  movie: Movie;
};

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const isInWatchlist = watchlist.some((item) => item.id === movie.id);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div className="movie-card flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4 transition duration-300 hover:shadow-xl">
      <Link href={`/movie/${movie.id}`}>
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          width={200}
          height={200}
          className="object-cover rounded-lg"
        />
        <h2 className="mt-2 text-center font-semibold text-lg">{movie.title}</h2>
      </Link>
      <button
        onClick={handleWatchlistToggle}
        className={`mt-2 px-4 py-2 rounded transition duration-300 
          ${isInWatchlist ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-black'} 
          text-white shadow-md`}
      >
        {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
      </button>
    </div>
  );
};

export default MovieCard;
