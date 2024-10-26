"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation'; // Import useSearchParams and useRouter
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
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
  });

  const searchParams = useSearchParams(); // Get the current search params
  const router = useRouter(); // Initialize the router

  // Get the initial search query from URL parameters
  const searchQuery = searchParams.get('query') || '';

  useEffect(() => {
    fetchMovies();
  }, [page, searchQuery]);

  const fetchMovies = async () => {
    setIsLoading(true);
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const url = searchQuery
      ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}&page=${page}`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;

    const res = await fetch(url);
    const data = await res.json();
    setMovies((prevMovies) => [...prevMovies, ...data.results]);
    setIsLoading(false);
  };

  const handleSearch = (data: SearchForm) => {
    const params = new URLSearchParams(searchParams.toString()); // Create a new URLSearchParams object from existing parameters
    if (data.query) {
      params.set('query', data.query); // Set the query parameter
      router.push(`?${params.toString()}`); // Update the URL with the new parameters
    } else {
      params.delete('query'); // Remove the query parameter if the input is empty
      router.push(`?${params.toString()}`); // Update the URL to remove the parameter
    }
    
    reset();
    setMovies([]);
    setPage(1); // Reset the page to 1 for a new search
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">Movie List</h1>

      <form onSubmit={handleSubmit(handleSearch)} className="mb-4">
        <input
          {...register('query')}
          type="text"
          placeholder="Search for a movie..."
          className="border rounded p-2 mr-2"
          defaultValue={searchQuery} // Set the default value to the query in the URL
        />
        {errors.query && <p className="text-red-500">{errors.query.message}</p>}
        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {isLoading && <p>Loading more movies...</p>}

      <button
        onClick={handleLoadMore}
        className="mt-4 bg-green-500 text-white rounded px-4 py-2"
        disabled={isLoading}
      >
        Load More
      </button>
    </div>
  );
}
