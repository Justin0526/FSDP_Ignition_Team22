import express from "express";
import cors from "cors";

// ---- Routes ----
import sessionRoutes from "./routes/sessionRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import enquiryRoutes from "./routes/enquiryRoute.js";

// ---- Middleware ----
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

// Check server running
app.get("/", (req, res) => {
    res.send("Ignition backend is running");
});

// Session verification flow
app.use("/api/session", sessionRoutes);

// Category browsing
app.use("/api/categories", categoryRoutes);

// Chat
app.use("/api/chat", chatRoutes);

// Enquiry Route
app.use("/api/enquiries", enquiryRoutes);

// Global error handler MUST be last
app.use(errorHandler);

export default app;