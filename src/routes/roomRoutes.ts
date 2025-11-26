import express, { Router } from "express";
import {
  getAllRoom,
  getRoomsByUserId,
  createRoom,
  deleteRoom,
} from "../controllers/roomController";

const router: Router = express.Router();

router.get("/all", getAllRoom);
router.get("/all/:userId", getRoomsByUserId);
router.post("/", createRoom);
router.delete("/:id", deleteRoom);

export default router;