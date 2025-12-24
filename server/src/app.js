// server/src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"], // your Vite frontend
  credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));

// API routes
app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
