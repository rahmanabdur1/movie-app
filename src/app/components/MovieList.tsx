"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import MovieCard from '../components/MovieCard';
import { Movie } from '@/types';

const searchSchema = z.object({
  query: z.string().min(1, 'Search term is required'),
});

type SearchForm = z.infer<typeof searchSchema>;

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
  });

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const url = searchQuery
      ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}&page=${page}`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;

    const res = await fetch(url);
    const data = await res.json();
    setMovies((prevMovies) => [...prevMovies, ...data.results]);
    setIsLoading(false);
  }, [page, searchQuery]);

  useEffect(() => {
    fetchMovies();
  }, [page, searchQuery, fetchMovies]);

  const handleSearch = (data: SearchForm) => {
    setSearchQuery(data.query);
    reset();
    setMovies([]); // Clear previous movies
    setPage(1); // Reset to the first page
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Movie List</h1>

      <form onSubmit={handleSubmit(handleSearch)} className="mb-4 flex justify-center">
        <input
          {...register('query')}
          type="text"
          placeholder="Search for a movie..."
          className="border border-blue-500 outline-none rounded-xl p-2 mr-2 focus:border-blue-700 transition duration-200"
          defaultValue={searchQuery}
        />
        {errors.query && <p className="text-red-500">{errors.query.message}</p>}
        <button type="submit" className="bg-black text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-300">
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {isLoading && <p className="text-center">Loading more movies...</p>}

      <button
        onClick={handleLoadMore}
        className="mt-4 bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 transition duration-300"
        disabled={isLoading}
      >
        Load More
      </button>
    </div>
  );
}
