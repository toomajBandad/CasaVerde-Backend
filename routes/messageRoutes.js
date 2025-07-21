const express = require("express");
const router = express.Router();

const {
  getAllMessage,
  getMessagesByUSerId,
  getMessagesByRoomId,
  createMessage,
  deleteMessage,
} = require("../controllers/messageController");

router.get("/all", getAllMessage);
router.get("/all/:userId", getMessagesByUSerId);
router.get("/room/:roomId", getMessagesByRoomId);
router.post("/", createMessage);
router.delete("/:id", deleteMessage);

module.exports = router;
