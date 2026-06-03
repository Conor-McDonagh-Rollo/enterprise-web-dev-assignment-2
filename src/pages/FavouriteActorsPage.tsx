import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getActorDetails, posterUrl } from "../api/tmdbApi";
import { useMoviesContext } from "../contexts/MoviesContext";
import ActorCard from "../components/actorCard/ActorCard";
import type { Actor } from "../types/movieTypes";

// ActorDetails → Actor shape for ActorCard
const FavouriteActorItem = ({ id }: { id: number }) => {
  const { data } = useQuery({
    queryKey: ["actor", id],
    queryFn: () => getActorDetails(id),
    staleTime: 1000 * 60 * 10,
  });

  if (!data) return null;

  const actorShape: Actor = {
    id: data.id,
    name: data.name,
    profile_path: data.profile_path,
    known_for_department: data.known_for_department,
    popularity: data.popularity,
    known_for: [],
  };

  return <ActorCard actor={actorShape} />;
};

const FavouriteActorsPage = () => {
  const { favouriteActors } = useMoviesContext();

  if (favouriteActors.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          No favourite actors yet
        </Typography>
        <Button
          component={Link}
          to="/actors"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Browse Actors
        </Button>
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        My Favourite Actors ({favouriteActors.length})
      </Typography>
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
        {favouriteActors.map((id) => (
          <FavouriteActorItem key={id} id={id} />
        ))}
      </Box>
    </Stack>
  );
};

export default FavouriteActorsPage;
