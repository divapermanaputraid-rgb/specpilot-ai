import { Router } from "express";
import { getInterviewQuestion, saveInterviewAnswer } from "../controllers/interview.controller.js";

export const interviewRouter = Router();

interviewRouter.post("/question", getInterviewQuestion);
interviewRouter.post("/answer", saveInterviewAnswer);
