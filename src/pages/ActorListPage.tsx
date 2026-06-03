import { useState } from "react";
import { Alert, Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material";
import ActorCard from "../components/actorCard/ActorCard";
import { usePopularActors } from "../hooks/useActors";

const ActorListPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = usePopularActors(page);

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        Popular Actors
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
        {data?.results.map((actor) => (
          <ActorCard key={actor.id} actor={actor} />
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.min(data?.total_pages ?? 1, 500)}
          page={page}
          onChange={(_, p) => {
            setPage(p);
            window.scrollTo(0, 0);
          }}
          color="primary"
          size="large"
        />
      </Box>
    </Stack>
  );
};

export default ActorListPage;
