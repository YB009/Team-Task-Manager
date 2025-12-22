import express from "express";
import session from "express-session";
import authRoutes from "./src/routes/authRoutes.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);


app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log("AUTH server running on port " + port);
});
