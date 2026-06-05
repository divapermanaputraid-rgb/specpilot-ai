import { Router } from "express";
import { createProject } from "../controllers/project.controller.js";

export const projectRouter = Router();

projectRouter.post("/create", createProject);
