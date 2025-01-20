import express, { Application, Request, Response } from "express";
import cors from "cors";
import { adminRouter } from "./app/routes/adminRoute";
import { authRouter } from "./app/routes/authRoute";
import { blogRouter } from "./app/routes/blogsRoute";
import { errorHandler } from "./app/errorHandler";

const app: Application = express();

// middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/blogs", blogRouter);

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome");
  console.log(`Incoming ${req.method} request to ${req.url}`);
  console.log("Request body:", req.body);
  // next();
});

// Global error handler

app.use(errorHandler);
console.log(`Current working directory: ${process.cwd()}`);

export default app;
