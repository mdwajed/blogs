import { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/response";
import { isErrorWithMessage, NotFoundError } from "../utils/errors";
import { Blog, User } from "../models/Models";

// Block User
export const blockUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) throw new NotFoundError("User not found");

    user.isBlocked = true;
    await user.save();

    res.status(200).json(successResponse("User blocked successfully"));
  } catch (error) {
    if (isErrorWithMessage(error)) {
      res.status(500).json(errorResponse("Internal Server Error", error));
    } else {
      res.status(500).json(errorResponse("An unknown error occurred"));
    }
  }
};

// Delete Blog (Admin)
export const deleteBlogByAdmin = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) throw new NotFoundError("Blog not found");

    await blog.deleteOne();

    res.status(200).json(successResponse("Blog deleted successfully"));
  } catch (error) {
    if (isErrorWithMessage(error)) {
      res.status(500).json(errorResponse("Internal Server Error", error));
    } else {
      res.status(500).json(errorResponse("An unknown error occurred"));
    }
  }
};
