import { Router } from "express";
import { generatePrd, getPrd } from "../controllers/prd.controller.js";

export const prdRouter = Router();

prdRouter.post("/generate", generatePrd);
prdRouter.get("/:session_id", getPrd);
