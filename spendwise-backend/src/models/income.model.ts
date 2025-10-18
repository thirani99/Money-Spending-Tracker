import mongoose, { Schema, Document } from "mongoose";

export interface IIncome extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  income_source: string;
  amount: number;
  category: string;
  date: Date;
}

const IncomeSchema = new Schema<IIncome>({
   userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
  income_source: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true }
});

export const Income =mongoose.model<IIncome>("Income", IncomeSchema);