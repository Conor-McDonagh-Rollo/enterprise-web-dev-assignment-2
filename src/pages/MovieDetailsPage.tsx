import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addMovieReview } from "../api/reviewsApi";
import { posterUrl } from "../api/tmdbApi";
import { useAuth } from "../contexts/AuthContext";
import { useMoviesContext } from "../contexts/MoviesContext";
import {
  useMovie,
  useMovieCredits,
  useMovieReviews,
} from "../hooks/useMovie";
import { useSimilarMovies } from "../hooks/useMovies";
import { useQueryClient } from "@tanstack/react-query";
import MovieCard from "../components/movieCard/MovieCard";

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const { isAuthenticated, user } = useAuth();
  const { isFavouriteMovie, addFavouriteMovie, removeFavouriteMovie } =
    useMoviesContext();
  const queryClient = useQueryClient();

  const { data: movie, isLoading, error } = useMovie(movieId);
  const { data: credits } = useMovieCredits(movieId);
  const { data: similar } = useSimilarMovies(movieId);
  const { data: reviews } = useMovieReviews(movieId);

  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error || !movie) return <Alert severity="error">Movie not found.</Alert>;

  const isFav = isFavouriteMovie(movie.id);

  const submitReview = async () => {
    if (!reviewText.trim() || !user) return;
    setSubmitting(true);
    setReviewError("");
    try {
      const today = new Date().toISOString().slice(0, 10);
      await addMovieReview(user.token, movie.id, today, reviewText.trim());
      setReviewText("");
      queryClient.invalidateQueries({
        queryKey: ["movie", movieId, "reviews"],
      });
    } catch (e: unknown) {
      setReviewError(
        e instanceof Error ? e.message : "Failed to submit review",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      {/* Backdrop */}
      {movie.backdrop_path && (
        <Box
          sx={{
            width: "100%",
            height: { xs: 200, md: 350 },
            borderRadius: 2,
            overflow: "hidden",
            backgroundImage: `url(${posterUrl(movie.backdrop_path, "original")})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Main info */}
      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ flexShrink: 0 }}>
            <Box
              component="img"
              src={posterUrl(movie.poster_path)}
              alt={movie.title}
              sx={{
                width: { xs: "100%", sm: 220 },
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
                mb: 1,
              }}
            >
              <Typography variant="h4" component="h1">
                {movie.title}
              </Typography>
              <Tooltip
                title={isFav ? "Remove from favourites" : "Add to favourites"}
              >
                <IconButton
                  onClick={() =>
                    isFav
                      ? removeFavouriteMovie(movie.id)
                      : addFavouriteMovie(movie.id)
                  }
                  color={isFav ? "error" : "default"}
                >
                  {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>
            </Box>

            {movie.tagline && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontStyle="italic"
                gutterBottom
              >
                "{movie.tagline}"
              </Typography>
            )}

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              {movie.genres.map((g) => (
                <Chip
                  key={g.id}
                  label={g.name}
                  color="primary"
                  variant="outlined"
                  size="small"
                  component={Link}
                  to={`/search?genre=${g.id}`}
                  clickable
                />
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 3, mb: 2, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <StarIcon sx={{ color: "warning.main" }} />
                <Typography>{movie.vote_average.toFixed(1)} / 10</Typography>
                <Typography variant="body2" color="text.secondary">
                  ({movie.vote_count.toLocaleString()} votes)
                </Typography>
              </Box>
              {movie.runtime > 0 && (
                <Typography>{movie.runtime} min</Typography>
              )}
              <Typography>{movie.release_date}</Typography>
              <Typography color="text.secondary">{movie.status}</Typography>
            </Box>

            <Typography variant="body1" paragraph>
              {movie.overview}
            </Typography>

            {movie.production_companies.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                <strong>Production:</strong>{" "}
                {movie.production_companies.map((c) => c.name).join(", ")}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Cast */}
      {credits && credits.cast.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Cast
          </Typography>
          <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
            {credits.cast.slice(0, 12).map((c) => (
              <Box
                key={c.id}
                component={Link}
                to={`/actors/${c.id}`}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 80,
                  gap: 0.5,
                }}
              >
                <Avatar
                  src={posterUrl(c.profile_path)}
                  sx={{ width: 64, height: 64 }}
                />
                <Typography
                  variant="caption"
                  align="center"
                  sx={{ maxWidth: 80 }}
                >
                  {c.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  align="center"
                  sx={{ maxWidth: 80 }}
                >
                  {c.character}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* Reviews */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Reviews
        </Typography>

        {reviews && reviews.length > 0 ? (
          <Stack spacing={2} sx={{ mb: 3 }}>
            {reviews.map((r) => (
              <Paper key={`${r.reviewerId}-${r.date}`} variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="primary">
                  {r.reviewerId}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {r.date}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {r.text}
                </Typography>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No reviews yet. Be the first!
          </Typography>
        )}

        {isAuthenticated ? (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Write a Review
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your thoughts..."
              sx={{ mb: 1 }}
            />
            {reviewError && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {reviewError}
              </Alert>
            )}
            <Button
              variant="contained"
              onClick={submitReview}
              disabled={submitting || !reviewText.trim()}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            <Link to="/login" style={{ color: "#e50914" }}>
              Log in
            </Link>{" "}
            to write a review.
          </Typography>
        )}
      </Paper>

      {/* Similar Movies */}
      {similar && similar.results.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Similar Movies
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
            }}
          >
            {similar.results.slice(0, 4).map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </Box>
        </Paper>
      )}
    </Stack>
  );
};

export default MovieDetailsPage;
