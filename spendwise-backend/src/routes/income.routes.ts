import { Router } from "express";
import {
  createIncome,
  getIncome,
  updateIncome,
  deleteIncome
} from "../contoller/income.controller";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/post",authenticate, createIncome);
router.get("/get",authenticate, getIncome);
router.put("/put/:id",authenticate, updateIncome);
router.delete("/delete/:id",authenticate, deleteIncome);

export default router;
