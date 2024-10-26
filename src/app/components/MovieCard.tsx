// src/app/components/MovieCard.tsx
import React from 'react';
import { Movie } from '../context/WatchlistContext';
import Link from 'next/link';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="p-4 border rounded hover:shadow-lg">
        <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
        <h3 className="mt-2 text-lg font-semibold">{movie.title}</h3>
      </div>
    </Link>
  );
}
