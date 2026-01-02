import express from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";
import { requireOrgAccess } from "../middleware/orgMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  createTask,
  getOrgTasks
} from "../controllers/taskController.js";

const router = express.Router();

router.use(verifyAuth);

router.post(
  "/org/:orgId",
  requireOrgAccess,
  requireRole(["OWNER", "ADMIN", "MEMBER"]),
  createTask
);

router.get(
  "/org/:orgId",
  requireOrgAccess,
  getOrgTasks
);

export default router;
