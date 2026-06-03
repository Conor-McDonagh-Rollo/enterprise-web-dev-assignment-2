import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import FilterMoviesCard, {
  defaultFilters,
  type FilterValues,
} from "../components/filterMoviesCard/FilterMoviesCard";
import MovieList from "../components/movieList/MovieList";
import { useGenres, usePopularMovies } from "../hooks/useMovies";

const HomePage = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterValues>(defaultFilters);

  const { data, isLoading, error } = usePopularMovies(page);
  const { data: genreData } = useGenres();
  const genres = genreData?.genres ?? [];

  const visibleMovies = (data?.results ?? [])
    .filter((m) => {
      const titleMatch = m.title
        .toLowerCase()
        .includes(filters.title.toLowerCase());
      const genreMatch =
        !filters.genreId || m.genre_ids.includes(Number(filters.genreId));
      const ratingMatch = m.vote_average >= filters.minRating;
      return titleMatch && genreMatch && ratingMatch;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "popularity.asc":    return a.popularity - b.popularity;
        case "popularity.desc":   return b.popularity - a.popularity;
        case "vote_average.desc": return b.vote_average - a.vote_average;
        case "release_date.desc": return b.release_date.localeCompare(a.release_date);
        case "release_date.asc":  return a.release_date.localeCompare(b.release_date);
        default:                  return 0;
      }
    });

  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        Popular Movies
      </Typography>
      <FilterMoviesCard
        genres={genres}
        values={filters}
        onChange={(f) => {
          setFilters(f);
          setPage(1);
        }}
        onReset={() => {
          setFilters(defaultFilters);
          setPage(1);
        }}
      />
      <MovieList
        movies={visibleMovies}
        loading={isLoading}
        error={error}
        page={page}
        totalPages={data?.total_pages}
        onPageChange={(p) => {
          setPage(p);
          window.scrollTo(0, 0);
        }}
      />
    </Stack>
  );
};

export default HomePage;
