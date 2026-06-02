import type {
  ActorDetails,
  ActorMovieCredit,
  DiscoverParams,
  Genre,
  Movie,
  MovieCredits,
  MovieDetails,
  TMDBPagedResponse,
  Actor,
} from "../types/movieTypes";

import { TMDB_API_KEY } from "../env";

const BASE = "https://api.themoviedb.org/3";

const get = async <T>(
  path: string,
  params: Record<string, string | number> = {},
): Promise<T> => {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([k, v]) =>
    url.searchParams.set(k, String(v)),
  );
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${path}`);
  return res.json();
};

export const posterUrl = (
  path: string | null,
  size: "w500" | "original" = "w500",
): string =>
  path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : "https://placehold.co/500x750?text=No+Image";

// Movies
export const getPopularMovies = (page = 1) =>
  get<TMDBPagedResponse<Movie>>("/movie/popular", { page });

export const getUpcomingMovies = (page = 1) =>
  get<TMDBPagedResponse<Movie>>("/movie/upcoming", { page });

export const getNowPlayingMovies = (page = 1) =>
  get<TMDBPagedResponse<Movie>>("/movie/now_playing", { page });

export const getTopRatedMovies = (page = 1) =>
  get<TMDBPagedResponse<Movie>>("/movie/top_rated", { page });

export const getMovieDetails = (id: number) =>
  get<MovieDetails>(`/movie/${id}`);

export const getMovieCredits = (id: number) =>
  get<MovieCredits>(`/movie/${id}/credits`);

export const getSimilarMovies = (id: number, page = 1) =>
  get<TMDBPagedResponse<Movie>>(`/movie/${id}/similar`, { page });

export const discoverMovies = (params: DiscoverParams = {}) =>
  get<TMDBPagedResponse<Movie>>(
    "/discover/movie",
    params as Record<string, string | number>,
  );

export const getGenres = () => get<{ genres: Genre[] }>("/genre/movie/list");

// Trending
export const getTrendingMovies = (timeWindow: "day" | "week" = "week") =>
  get<TMDBPagedResponse<Movie>>(`/trending/movie/${timeWindow}`);

// Actors
export const getPopularActors = (page = 1) =>
  get<TMDBPagedResponse<Actor>>("/person/popular", { page });

export const getActorDetails = (id: number) =>
  get<ActorDetails>(`/person/${id}`);

export const getActorMovieCredits = (id: number) =>
  get<{ id: number; cast: ActorMovieCredit[] }>(`/person/${id}/movie_credits`);
