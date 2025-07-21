const express = require("express");
const router = express.Router();

const {
  getAllRoom,
  getRoomsByUserId,
  createRoom,
  deleteRoom,
} = require("../controllers/roomController");

router.get("/all", getAllRoom);
router.get("/all/:userId", getRoomsByUserId);
router.post("/", createRoom);
router.delete("/:id", deleteRoom);

module.exports = router;
