// types.ts

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  title: string;
  id: number;
  poster_path: string | null;
  overview: string;
  release_date: string;
  genres: Genre[];
}

export interface Credits {
  cast: Actor[];
  crew: CrewMember[];
}

export interface Actor {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

export interface Recommendations {
  results: Movie[];
}


