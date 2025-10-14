import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password?: string; // optional — usually not stored in DB
  gender: "male" | "female" | "other"; // restricts values

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    confirm_password: { type: String, required: false },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
  },
  { timestamps: true }

);

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};


export const User = model<IUser>("User", userSchema);
