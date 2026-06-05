import type { InterviewQuestionResponse } from "@specpilot/types";
import type { ApiRequestHandler } from "../types/api.js";
import { successResponse } from "../types/api.js";
import { interviewAnswerSchema, interviewQuestionSchema } from "../schemas/interview.schema.js";

const mockInterviewQuestion: InterviewQuestionResponse = {
  status: "asking",
  current_stage: "Defining Target Users",
  question: "Who is the primary user of this product?",
  reason: "Target user clarity is required before defining the MVP scope.",
  options: [
    { label: "End users / customers", value: "end_users" },
    { label: "Internal admin team", value: "internal_admin" },
    { label: "Both users and admins", value: "users_and_admins" },
    { label: "Custom", value: "custom" }
  ],
  allow_custom: true,
  completeness_score: 15
};

export const getInterviewQuestion: ApiRequestHandler = (req, res) => {
  interviewQuestionSchema.parse(req.body);

  res.json(successResponse(mockInterviewQuestion));
};

export const saveInterviewAnswer: ApiRequestHandler = (req, res) => {
  interviewAnswerSchema.parse(req.body);

  res.status(201).json(
    successResponse({
      answer_id: "mock-answer-id"
    })
  );
};
