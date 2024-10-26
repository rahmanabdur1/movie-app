// src/app/movies/[id]/page.tsx

"use client";  // Add this directive to enable client component functionality

import { CreditsSchema, MovieSchema, RecommendationsSchema } from '@/app/schemas';
import Link from 'next/link';
import React from 'react';
import { z } from 'zod';

interface MovieDetailsProps {
  params: {
    id: string;
  };
}

const fetchMovieDetails = async (id: string) => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
  const data = await res.json();
  return MovieSchema.parse(data);
};

const fetchCredits = async (id: string) => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
  const data = await res.json();
  return CreditsSchema.parse(data);
};

const fetchRecommendations = async (id: string) => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
  const data = await res.json();
  return RecommendationsSchema.parse(data);
};

const MovieDetails: React.FC<MovieDetailsProps> = ({ params }) => {
  const { id } = params;
  const [error, setError] = React.useState<string | null>(null);
  const [movie, setMovie] = React.useState<any>(null);
  const [credits, setCredits] = React.useState<any>(null);
  const [recommendations, setRecommendations] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchDetails = async () => {
      try {
        const movieData = await fetchMovieDetails(id);
        setMovie(movieData);

        const creditsData = await fetchCredits(id);
        setCredits(creditsData);

        const recommendationsData = await fetchRecommendations(id);
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

      <h2 className="mt-4 text-2xl">Recommendations</h2>
      <div>
        {recommendations.results.map((rec: { id: number; title: string; poster_path: string }) => (
             <Link className="flex items-center mt-2" href={`/movie/${rec.id}`}>
     
            <img src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`} alt={rec.title} className="w-16 h-24 mr-2" />
            <span>{rec.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieDetails;
