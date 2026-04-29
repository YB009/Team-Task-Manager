import axios from "axios";
import { instrumentAxios } from "@bugsense/bugsense-js";
import { bugsense } from "../utils/bugsense.js";

const isLocalDev =
  import.meta.env.DEV &&
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

const instance = axios.create({
  baseURL: isLocalDev ? "" : import.meta.env.VITE_API_URL || "http://localhost:3001",
  withCredentials: true,
  timeout: 15000,
});

if (bugsense) {
  instrumentAxios(instance, bugsense);
}

export default instance;

