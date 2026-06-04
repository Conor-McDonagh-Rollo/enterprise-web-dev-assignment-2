# Enterprise Web Dev Assignment 2

A React and TypeScript movie browsing app using Vite, MUI, TanStack Query, React Router and integrates with TMDB API for movie and actor data, uses assignment 1 as backend for reviews and such.

## Development History

| #   | Commit                                                                                                                                                     | Description                                                                                                                                                                                                                          |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | [Initial boilerplate](https://github.com/Conor-McDonagh-Rollo/enterprise-web-dev-assignment-2/commit/138a8c79dc0b930792ad4d95f0bc081182801fdd)             | Vite and react template with mui, tanstack query and react router installed.                                                                                                                                                         |
| 2   | [API layer](https://github.com/Conor-McDonagh-Rollo/enterprise-web-dev-assignment-2/commit/3d349cd754ede98ef84098e7fcc61632e822b35d)                       | Added TMDB API client, auth API, movie reviews API and shared TypeScript types that are shared.. Movie, Actor, FantasyMovie, Playlist, and Review.                                                                                   |
| 3   | [React Query hooks](https://github.com/Conor-McDonagh-Rollo/enterprise-web-dev-assignment-2/commit/db14144ba7a86d7a839d485477511c39a892f539)               | Added custom hooks using tanstack query for movies and individual movie credits reviews, actors list, and actor details and credits. All queries have staleTime caching and enabled guards.                                          |
| 4   | [Context providers](https://github.com/Conor-McDonagh-Rollo/enterprise-web-dev-assignment-2/commit/d1a52e5b096446333a40e35c956e374eaa6e0c5a)               | Added AuthContext JWT-based login, register, logout with session storage and token expiry checking, and MoviesContext localStorage persisting favourites, ordered favourites, fantasy movies, and playlists.                         |
| 5   | [Core components and home page](https://github.com/Conor-McDonagh-Rollo/enterprise-web-dev-assignment-2/commit/8072bb73f819d02949ab2a65ccc00561b06ddac3)   | Added MovieCard, MovieList, FilterMoviesCard, ActorCard, SiteHeader, ProtectedRoute components. Added the home page showing popular movies with title, genre, and rating filtering.                                                  |
| 6   | [Movie and actor detail pages](https://github.com/Conor-McDonagh-Rollo/enterprise-web-dev-assignment-2/commit/50a0edf2b1c72680c4a9dc7f7a5933baef6267ae)    | Added MovieDetailsPage with backdrop, cast, similar movies, reviews, and a write a review part, ActorListPage , ActorDetailsPage, FavouriteMoviesPage, and FavouriteActorsPage which were all very similar.                          |
| 7   | [Auth pages and protected routes](https://github.com/Conor-McDonagh-Rollo/enterprise-web-dev-assignment-2/commit/25a0e7b5c86996e3cf5e8b90c96b0b3598d0bc64) | Added LoginPage that redirects after login, RegisterPage with auto login on success, and "My Stuff" routes behind ProtectedRoute for logged in users.                                                                                |
| 8   | [Multi-criteria search page](https://github.com/Conor-McDonagh-Rollo/enterprise-web-dev-assignment-2/commit/aea829164cda748f8c7d2319f8527ca506fc1b45)      | Added MovieSearchPage using TMDB Discover API. made sure filtering by genre, release year, minimum rating, original language , and sort order were options. Genre tags link directly to search page.                                 |
| 9   | [Fantasy movie page](https://github.com/Conor-McDonagh-Rollo/enterprise-web-dev-assignment-2/commit/ef7647b4150b9f1365615381bf749172f1a20c16)              | Added FantasyMoviePage for recording fantasy movies with title, overview, genres, release date, runtime, production company, a cast builder , and poster image upload. Fantasy movies are only persisted to localStorage though.     |
| 10  | [Playlists page](https://github.com/Conor-McDonagh-Rollo/enterprise-web-dev-assignment-2/commit/c5445bbe1dc75c9c0ae80760690b3045fc83878d)                  | Added PlaylistsPage to create movie playlists. Each playlist displays as a collapsible card showing its movies with poster, rating, and a remove button. Movies are added to playlists from any movie card with the playlist picker. |

## Running local

1. Copy `.env.example` to `.env` and fill in the values:
   ```
   VITE_TMDB_API_KEY= # API key from themoviedb.org
   VITE_AUTH_API_URL= # Auth API Gateway URL from Assignment 1
   VITE_MOVIES_API_URL= # API Gateway URL from Assignment 1
   ```
2. Install dependencies and start:
   ```bash
   npm install
   npm run dev
   ```
