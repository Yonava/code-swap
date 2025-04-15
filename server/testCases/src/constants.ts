export const LOCALHOST_PORT = 3002;

export const CHALLENGE_LOCALHOST_PORT = 3001;

export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.API_URL || "example.com" // need actual url
    : `http://localhost:${CHALLENGE_LOCALHOST_PORT}`;
