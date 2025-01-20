import express from "express";

import { isAdminMiddleware } from "../middleware/middleware";
import { blockUser, deleteBlogByAdmin } from "../controllers/adminController";

const router = express.Router();

router.patch("/users/:userId/block", isAdminMiddleware, blockUser);
router.delete("/blogs/:id", isAdminMiddleware, deleteBlogByAdmin);

export const adminRouter = router;
