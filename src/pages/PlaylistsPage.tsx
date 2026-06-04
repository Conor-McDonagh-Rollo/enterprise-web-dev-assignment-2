import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetails, posterUrl } from "../api/tmdbApi";
import { useMoviesContext } from "../contexts/MoviesContext";
import type { Playlist } from "../types/movieTypes";

const PlaylistMovie = ({
  movieId,
  playlistId,
}: {
  movieId: number;
  playlistId: string;
}) => {
  const { removeMovieFromPlaylist } = useMoviesContext();
  const { data, isLoading } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieDetails(movieId),
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading)
    return <CircularProgress size={20} sx={{ display: "block", m: 1 }} />;
  if (!data) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 1,
        borderRadius: 1,
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Box
        component={Link}
        to={`/movies/${data.id}`}
        sx={{ flexShrink: 0, lineHeight: 0 }}
      >
        <Box
          component="img"
          src={posterUrl(data.poster_path)}
          alt={data.title}
          sx={{ width: 40, height: 60, objectFit: "cover", borderRadius: 0.5 }}
        />
      </Box>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          fontWeight="bold"
          noWrap
          component={Link}
          to={`/movies/${data.id}`}
          sx={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          {data.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {data.release_date?.slice(0, 4)} ·
            </Typography>
            <StarIcon sx={{ fontSize: 12, color: "warning.main" }} />
            <Typography variant="caption" color="text.secondary">
              {data.vote_average.toFixed(1)}
            </Typography>
          </Box>
        </Typography>
      </Box>
      <Tooltip title="Remove from playlist">
        <IconButton
          size="small"
          color="error"
          onClick={() => removeMovieFromPlaylist(playlistId, movieId)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const PlaylistCard = ({ playlist }: { playlist: Playlist }) => {
  const { deletePlaylist } = useMoviesContext();
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader
        title={playlist.title}
        subheader={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <Chip label={playlist.theme} size="small" variant="outlined" />
            <Typography variant="caption" color="text.secondary">
              {playlist.movieIds.length} movie
              {playlist.movieIds.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        }
        action={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={expanded ? "Collapse" : "Expand"}>
              <IconButton
                onClick={() => setExpanded((p) => !p)}
                sx={{
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete playlist">
              <IconButton
                color="error"
                onClick={() => deletePlaylist(playlist.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      <Collapse in={expanded}>
        <CardContent sx={{ pt: 0 }}>
          {playlist.movieIds.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No movies yet. Add them from any movie card.
            </Typography>
          ) : (
            <Stack spacing={0.5}>
              {playlist.movieIds.map((id) => (
                <PlaylistMovie
                  key={id}
                  movieId={id}
                  playlistId={playlist.id}
                />
              ))}
            </Stack>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

const PlaylistsPage = () => {
  const { playlists, createPlaylist } = useMoviesContext();
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");
  const [formError, setFormError] = useState("");

  const handleCreate = () => {
    if (!title.trim() || !theme.trim()) {
      setFormError("Both title and theme are required.");
      return;
    }
    createPlaylist(title.trim(), theme.trim());
    setTitle("");
    setTheme("");
    setFormError("");
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        My Playlists
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Create a Playlist
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "flex-start" }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setFormError(""); }}
            size="small"
            sx={{ flex: 1, minWidth: 180 }}
          />
          <TextField
            label="Theme"
            value={theme}
            onChange={(e) => { setTheme(e.target.value); setFormError(""); }}
            size="small"
            placeholder="e.g. 80s Sci-Fi, Date Night"
            sx={{ flex: 1, minWidth: 180 }}
          />
          <Button
            variant="contained"
            onClick={handleCreate}
            startIcon={<AddIcon />}
            disabled={!title.trim() || !theme.trim()}
          >
            Create
          </Button>
        </Box>
        {formError && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
            {formError}
          </Typography>
        )}
      </Paper>

      {playlists.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">
            No playlists yet. Create one above, then add movies from any movie card.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {playlists.map((pl) => (
            <PlaylistCard key={pl.id} playlist={pl} />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default PlaylistsPage;
