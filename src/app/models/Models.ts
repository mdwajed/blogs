import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the User schema
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create the User model
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export interface IBlog extends Document {
  title: string;
  content: string;
  author: mongoose.Schema.Types.ObjectId;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create the Blog model
const BlogSchema: Schema<IBlog> = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
