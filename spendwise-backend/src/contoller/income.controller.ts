import type  { Request, Response } from "express";
import { Income } from "models/income.model";
import { authenticate } from "../middleware/authMiddleware";

interface AuthRequest extends Request {
  user?: { _id: string; email?: string }; // shape depends on your JWT payload
}

// CREATE-INCOME
export const createIncome = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id; // from JWT middleware

    const income = await Income.create({
      ...req.body,
      userId,
    });

    res.status(201).json(income);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// READ ALL - iNCOME
export const getIncome = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const income = await Income.find({ userId });
    res.json(income);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE-Income
export const updateIncome = async (req: AuthRequest, res: Response) => {
  try {
    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?._id },
      req.body,
      { new: true }
    );
    if (!income) return res.status(404).json({ message: "Expense not found" });
    res.json(income);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


// DELETE-INCOME
export const deleteIncome = async (req: AuthRequest, res: Response) => {
  try {
   const income = await Income.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?._id,
    });
    if (!income) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};