import { Router } from "express";
import {
  createExpense,
  // getExpense,
  getExpenses,
  updateExpense,
  deleteExpense
} from "../contoller/expenses.controller";

const router = Router();

router.post("/post", createExpense);
router.get("/get", getExpenses);
// router.get("/get/:id", getExpense);
router.put("/put/:id", updateExpense);
router.delete("/delete/:id", deleteExpense);

export default router;