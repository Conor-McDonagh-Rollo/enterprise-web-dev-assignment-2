import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieList from "../components/movieList/MovieList";
import { useDiscoverMovies, useGenres } from "../hooks/useMovies";
import type { DiscoverParams } from "../types/movieTypes";

const LANGUAGES = [
  { code: "", label: "Any" },
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
];

const MovieSearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialGenre = searchParams.get("genre") ?? "";

  const { data: genreData } = useGenres();
  const genres = genreData?.genres ?? [];

  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    initialGenre ? [Number(initialGenre)] : [],
  );
  const [year, setYear] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [language, setLanguage] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [page, setPage] = useState(1);
  const [searchEnabled, setSearchEnabled] = useState(Boolean(initialGenre));

  useEffect(() => {
    const genre = searchParams.get("genre");
    if (genre) {
      setSelectedGenres([Number(genre)]);
      setSearchEnabled(true);
      setPage(1);
    }
  }, [searchParams]);

  const params: DiscoverParams = {
    page,
    sort_by: sortBy,
    ...(minRating > 0 && { "vote_average.gte": minRating }),
    ...(year && !isNaN(Number(year)) && { primary_release_year: Number(year) }),
    ...(selectedGenres.length > 0 && { with_genres: selectedGenres.join(",") }),
    ...(language && { with_original_language: language }),
  };

  const { data, isLoading, error } = useDiscoverMovies(params, searchEnabled);

  const handleGenreToggle = (id: number) =>
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );

  const handleSearch = () => {
    setPage(1);
    setSearchEnabled(true);
  };

  const handleReset = () => {
    setSelectedGenres([]);
    setYear("");
    setMinRating(0);
    setLanguage("");
    setSortBy("popularity.desc");
    setSearchEnabled(false);
    setPage(1);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        Search Movies
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Release Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              type="number"
              size="small"
              sx={{ width: 140 }}
              slotProps={{ htmlInput: { min: 1900, max: 2030 } }}
            />

            <FormControl size="small" sx={{ width: 140 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={language}
                label="Language"
                onChange={(e) => setLanguage(e.target.value)}
              >
                {LANGUAGES.map((l) => (
                  <MenuItem key={l.code} value={l.code}>
                    {l.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ width: 200 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="popularity.desc">Most Popular</MenuItem>
                <MenuItem value="vote_average.desc">Highest Rated</MenuItem>
                <MenuItem value="release_date.desc">Newest First</MenuItem>
                <MenuItem value="release_date.asc">Oldest First</MenuItem>
                <MenuItem value="revenue.desc">Highest Revenue</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ maxWidth: 400 }}>
            <Typography gutterBottom>Minimum Rating: {minRating}</Typography>
            <Slider
              value={minRating}
              min={0}
              max={10}
              step={0.5}
              valueLabelDisplay="auto"
              onChange={(_, v) => setMinRating(v as number)}
              marks={[
                { value: 0, label: "0" },
                { value: 5, label: "5" },
                { value: 10, label: "10" },
              ]}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Genres
            </Typography>
            <FormGroup row>
              {genres.map((g) => (
                <FormControlLabel
                  key={g.id}
                  control={
                    <Checkbox
                      checked={selectedGenres.includes(g.id)}
                      onChange={() => handleGenreToggle(g.id)}
                      size="small"
                    />
                  }
                  label={g.name}
                />
              ))}
            </FormGroup>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={handleSearch} size="large">
              Search
            </Button>
            <Button variant="outlined" onClick={handleReset} size="large">
              Reset
            </Button>
          </Box>
        </Stack>
      </Paper>

      {searchEnabled && (
        <MovieList
          movies={data?.results ?? []}
          loading={isLoading}
          error={error}
          page={page}
          totalPages={data?.total_pages}
          onPageChange={(p) => {
            setPage(p);
            window.scrollTo(0, 0);
          }}
        />
      )}
    </Stack>
  );
};

export default MovieSearchPage;
