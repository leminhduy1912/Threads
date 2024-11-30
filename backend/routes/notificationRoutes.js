import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { createNotification, deleteNotification, getNotifications, markAsSeen } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/:notiId", protectRoute, deleteNotification);
router.post("/", protectRoute, createNotification);
router.put("/markAsSeen/notiId", protectRoute, markAsSeen);

export default router;