import express from "express";
import { authMiddleware } from "../middleware/middleware";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  updateBlog,
} from "../controllers/blogController";

const router = express.Router();

router.post("/", authMiddleware, createBlog);
router.patch("/:id", authMiddleware, updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);
router.get("/", getAllBlogs);

export const blogRouter = router;
