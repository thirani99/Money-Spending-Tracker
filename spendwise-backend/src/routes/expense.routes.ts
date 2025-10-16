import { Router } from "express";
import {
  createExpense,
  // getExpense,
  getExpenses,
  updateExpense,
  deleteExpense
} from "../contoller/expenses.controller";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/post",authenticate, createExpense);
router.get("/get",authenticate, getExpenses);
// router.get("/get/:id",authenticate, getExpense);
router.put("/put/:id",authenticate, updateExpense);
router.delete("/delete/:id",authenticate, deleteExpense);

export default router;