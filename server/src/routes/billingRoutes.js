import express from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";
import {
	getBillingInfo,
} from "../controllers/billingController.js";

const router = express.Router();

router.use(verifyAuth);

router.get("/", getBillingInfo);

export default router;

