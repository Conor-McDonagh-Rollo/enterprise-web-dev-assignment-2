import { useQuery } from "@tanstack/react-query";
import { getMovieCredits, getMovieDetails } from "../api/tmdbApi";
import { getMovieReviews } from "../api/reviewsApi";

export const useMovie = (id: number) =>
  useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });

export const useMovieCredits = (id: number) =>
  useQuery({
    queryKey: ["movie", id, "credits"],
    queryFn: () => getMovieCredits(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });

export const useMovieReviews = (id: number) =>
  useQuery({
    queryKey: ["movie", id, "reviews"],
    queryFn: () => getMovieReviews(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
