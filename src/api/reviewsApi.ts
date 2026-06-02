import type { Review } from "../types/movieTypes";
import { MOVIES_API_URL } from "../env";

export const getMovieReviews = async (movieId: number): Promise<Review[]> => {
  const res = await fetch(`${MOVIES_API_URL}/movies/${movieId}/reviews`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch reviews");
  return data.reviews as Review[];
};

export const addMovieReview = async (
  token: string,
  movieId: number,
  date: string,
  text: string,
) => {
  const res = await fetch(`${MOVIES_API_URL}/movies/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ movieId, date, text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add review");
  return data;
};

export const updateMovieReview = async (
  token: string,
  movieId: number,
  text: string,
) => {
  const res = await fetch(`${MOVIES_API_URL}/movies/${movieId}/reviews`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update review");
  return data;
};
