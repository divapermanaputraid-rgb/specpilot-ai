import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { healthRouter } from "./routes/health.routes.js";
import { interviewRouter } from "./routes/interview.routes.js";
import { prdRouter } from "./routes/prd.routes.js";
import { projectRouter } from "./routes/project.routes.js";

export const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));

app.use("/health", healthRouter);
app.use("/api/health", healthRouter);
app.use("/api/project", projectRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/prd", prdRouter);

app.use(notFound);
app.use(errorHandler);
