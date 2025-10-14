import type  { Request, Response } from "express";
import { Expense } from "models/expense.model";



// CREATE
export const createExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// READ ALL
export const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
export const getExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};