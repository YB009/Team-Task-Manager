import { Router } from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";
import {
  createOrganization,
  getMyOrganizations
} from "../controllers/orgController.js";

const router = Router();

router.post("/", verifyAuth, createOrganization);
router.get("/", verifyAuth, getMyOrganizations);

export default router;
