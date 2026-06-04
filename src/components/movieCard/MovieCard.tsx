import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
  Avatar,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import StarIcon from "@mui/icons-material/Star";
import { useState } from "react";
import { Link } from "react-router-dom";
import { posterUrl } from "../../api/tmdbApi";
import { useMoviesContext } from "../../contexts/MoviesContext";
import type { Movie } from "../../types/movieTypes";

const MovieCard = ({ movie }: { movie: Movie }) => {
  const {
    isFavouriteMovie,
    addFavouriteMovie,
    removeFavouriteMovie,
    playlists,
    addMovieToPlaylist,
  } = useMoviesContext();
  const isFav = isFavouriteMovie(movie.id);
  const [playlistOpen, setPlaylistOpen] = useState(false);

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "primary.main" }}>{movie.title?.[0]}</Avatar>
        }
        title={
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: "bold" }}>
            {movie.title}
          </Typography>
        }
        subheader={movie.release_date?.slice(0, 4)}
        action={
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
              size="small"
            >
              {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
        }
      />

      <CardMedia
        component="img"
        image={posterUrl(movie.poster_path)}
        alt={movie.title}
        sx={{ height: 280, objectFit: "cover" }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
          <StarIcon fontSize="small" sx={{ color: "warning.main" }} />
          <Typography variant="body2">
            {movie.vote_average.toFixed(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({movie.vote_count.toLocaleString()})
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {movie.overview}
        </Typography>
      </CardContent>

      <CardActions sx={{ gap: 0.5 }}>
        <Button
          size="small"
          component={Link}
          to={`/movies/${movie.id}`}
          variant="outlined"
          sx={{ flexGrow: 1 }}
        >
          More Info
        </Button>
        {playlists.length > 0 && (
          <Tooltip title="Add to playlist">
            <IconButton size="small" onClick={() => setPlaylistOpen(true)}>
              <PlaylistAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>

      {/* Playlist picker */}
      <Dialog open={playlistOpen} onClose={() => setPlaylistOpen(false)}>
        <DialogTitle>Add "{movie.title}" to Playlist</DialogTitle>
        <DialogContent sx={{ minWidth: 280, pt: 0 }}>
          <List dense>
            {playlists.map((pl) => (
              <ListItem key={pl.id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    addMovieToPlaylist(pl.id, movie.id);
                    setPlaylistOpen(false);
                  }}
                >
                  <ListItemText
                    primary={pl.title}
                    secondary={`${pl.movieIds.length} movies`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPlaylistOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default MovieCard;
