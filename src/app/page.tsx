"use client"

import React, { useState, useEffect } from 'react';
import MovieCard from './components/MovieCard';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`
      );
      const data = await res.json();
      setMovies((prev) => [...prev, ...data.results]);
    };
    fetchMovies();
  }, [page]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <button onClick={() => setPage(page + 1)} className="mt-4 p-2 bg-blue-500 text-white rounded">
        Load More
      </button>
    </div>
  );
}


