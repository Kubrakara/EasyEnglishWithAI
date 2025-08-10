import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes";
import apiRoutes from "./routes/api.routes"; // Import the new API routes

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/api", apiRoutes); // Use the new API routes under the /api prefix

export default app;
