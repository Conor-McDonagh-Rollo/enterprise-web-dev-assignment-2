import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MovieIcon from "@mui/icons-material/Movie";
import { useEffect, useRef, useState } from "react";
import { useMoviesContext } from "../contexts/MoviesContext";
import { useGenres } from "../hooks/useMovies";
import type {
  FantasyCastMember,
  FantasyMovie,
  Genre,
} from "../types/movieTypes";

const FantasyMoviePage = () => {
  const { addFantasyMovie, fantasyMovies, removeFantasyMovie } =
    useMoviesContext();
  const { data: genreData } = useGenres();
  const genres = genreData?.genres ?? [];

  // Form state
  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [runtime, setRuntime] = useState("");
  const [productionCompanies, setProductionCompanies] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [cast, setCast] = useState<FantasyCastMember[]>([]);
  const [poster, setPoster] = useState<string | undefined>();
  const [saved, setSaved] = useState(false);

  // New cast member form state
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 3000);
    return () => clearTimeout(timer);
  }, [saved]);

  const toggleGenre = (g: Genre) =>
    setSelectedGenres((prev) =>
      prev.find((x) => x.id === g.id)
        ? prev.filter((x) => x.id !== g.id)
        : [...prev, g],
    );

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPoster(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addCastMember = () => {
    if (!newName.trim() || !newRole.trim()) return;
    setCast((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: newName,
        role: newRole,
        description: newDesc,
      },
    ]);
    setNewName("");
    setNewRole("");
    setNewDesc("");
  };

  const removeCastMember = (id: string) =>
    setCast((prev) => prev.filter((m) => m.id !== id));

  const handleSave = () => {
    if (!title.trim() || !overview.trim()) return;
    const movie: FantasyMovie = {
      id: crypto.randomUUID(),
      title: title.trim(),
      overview: overview.trim(),
      genres: selectedGenres,
      release_date: releaseDate,
      runtime: Number(runtime) || 0,
      production_companies: productionCompanies
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      poster,
      cast,
    };
    addFantasyMovie(movie);
    setSaved(true);
    setTitle("");
    setOverview("");
    setReleaseDate("");
    setRuntime("");
    setProductionCompanies("");
    setSelectedGenres([]);
    setCast([]);
    setPoster(undefined);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        Create a Fantasy Movie
      </Typography>

      {saved && <Alert severity="success">Fantasy movie saved!</Alert>}

      {/* Details form */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Movie Details
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ flexGrow: 1, minWidth: 200 }}
            />
            <TextField
              label="Release Date"
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 180 }}
            />
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Overview *"
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
          />

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Runtime (minutes)"
              type="number"
              value={runtime}
              onChange={(e) => setRuntime(e.target.value)}
              sx={{ width: 160 }}
            />
            <TextField
              label="Production Company(s)"
              value={productionCompanies}
              onChange={(e) => setProductionCompanies(e.target.value)}
              placeholder="e.g. Warner Bros., Universal"
              sx={{ flexGrow: 1 }}
            />
          </Box>

          {/* Poster upload */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Movie Poster
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Button
                variant="outlined"
                startIcon={<MovieIcon />}
                onClick={() => fileRef.current?.click()}
              >
                Upload Poster
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handlePosterUpload}
              />
              {poster && (
                <Box
                  component="img"
                  src={poster}
                  alt="poster preview"
                  sx={{ height: 80, borderRadius: 1, boxShadow: 1 }}
                />
              )}
            </Box>
          </Box>

          {/* Genres */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Genres
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {genres.map((g) => (
                <Chip
                  key={g.id}
                  label={g.name}
                  onClick={() => toggleGenre(g)}
                  color={
                    selectedGenres.find((x) => x.id === g.id)
                      ? "primary"
                      : "default"
                  }
                  variant={
                    selectedGenres.find((x) => x.id === g.id)
                      ? "filled"
                      : "outlined"
                  }
                />
              ))}
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* Cast section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cast
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
          <TextField
            label="Actor Name *"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: 140 }}
          />
          <TextField
            label="Role *"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: 140 }}
          />
          <TextField
            label="Description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            size="small"
            sx={{ flex: 2, minWidth: 200 }}
          />
          <Button
            variant="contained"
            onClick={addCastMember}
            disabled={!newName.trim() || !newRole.trim()}
            startIcon={<AddIcon />}
          >
            Add
          </Button>
        </Box>

        <Stack spacing={1}>
          {cast.map((m) => (
            <Paper
              key={m.id}
              variant="outlined"
              sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 2 }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  {m.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {m.role}
                  {m.description ? ` - ${m.description}` : ""}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => removeCastMember(m.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Paper>
          ))}
        </Stack>
      </Paper>

      <Button
        variant="contained"
        size="large"
        onClick={handleSave}
        disabled={!title.trim() || !overview.trim()}
      >
        Save Fantasy Movie
      </Button>

      {/* Display saved fantasy movies */}
      {fantasyMovies.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            My Fantasy Movies
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
            }}
          >
            {fantasyMovies.map((m) => (
              <Card key={m.id}>
                {m.poster && (
                  <Box
                    component="img"
                    src={m.poster}
                    alt={m.title}
                    sx={{ width: "100%", height: 200, objectFit: "cover" }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{m.title}</Typography>
                  {m.release_date && (
                    <Typography variant="body2" color="text.secondary">
                      {m.release_date} ·{" "}
                      {m.runtime > 0 ? `${m.runtime} min` : ""}
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    sx={{ mb: 1 }}
                  >
                    {m.overview}
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1 }}
                  >
                    {m.genres.map((g) => (
                      <Chip key={g.id} label={g.name} size="small" />
                    ))}
                  </Box>
                  {m.cast.length > 0 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Cast: {m.cast.map((c) => c.name).join(", ")}
                    </Typography>
                  )}
                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeFantasyMovie(m.id)}
                    sx={{ mt: 1 }}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>
      )}
    </Stack>
  );
};

export default FantasyMoviePage;
