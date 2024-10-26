"use client"
import Recommendations from '@/app/components/Recommendations';
import { CreditsSchema, MovieSchema, RecommendationsSchema } from '@/app/schemas';
import Image from 'next/image';
import React from 'react';
import { z } from 'zod';
import { Movie, Recommendations as RecommendationsType } from '@/types';
import { useWatchlist } from '@/app/context/WatchlistContext';

const fetchMovieDetails = async (id: string): Promise<Movie> => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
  const data = await res.json();
  return MovieSchema.parse(data);
};

const fetchCredits = async (id: string) => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
  const data = await res.json();
  return CreditsSchema.parse(data);
};

const fetchRecommendations = async (id: string): Promise<RecommendationsType> => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
  const data = await res.json();
  return RecommendationsSchema.parse(data);
};

export default function MovieDetails({ params }: { params: Promise<{ id: string }> }) {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [error, setError] = React.useState<string | null>(null);
  const [movie, setMovie] = React.useState<Movie | null>(null);
  const [credits, setCredits] = React.useState<any>(null);
  const [recommendations, setRecommendations] = React.useState<RecommendationsType | null>(null);
  const [loadingRecommendations, setLoadingRecommendations] = React.useState(true);
  const [isInWatchlist, setIsInWatchlist] = React.useState(false);

  React.useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { id } = await params;

        const movieData = await fetchMovieDetails(id);
        setMovie(movieData);

        const creditsData = await fetchCredits(id);
        setCredits(creditsData);

        const recommendationsData = await fetchRecommendations(id);
        setRecommendations(recommendationsData);
        setLoadingRecommendations(false);

        setIsInWatchlist(watchlist.some((item) => item.id === movieData.id));
      } catch (err) {
        if (err instanceof z.ZodError) {
          setError('Failed to validate movie data. Please try again later.');
        } else {
          setError('An error occurred while fetching movie data. Please try again later.');
        }
      }
    };

    fetchDetails();
  }, [params, watchlist]);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      removeFromWatchlist(movie?.id!);
      setIsInWatchlist(false);
    } else {
      if (movie) {
        addToWatchlist(movie);
        setIsInWatchlist(true);
      }
    }
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!movie || !credits) return (
    <p className="mt-2 text-center text-[13px] font-medium text-white text-shadow-custom"
      style={{ fontFamily: 'var(--font-geist-mono), monospace, sans-serif' }}>Loading...</p>
  );

  // Provide a fallback for recommendations
  const recommendationsToPass = recommendations || { results: [] };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between max-w-[1000px] mx-auto p-4 gap-4">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          width={200}
          height={300}
          alt={movie.title}
          className="object-cover rounded shadow-md sm:w-[200px]"
        />
        <div className="flex flex-col gap-2 sm:ml-4 text-center sm:text-left max-w-full sm:max-w-[500px]">
          <h1 className="text-2xl sm:text-3xl font-bold">{movie.title}</h1>
          <p className="mt-2">{movie.overview}</p>
          <p className="mt-2">
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p><strong>Genres:</strong> {movie.genres.map((genre: { name: string }) => genre.name).join(', ')}</p>
          <button
            onClick={handleWatchlistToggle}
            className={`mt-2 px-4 py-2 rounded transition duration-300 
              ${isInWatchlist ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} 
              text-white shadow-md`}
          >
            {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </button>
        </div>
      </div>

      <h2 className="mt-4 mb-2 text-2xl">Cast</h2>
      <ul className='mb-4'>
      {credits.cast.slice(0, 5).map((actor: any, index: number) => (
  <li key={actor.id || index}>{actor.name}</li>
))}

      </ul>

      <h2 className="mt-4 text-2xl">Recommendations</h2>
      {loadingRecommendations ? (
        <p className="mt-2 text-center text-[13px] font-medium text-white text-shadow-custom">
          Loading recommendations...
        </p>
      ) : (
        <Recommendations recommendations={recommendationsToPass} />
      )}
    </div>
  );
}
