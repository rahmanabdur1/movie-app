// src/app/movies/[id].tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWatchlist } from '../context/WatchlistContext';
import { MovieSchema } from '../validation/movieValidation';

interface MovieDetailsProps {
  id: string;
}

export default function MovieDetails({ id }: MovieDetailsProps) {
  const { addToWatchlist } = useWatchlist();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=YOUR_API_KEY`);
      const data = await response.json();

      const validationResult = MovieSchema.safeParse(data);
      if (validationResult.success) {
        setMovie(validationResult.data);
      } else {
        console.error(validationResult.error);
      }
      setLoading(false);
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>Movie not found</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{movie.title}</h1>
      <img 
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} 
        alt={movie.title} 
        className="my-4 rounded"
      />
      <p>{movie.overview}</p>
      <button 
        onClick={() => addToWatchlist(movie)} 
        className="px-4 py-2 bg-green-500 text-white rounded">
        Add to Watchlist
      </button>
    </div>
  );
}
