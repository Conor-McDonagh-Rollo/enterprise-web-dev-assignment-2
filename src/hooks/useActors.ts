import { useQuery } from "@tanstack/react-query";
import { getPopularActors } from "../api/tmdbApi";

export const usePopularActors = (page = 1) =>
  useQuery({
    queryKey: ["actors", "popular", page],
    queryFn: () => getPopularActors(page),
    staleTime: 1000 * 60 * 5,
  });
