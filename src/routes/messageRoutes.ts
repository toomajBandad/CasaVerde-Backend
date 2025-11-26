import express, { Router } from "express";
import {
  getAllMessage,
  getMessagesByUserId,
  getMessagesByRoomId,
  createMessage,
  deleteMessage,
} from "../controllers/messageController";

const router: Router = express.Router();

router.get("/all", getAllMessage);
router.get("/all/:userId", getMessagesByUserId);
router.get("/room/:roomId", getMessagesByRoomId);
router.post("/", createMessage);
router.delete("/:id", deleteMessage);

export default router;