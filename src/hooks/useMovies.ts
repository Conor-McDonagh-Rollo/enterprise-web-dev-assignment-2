import { useQuery } from "@tanstack/react-query";
import {
  discoverMovies,
  getGenres,
  getNowPlayingMovies,
  getPopularMovies,
  getSimilarMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getUpcomingMovies,
} from "../api/tmdbApi";
import type { DiscoverParams } from "../types/movieTypes";

export const usePopularMovies = (page = 1) =>
  useQuery({
    queryKey: ["movies", "popular", page],
    queryFn: () => getPopularMovies(page),
    staleTime: 1000 * 60 * 5,
  });

export const useUpcomingMovies = (page = 1) =>
  useQuery({
    queryKey: ["movies", "upcoming", page],
    queryFn: () => getUpcomingMovies(page),
    staleTime: 1000 * 60 * 5,
  });

export const useNowPlayingMovies = (page = 1) =>
  useQuery({
    queryKey: ["movies", "now_playing", page],
    queryFn: () => getNowPlayingMovies(page),
    staleTime: 1000 * 60 * 5,
  });

export const useTopRatedMovies = (page = 1) =>
  useQuery({
    queryKey: ["movies", "top_rated", page],
    queryFn: () => getTopRatedMovies(page),
    staleTime: 1000 * 60 * 5,
  });

export const useTrendingMovies = () =>
  useQuery({
    queryKey: ["movies", "trending"],
    queryFn: () => getTrendingMovies("week"),
    staleTime: 1000 * 60 * 10,
  });

export const useSimilarMovies = (id: number) =>
  useQuery({
    queryKey: ["movie", id, "similar"],
    queryFn: () => getSimilarMovies(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

export const useDiscoverMovies = (params: DiscoverParams, enabled = true) =>
  useQuery({
    queryKey: ["movies", "discover", params],
    queryFn: () => discoverMovies(params),
    enabled,
    staleTime: 1000 * 60 * 5,
  });

export const useGenres = () =>
  useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
    staleTime: Infinity,
  });
