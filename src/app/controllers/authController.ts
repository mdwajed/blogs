import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { successResponse, errorResponse } from "../utils/response";
import { User } from "../models/Models";

dotenv.config();
// Ensure the JWT_SECRET is present
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

// Register User
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json(errorResponse("User already exists"));
      return;
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json(
      successResponse("User registered successfully", {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      })
    );
  } catch (error) {
    res.status(500).json(errorResponse("Internal Server Error", error));
  }
};

// Login User
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json(errorResponse("Invalid credentials"));
      return;
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json(errorResponse("Invalid credentials"));
      return;
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json(successResponse("Login successful", { token }));
  } catch (error) {
    res.status(500).json(errorResponse("Internal Server Error", error));
  }
};
