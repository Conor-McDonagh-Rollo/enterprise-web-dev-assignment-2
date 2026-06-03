import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import "./index.css";

import { AuthProvider } from "./contexts/AuthContext";
import { MoviesProvider } from "./contexts/MoviesContext";
import { ProtectedRoute } from "./components/protectedRoute/ProtectedRoute";
import SiteHeader from "./components/siteHeader/SiteHeader";
import HomePage from "./pages/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import ActorListPage from "./pages/ActorListPage";
import ActorDetailsPage from "./pages/ActorDetailsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false },
  },
});

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#e50914" },
    secondary: { main: "#f5c518" },
    background: { default: "#141414", paper: "#1c1c1c" },
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MoviesProvider>
          <BrowserRouter>
            <Box sx={{ minHeight: "100vh" }}>
              <SiteHeader />
              <Container component="main" sx={{ py: 4 }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />

                  <Route path="/movies/:id" element={<MovieDetailsPage />} />
                  <Route path="/actors" element={<ActorListPage />} />
                  <Route path="/actors/:id" element={<ActorDetailsPage />} />
                </Routes>
              </Container>
            </Box>
          </BrowserRouter>
        </MoviesProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ThemeProvider>
);

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
