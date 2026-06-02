export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
};

export type Genre = {
  id: number;
  name: string;
};

export type MovieDetails = Movie & {
  genres: Genre[];
  runtime: number;
  tagline: string;
  status: string;
  production_companies: { id: number; name: string }[];
  budget: number;
  revenue: number;
  homepage: string;
};

export type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
};

export type MovieCredits = {
  id: number;
  cast: CastMember[];
  crew: {
    id: number;
    name: string;
    job: string;
    profile_path: string | null;
  }[];
};

export type Actor = {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  known_for: {
    id: number;
    title?: string;
    name?: string;
    media_type: string;
  }[];
};

export type ActorDetails = {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
};

export type ActorMovieCredit = {
  id: number;
  title: string;
  character: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

export type TMDBPagedResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type DiscoverParams = {
  page?: number;
  with_genres?: string;
  primary_release_year?: number;
  "vote_average.gte"?: number;
  sort_by?: string;
  with_original_language?: string;
};

export type FantasyCastMember = {
  id: string;
  name: string;
  role: string;
  description: string;
};

export type Review = {
  movieId: number;
  reviewerId: string;
  date: string;
  text: string;
};

export type FantasyMovie = {
  id: string;
  title: string;
  overview: string;
  genres: Genre[];
  release_date: string;
  runtime: number;
  production_companies: string[];
  poster?: string;
  cast: FantasyCastMember[];
};

export type Playlist = {
  id: string;
  title: string;
  theme: string;
  movieIds: number[];
};
