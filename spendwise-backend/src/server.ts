import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import expenseRoutes from "./routes/expense.routes";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/expenses", expenseRoutes);
app.use("/api", authRoutes);

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

