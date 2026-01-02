import express from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";
import { requireOrgAccess } from "../middleware/orgMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  createProject,
  getOrgProjects
} from "../controllers/projectController.js";

const router = express.Router();

router.use(verifyAuth);

router.post(
  "/org/:orgId",
  requireOrgAccess,
  requireRole(["OWNER", "ADMIN"]),
  createProject
);

router.get(
  "/org/:orgId",
  requireOrgAccess,
  getOrgProjects
);

export default router;
