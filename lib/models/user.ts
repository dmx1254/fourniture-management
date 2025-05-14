import mongoose, { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  phone: string;
  firstname: string;
  lastname: string;
  occupation: string;
  identicationcode: string;
  role: string;
  password: string;
}

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  occupation: { type: String, required: true },
  identicationcode: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
});

const UserPMN =
  mongoose.models.pmnuser || mongoose.model<IUser>("pmnuser", userSchema);

export default UserPMN;
