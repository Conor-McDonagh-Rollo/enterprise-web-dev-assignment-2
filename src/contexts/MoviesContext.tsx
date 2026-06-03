import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { FantasyMovie, Playlist } from "../types/movieTypes";

type MoviesContextType = {
  // Favourite movies (ordered list)
  favouriteMovies: number[];
  addFavouriteMovie: (id: number) => void;
  removeFavouriteMovie: (id: number) => void;
  isFavouriteMovie: (id: number) => boolean;
  moveFavouriteMovieUp: (id: number) => void;
  moveFavouriteMovieDown: (id: number) => void;

  // Favourite actors
  favouriteActors: number[];
  addFavouriteActor: (id: number) => void;
  removeFavouriteActor: (id: number) => void;
  isFavouriteActor: (id: number) => boolean;

  // Fantasy movies
  fantasyMovies: FantasyMovie[];
  addFantasyMovie: (movie: FantasyMovie) => void;
  removeFantasyMovie: (id: string) => void;

  // Playlists
  playlists: Playlist[];
  createPlaylist: (title: string, theme: string) => void;
  deletePlaylist: (id: string) => void;
  addMovieToPlaylist: (playlistId: string, movieId: number) => void;
  removeMovieFromPlaylist: (playlistId: string, movieId: number) => void;
};

const MoviesContext = createContext<MoviesContextType | null>(null);

const load = <T,>(key: string, fallback: T): T => {
  try {
    const s = localStorage.getItem(key);
    return s ? (JSON.parse(s) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const MoviesProvider = ({ children }: { children: ReactNode }) => {
  const [favouriteMovies, setFavMovies] = useState<number[]>(() =>
    load("fav_movies", []),
  );
  const [favouriteActors, setFavActors] = useState<number[]>(() =>
    load("fav_actors", []),
  );
  const [fantasyMovies, setFantasyMovies] = useState<FantasyMovie[]>(() =>
    load("fantasy_movies", []),
  );
  const [playlists, setPlaylists] = useState<Playlist[]>(() =>
    load("playlists", []),
  );

  useEffect(() => {
    localStorage.setItem("fav_movies", JSON.stringify(favouriteMovies));
  }, [favouriteMovies]);

  useEffect(() => {
    localStorage.setItem("fav_actors", JSON.stringify(favouriteActors));
  }, [favouriteActors]);

  useEffect(() => {
    localStorage.setItem("fantasy_movies", JSON.stringify(fantasyMovies));
  }, [fantasyMovies]);

  useEffect(() => {
    localStorage.setItem("playlists", JSON.stringify(playlists));
  }, [playlists]);

  // FAVOURITE MOVIE

  const addFavouriteMovie = (id: number) =>
    setFavMovies((p) => (p.includes(id) ? p : [...p, id]));

  const removeFavouriteMovie = (id: number) =>
    setFavMovies((p) => p.filter((x) => x !== id));

  const isFavouriteMovie = (id: number) => favouriteMovies.includes(id);

  const moveFavouriteMovieUp = (id: number) =>
    setFavMovies((prev) => {
      const idx = prev.indexOf(id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });

  const moveFavouriteMovieDown = (id: number) =>
    setFavMovies((prev) => {
      const idx = prev.indexOf(id);
      if (idx === -1 || idx === prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });

  // FAVOURITE ACTOR

  const addFavouriteActor = (id: number) =>
    setFavActors((p) => (p.includes(id) ? p : [...p, id]));

  const removeFavouriteActor = (id: number) =>
    setFavActors((p) => p.filter((x) => x !== id));

  const isFavouriteActor = (id: number) => favouriteActors.includes(id);

  // FANTASY MOVIES

  const addFantasyMovie = (movie: FantasyMovie) =>
    setFantasyMovies((p) => [...p, movie]);

  const removeFantasyMovie = (id: string) =>
    setFantasyMovies((p) => p.filter((m) => m.id !== id));

  // PLAYLISTS

  const createPlaylist = (title: string, theme: string) =>
    setPlaylists((p) => [
      ...p,
      { id: crypto.randomUUID(), title, theme, movieIds: [] },
    ]);

  const deletePlaylist = (id: string) =>
    setPlaylists((p) => p.filter((pl) => pl.id !== id));

  const addMovieToPlaylist = (playlistId: string, movieId: number) =>
    setPlaylists((p) =>
      p.map((pl) =>
        pl.id === playlistId && !pl.movieIds.includes(movieId)
          ? { ...pl, movieIds: [...pl.movieIds, movieId] }
          : pl,
      ),
    );

  const removeMovieFromPlaylist = (playlistId: string, movieId: number) =>
    setPlaylists((p) =>
      p.map((pl) =>
        pl.id === playlistId
          ? { ...pl, movieIds: pl.movieIds.filter((id) => id !== movieId) }
          : pl,
      ),
    );

  return (
    <MoviesContext.Provider
      value={{
        favouriteMovies,
        addFavouriteMovie,
        removeFavouriteMovie,
        isFavouriteMovie,
        moveFavouriteMovieUp,
        moveFavouriteMovieDown,
        favouriteActors,
        addFavouriteActor,
        removeFavouriteActor,
        isFavouriteActor,
        fantasyMovies,
        addFantasyMovie,
        removeFantasyMovie,
        playlists,
        createPlaylist,
        deletePlaylist,
        addMovieToPlaylist,
        removeMovieFromPlaylist,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

export const useMoviesContext = () => {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error("useMoviesContext must be inside MoviesProvider");
  return ctx;
};
