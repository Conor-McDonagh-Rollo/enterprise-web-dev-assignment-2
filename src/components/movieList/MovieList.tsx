import { Alert, Box, CircularProgress, Pagination, Stack } from "@mui/material";
import type { Movie } from "../../types/movieTypes";
import MovieCard from "../movieCard/MovieCard";

type Props = {
  movies: Movie[];
  loading: boolean;
  error?: Error | null;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

const MovieList = ({
  movies,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
}: Props) => {
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error.message}</Alert>;
  if (movies.length === 0)
    return <Alert severity="info">No movies found.</Alert>;

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
        }}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </Box>

      {totalPages && totalPages > 1 && onPageChange && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.min(totalPages, 500)}
            page={page ?? 1}
            onChange={(_, p) => onPageChange(p)}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Stack>
  );
};

export default MovieList;
