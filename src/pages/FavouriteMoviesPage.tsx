import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetails, posterUrl } from "../api/tmdbApi";
import { useMoviesContext } from "../contexts/MoviesContext";

const FavouriteMovieRow = ({
  id,
  isFirst,
  isLast,
}: {
  id: number;
  isFirst: boolean;
  isLast: boolean;
}) => {
  const { data } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(id),
    staleTime: 1000 * 60 * 10,
  });
  const { removeFavouriteMovie, moveFavouriteMovieUp, moveFavouriteMovieDown } =
    useMoviesContext();

  if (!data) return null;

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}
    >
      <Box component={Link} to={`/movies/${data.id}`} sx={{ flexShrink: 0 }}>
        <Box
          component="img"
          src={posterUrl(data.poster_path)}
          alt={data.title}
          sx={{ width: 60, height: 90, objectFit: "cover", borderRadius: 1 }}
        />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          component={Link}
          to={`/movies/${data.id}`}
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          {data.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.release_date?.slice(0, 4)} ·{" "}
          {data.genres.map((g) => g.name).join(", ")}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <StarIcon fontSize="small" sx={{ color: "warning.main" }} />
          <Typography variant="body2" color="text.secondary">
            {data.vote_average.toFixed(1)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Tooltip title="Move up">
          <span>
            <IconButton
              size="small"
              onClick={() => moveFavouriteMovieUp(id)}
              disabled={isFirst}
            >
              <ArrowUpwardIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Move down">
          <span>
            <IconButton
              size="small"
              onClick={() => moveFavouriteMovieDown(id)}
              disabled={isLast}
            >
              <ArrowDownwardIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Tooltip title="Remove">
        <IconButton
          onClick={() => removeFavouriteMovie(id)}
          color="error"
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

const FavouriteMoviesPage = () => {
  const { favouriteMovies } = useMoviesContext();

  if (favouriteMovies.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          No favourite movies yet
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Click the heart on any movie to add it here.
        </Typography>
        <Button component={Link} to="/" variant="contained">
          Browse Movies
        </Button>
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1">
          My Favourite Movies ({favouriteMovies.length})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Use arrows to reorder
        </Typography>
      </Box>
      <Stack spacing={1}>
        {favouriteMovies.map((id, index) => (
          <FavouriteMovieRow
            key={id}
            id={id}
            isFirst={index === 0}
            isLast={index === favouriteMovies.length - 1}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default FavouriteMoviesPage;
