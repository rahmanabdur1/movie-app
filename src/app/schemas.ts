// src/schemas.ts
import { z } from 'zod';

// Define the Movie schema using Zod
export const MovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(), // poster_path can be null
  release_date: z.string(),
  genres: z.array(z.object({
    id: z.number(),
    name: z.string(),
  })),
});

// Define other schemas as needed
export const CreditsSchema = z.object({
  cast: z.array(z.object({
    name: z.string(),
    character: z.string(),
    profile_path: z.string().nullable(),
  })),
});

export const RecommendationsSchema = z.object({
  results: z.array(z.object({
    id: z.number(),
    title: z.string(),
    poster_path: z.string().nullable(),
  })),
});
