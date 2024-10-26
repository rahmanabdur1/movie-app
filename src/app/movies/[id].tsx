// src/app/movies/[id].tsx
import React from 'react';


import { z } from 'zod';
import { useWatchlist } from '../context/WatchlistContext';
import { MovieSchema, CreditsSchema, RecommendationsSchema } from '../schemas';

interface MovieDetailsProps {
  params: {
    id: string;
  };
}

const fetchMovieDetails = async (id: string) => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
  return res.json();
};

const fetchCredits = async (id: string) => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
  return res.json();
};

const fetchRecommendations = async (id: string) => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
  return res.json();
};

const MovieDetails: React.FC<MovieDetailsProps> = async ({ params }) => {
  const { id } = params;
  const { addToWatchlist, removeFromWatchlist, watchlist } = useWatchlist();
  const [error, setError] = React.useState<string | null>(null);
  const [movie, setMovie] = React.useState<any>(null);
  const [credits, setCredits] = React.useState<any>(null);
  const [recommendations, setRecommendations] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchDetails = async () => {
      try {
        const movieData = await fetchMovieDetails(id);
        MovieSchema.parse(movieData);
        setMovie(movieData);

        const creditsData = await fetchCredits(id);
        CreditsSchema.parse(creditsData);
        setCredits(creditsData);

        const recommendationsData = await fetchRecommendations(id);
        RecommendationsSchema.parse(recommendationsData);
        setRecommendations(recommendationsData);
      } catch (err) {
        if (err instanceof z.ZodError) {
          setError('Failed to validate movie data. Please try again later.');
        } else {
          setError('An error occurred while fetching movie data. Please try again later.');
        }
      }
    };

    fetchDetails();
  }, [id]);

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!movie || !credits || !recommendations) return <p>Loading...</p>;

  const isInWatchlist = watchlist.some((m) => m.id === movie.id);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{movie.title}</h1>
      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      <p className="mt-2">{movie.overview}</p>
      <p><strong>Release Date:</strong> {movie.release_date}</p>
      <p><strong>Genres:</strong> {movie.genres.map((genre: { name: string }) => genre.name).join(', ')}</p>
      <h2 className="mt-4 text-2xl">Cast</h2>
      <ul>
        {credits.cast.slice(0, 5).map((actor: { name: string }) => (
          <li key={actor.name}>{actor.name}</li>
        ))}
      </ul>
      <button
        onClick={() => {
          if (isInWatchlist) {
            removeFromWatchlist(movie.id);
          } else {
            addToWatchlist(movie);
          }
        }}
        className={`p-2 mt-4 ${isInWatchlist ? 'bg-red-500' : 'bg-green-500'} text-white rounded`}
      >
        {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
      </button>

      <h2 className="mt-4 text-2xl">Recommendations</h2>
      <ul>
        {recommendations.results.map((rec: { id: number; title: string; poster_path: string }) => (
          <li key={rec.id} className="flex items-center mt-2">
            <img src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`} alt={rec.title} className="w-16 h-24 mr-2" />
            <span>{rec.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieDetails;
