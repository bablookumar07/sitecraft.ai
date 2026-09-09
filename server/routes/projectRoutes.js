import express from "express";

import {
  createProject,
  listProjects,
  getProject,
  deleteProject,
  updateProjectFiles,
  publishProject,
  getPublicProject,
  reviseProjectController,
} from "../controllers/projectController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const projectRouter = express.Router();

// ============================================================
// PUBLIC ROUTES
// ============================================================

// Get published project
// No authentication required
projectRouter.get(
  "/public/:id",
  getPublicProject
);


// ============================================================
// PROTECTED ROUTES
// ============================================================

projectRouter.use(authMiddleware);


// Create new AI project
// POST /api/projects
projectRouter.post(
  "/",
  createProject
);


// Get all projects of logged-in user
// GET /api/projects
projectRouter.get(
  "/",
  listProjects
);


// Get single project
// GET /api/projects/:id
projectRouter.get(
  "/:id",
  getProject
);


// Delete project
// DELETE /api/projects/:id
projectRouter.delete(
  "/:id",
  deleteProject
);


// Update project files
// PUT /api/projects/:id/files
projectRouter.put(
  "/:id/files",
  updateProjectFiles
);


// Publish project
// POST /api/projects/:id/publish
projectRouter.post(
  "/:id/publish",
  publishProject
);


// AI revision
// POST /api/projects/:id/revise
projectRouter.post(
  "/:id/revise",
  reviseProjectController
);


export default projectRouter;