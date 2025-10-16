import type  { Request, Response } from "express";
import { Expense } from "models/expense.model";
import { authenticate } from "../middleware/authMiddleware";

interface AuthRequest extends Request {
  user?: { _id: string; email?: string }; // shape depends on your JWT payload
}

// CREATE
export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    // const expense = await Expense.create(req.body);
    // res.status(201).json(expense);

    
    const userId = req.user?._id; // from JWT middleware

    const expense = await Expense.create({
      ...req.body,
      userId,
    });

    res.status(201).json(expense);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// READ ALL
export const getExpenses = async (req: AuthRequest, res: Response) => {
  try {
    // const expenses = await Expense.find();
    const userId = req.user?._id;
    const expenses = await Expense.find({ userId });
    res.json(expenses);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
export const getExpense = async (req: AuthRequest, res: Response) => {
  try {
    // const expense = await Expense.findById(req.params.id);
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user?._id, // ensure it belongs to this user
    });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateExpense = async (req: AuthRequest, res: Response) => {
  try {
    // const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?._id },
      req.body,
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
export const deleteExpense = async (req: AuthRequest, res: Response) => {
  try {
    // const expense = await Expense.findByIdAndDelete(req.params.id);
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?._id,
    });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};