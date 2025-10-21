import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  amount: number;
  category: string;
  date: Date;
}

const ExpenseSchema = new Schema<IExpense>({
   userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  // date: { type: Date, default: Date.now }
   date: { type: Date, required: true }
});

export const Expense =mongoose.model<IExpense>("Expense", ExpenseSchema);
