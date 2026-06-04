import {
  AppBar,
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const SiteHeader = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [moviesAnchor, setMoviesAnchor] = useState<null | HTMLElement>(null);
  const [myStuffAnchor, setMyStuffAnchor] = useState<null | HTMLElement>(null);

  const closeAll = () => {
    setMoviesAnchor(null);
    setMyStuffAnchor(null);
  };

  const handleLogout = async () => {
    closeAll();
    await logout();
    navigate("/");
  };

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ gap: 0.5 }}>
        <MovieIcon sx={{ mr: 1 }} />
        <Typography
          component={RouterLink}
          to="/"
          variant="h6"
          sx={{ color: "inherit", textDecoration: "none", flexGrow: 1 }}
        >
          Movies App
        </Typography>

        <Box sx={{ display: "flex", gap: 0.5 }}>
          {/* Movies dropdown */}
          <Button
            color="inherit"
            onClick={(e) => setMoviesAnchor(e.currentTarget)}
            endIcon={<ArrowDropDownIcon />}
          >
            Movies
          </Button>
          <Menu
            anchorEl={moviesAnchor}
            open={Boolean(moviesAnchor)}
            onClose={closeAll}
          >
            <MenuItem component={RouterLink} to="/" onClick={closeAll}>
              Popular
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to="/movies/upcoming"
              onClick={closeAll}
            >
              Upcoming
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to="/movies/nowplaying"
              onClick={closeAll}
            >
              Now Playing
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to="/movies/toprated"
              onClick={closeAll}
            >
              Top Rated
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to="/movies/trending"
              onClick={closeAll}
            >
              Trending
            </MenuItem>
          </Menu>

          <Button color="inherit" component={RouterLink} to="/actors">
            Actors
          </Button>
          <Button color="inherit" component={RouterLink} to="/search">
            Search
          </Button>

          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                onClick={(e) => setMyStuffAnchor(e.currentTarget)}
                endIcon={<ArrowDropDownIcon />}
              >
                My Stuff
              </Button>
              <Menu
                anchorEl={myStuffAnchor}
                open={Boolean(myStuffAnchor)}
                onClose={closeAll}
              >
                <MenuItem
                  component={RouterLink}
                  to="/movies/favourites"
                  onClick={closeAll}
                >
                  Favourite Movies
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/actors/favourites"
                  onClick={closeAll}
                >
                  Favourite Actors
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/playlists"
                  onClick={closeAll}
                >
                  My Playlists
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/fantasy-movie"
                  onClick={closeAll}
                >
                  Fantasy Movie
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  Logout ({user?.userId})
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SiteHeader;
