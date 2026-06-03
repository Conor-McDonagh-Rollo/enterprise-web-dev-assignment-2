import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import type { Genre } from "../../types/movieTypes";

export type FilterValues = {
  title: string;
  genreId: string;
  minRating: number;
  sortBy: string;
};

export const defaultFilters: FilterValues = {
  title: "",
  genreId: "",
  minRating: 0,
  sortBy: "popularity.desc",
};

type Props = {
  genres: Genre[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onReset: () => void;
};

const FilterMoviesCard = ({ genres, values, onChange, onReset }: Props) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Filter & Sort
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "flex-end",
          }}
        >
          <TextField
            label="Search by title"
            value={values.title}
            onChange={(e) => onChange({ ...values, title: e.target.value })}
            size="small"
            sx={{ minWidth: 180 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Genre</InputLabel>
            <Select
              value={values.genreId}
              label="Genre"
              onChange={(e) => onChange({ ...values, genreId: e.target.value })}
            >
              <MenuItem value="">All genres</MenuItem>
              {genres.map((g) => (
                <MenuItem key={g.id} value={String(g.id)}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={values.sortBy}
              label="Sort By"
              onChange={(e) => onChange({ ...values, sortBy: e.target.value })}
            >
              <MenuItem value="popularity.desc">Most Popular</MenuItem>
              <MenuItem value="popularity.asc">Least Popular</MenuItem>
              <MenuItem value="vote_average.desc">Highest Rated</MenuItem>
              <MenuItem value="release_date.desc">Newest First</MenuItem>
              <MenuItem value="release_date.asc">Oldest First</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" gutterBottom>
              Min Rating: {values.minRating}
            </Typography>
            <Slider
              value={values.minRating}
              min={0}
              max={10}
              step={0.5}
              valueLabelDisplay="auto"
              onChange={(_, v) =>
                onChange({ ...values, minRating: v as number })
              }
            />
          </Box>

          <Button variant="outlined" onClick={onReset} size="small">
            Reset
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FilterMoviesCard;
