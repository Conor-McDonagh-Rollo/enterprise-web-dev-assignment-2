import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";
import { posterUrl } from "../../api/tmdbApi";
import { useMoviesContext } from "../../contexts/MoviesContext";
import type { Actor } from "../../types/movieTypes";

const ActorCard = ({ actor }: { actor: Actor }) => {
  const { isFavouriteActor, addFavouriteActor, removeFavouriteActor } =
    useMoviesContext();
  const isFav = isFavouriteActor(actor.id);

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "secondary.main" }}>
            <PersonIcon />
          </Avatar>
        }
        title={
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: "bold" }}>
            {actor.name}
          </Typography>
        }
        subheader={actor.known_for_department}
        action={
          <Tooltip
            title={isFav ? "Remove from favourites" : "Add to favourites"}
          >
            <IconButton
              onClick={() =>
                isFav
                  ? removeFavouriteActor(actor.id)
                  : addFavouriteActor(actor.id)
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
        image={posterUrl(actor.profile_path)}
        alt={actor.name}
        sx={{ height: 280, objectFit: "cover", objectPosition: "top" }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Known for:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {actor.known_for.slice(0, 2).map((kf) => (
            <Chip key={kf.id} label={kf.title ?? kf.name} size="small" />
          ))}
        </Box>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          component={Link}
          to={`/actors/${actor.id}`}
          variant="outlined"
          fullWidth
        >
          View Bio
        </Button>
      </CardActions>
    </Card>
  );
};

export default ActorCard;
