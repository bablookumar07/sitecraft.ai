import axios from "axios";

const configuredBaseURL =
  import.meta.env.VITE_API_URL?.trim() ||
  "https://sitecraft-ai.onrender.com";

const baseURL = configuredBaseURL.endsWith("/api")
  ? configuredBaseURL
  : `${configuredBaseURL.replace(/\/+$/, "")}/api`;

const API = axios.create({
  baseURL,
  withCredentials: true,
});

export default API;