import { useQuery } from "@tanstack/react-query";
import { getActorDetails, getActorMovieCredits } from "../api/tmdbApi";

export const useActor = (id: number) =>
  useQuery({
    queryKey: ["actor", id],
    queryFn: () => getActorDetails(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });

export const useActorMovieCredits = (id: number) =>
  useQuery({
    queryKey: ["actor", id, "credits"],
    queryFn: () => getActorMovieCredits(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
