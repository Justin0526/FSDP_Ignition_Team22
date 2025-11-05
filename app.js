import express from "express";
import dotenv from "dotenv";
import customerRoutes from "./routes/customer_routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use("/api/customers", customerRoutes);

app.get("/", (req, res) => res.send("OCBC Backend is running"));
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


