
"use client"
import { Movie } from '@/types';
// src/context/WatchlistContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';


type WatchlistContextType = {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
};

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  const addToWatchlist = (movie: Movie) => {
    setWatchlist((prevWatchlist) => {
      if (!prevWatchlist.find((item) => item.id === movie.id)) {
        return [...prevWatchlist, movie];
      }
      return prevWatchlist;
    });
  };

  const removeFromWatchlist = (movieId: number) => {
    setWatchlist((prevWatchlist) => prevWatchlist.filter((movie) => movie.id !== movieId));
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
