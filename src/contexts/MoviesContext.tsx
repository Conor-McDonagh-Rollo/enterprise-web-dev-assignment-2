import { createContext, useContext, useState, type ReactNode } from "react";
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

const save = <T,>(key: string, value: T) =>
  localStorage.setItem(key, JSON.stringify(value));

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

  // FAVOURITE MOVIE

  const addFavouriteMovie = (id: number) =>
    setFavMovies((p) => {
      const n = [...p, id];
      save("fav_movies", n);
      return n;
    });

  const removeFavouriteMovie = (id: number) =>
    setFavMovies((p) => {
      const n = p.filter((x) => x !== id);
      save("fav_movies", n);
      return n;
    });

  const isFavouriteMovie = (id: number) => favouriteMovies.includes(id);

  const moveFavouriteMovieUp = (id: number) =>
    setFavMovies((prev) => {
      const idx = prev.indexOf(id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      save("fav_movies", next);
      return next;
    });

  const moveFavouriteMovieDown = (id: number) =>
    setFavMovies((prev) => {
      const idx = prev.indexOf(id);
      if (idx === -1 || idx === prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      save("fav_movies", next);
      return next;
    });

  // FAVOURITE ACTOR

  const addFavouriteActor = (id: number) =>
    setFavActors((p) => {
      const n = [...p, id];
      save("fav_actors", n);
      return n;
    });

  const removeFavouriteActor = (id: number) =>
    setFavActors((p) => {
      const n = p.filter((x) => x !== id);
      save("fav_actors", n);
      return n;
    });

  const isFavouriteActor = (id: number) => favouriteActors.includes(id);

  // FANTASY MOVIES

  const addFantasyMovie = (movie: FantasyMovie) =>
    setFantasyMovies((p) => {
      const n = [...p, movie];
      save("fantasy_movies", n);
      return n;
    });

  const removeFantasyMovie = (id: string) =>
    setFantasyMovies((p) => {
      const n = p.filter((m) => m.id !== id);
      save("fantasy_movies", n);
      return n;
    });

  // PLAYLISTS

  const createPlaylist = (title: string, theme: string) =>
    setPlaylists((p) => {
      const n = [
        ...p,
        { id: Date.now().toString(), title, theme, movieIds: [] },
      ];
      save("playlists", n);
      return n;
    });

  const deletePlaylist = (id: string) =>
    setPlaylists((p) => {
      const n = p.filter((pl) => pl.id !== id);
      save("playlists", n);
      return n;
    });

  const addMovieToPlaylist = (playlistId: string, movieId: number) =>
    setPlaylists((p) => {
      const n = p.map((pl) =>
        pl.id === playlistId && !pl.movieIds.includes(movieId)
          ? { ...pl, movieIds: [...pl.movieIds, movieId] }
          : pl,
      );
      save("playlists", n);
      return n;
    });

  const removeMovieFromPlaylist = (playlistId: string, movieId: number) =>
    setPlaylists((p) => {
      const n = p.map((pl) =>
        pl.id === playlistId
          ? { ...pl, movieIds: pl.movieIds.filter((id) => id !== movieId) }
          : pl,
      );
      save("playlists", n);
      return n;
    });

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
