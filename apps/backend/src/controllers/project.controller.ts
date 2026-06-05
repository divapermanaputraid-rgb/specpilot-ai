import type { ApiRequestHandler } from "../types/api.js";
import { successResponse } from "../types/api.js";
import { createProjectSchema } from "../schemas/project.schema.js";

export const createProject: ApiRequestHandler = (req, res) => {
  const input = createProjectSchema.parse(req.body);

  res.status(201).json(
    successResponse({
      project_id: "mock-project-id",
      session_id: input.session_id
    })
  );
};
