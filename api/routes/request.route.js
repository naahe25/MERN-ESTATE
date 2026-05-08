import express from "express";
import {
  createRequest,
  getSellerRequests,
  markRequestRead,
} from "../controllers/request.controller.js";
import { verifyToken } from "../utils/VerifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createRequest);
router.get("/seller", verifyToken, getSellerRequests);
router.patch("/:id/read", verifyToken, markRequestRead);

export default router;
