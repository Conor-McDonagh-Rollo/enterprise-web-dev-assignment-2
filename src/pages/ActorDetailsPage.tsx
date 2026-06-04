import {
  Alert,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link, useParams } from "react-router-dom";
import { posterUrl } from "../api/tmdbApi";
import { useMoviesContext } from "../contexts/MoviesContext";
import { useActor, useActorMovieCredits } from "../hooks/useActor";

const ActorDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const actorId = Number(id);

  const { data: actor, isLoading, error } = useActor(actorId);
  const { data: credits } = useActorMovieCredits(actorId);
  const { isFavouriteActor, addFavouriteActor, removeFavouriteActor } =
    useMoviesContext();

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error || !actor) return <Alert severity="error">Actor not found.</Alert>;

  const isFav = isFavouriteActor(actor.id);

  const filmography = (credits?.cast ?? [])
    .filter((m) => m.release_date)
    .sort((a, b) => (b.release_date > a.release_date ? 1 : -1))
    .slice(0, 12);

  return (
    <Stack spacing={3}>
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
              src={posterUrl(actor.profile_path)}
              alt={actor.name}
              sx={{
                width: { xs: "100%", sm: 200 },
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography variant="h4" component="h1">
                {actor.name}
              </Typography>
              <IconButton
                onClick={() =>
                  isFav
                    ? removeFavouriteActor(actor.id)
                    : addFavouriteActor(actor.id)
                }
                color={isFav ? "error" : "default"}
              >
                {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              <Chip label={actor.known_for_department} color="primary" />
              {actor.birthday && (
                <Chip
                  label={`Born: ${actor.birthday}`}
                  variant="outlined"
                  size="small"
                />
              )}
              {actor.place_of_birth && (
                <Chip
                  label={actor.place_of_birth}
                  variant="outlined"
                  size="small"
                />
              )}
              {actor.deathday && (
                <Chip
                  label={`Died: ${actor.deathday}`}
                  variant="outlined"
                  size="small"
                  color="error"
                />
              )}
            </Box>

            {actor.biography ? (
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {actor.biography.length > 800
                  ? actor.biography.slice(0, 800) + "..."
                  : actor.biography}
              </Typography>
            ) : (
              <Typography color="text.secondary">
                No biography available.
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      {filmography.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Filmography
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "repeat(3, 1fr)",
                sm: "repeat(4, 1fr)",
                md: "repeat(6, 1fr)",
              },
            }}
          >
            {filmography.map((m) => (
              <Box
                key={m.id}
                component={Link}
                to={`/movies/${m.id}`}
                sx={{ textDecoration: "none", color: "inherit" }}
              >
                <Box
                  component="img"
                  src={posterUrl(m.poster_path)}
                  alt={m.title}
                  sx={{
                    width: "100%",
                    borderRadius: 1,
                    boxShadow: 1,
                    display: "block",
                  }}
                />
                <Typography
                  variant="caption"
                  noWrap
                  sx={{ display: "block", mt: 0.5 }}
                >
                  {m.title}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ display: "block" }}
                >
                  {m.character}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {m.release_date?.slice(0, 4)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Stack>
  );
};

export default ActorDetailsPage;
