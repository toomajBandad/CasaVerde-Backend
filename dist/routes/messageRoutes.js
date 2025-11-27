"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = require("../controllers/messageController");
const router = express_1.default.Router();
router.get("/all", messageController_1.getAllMessage);
router.get("/all/:userId", messageController_1.getMessagesByUserId);
router.get("/room/:roomId", messageController_1.getMessagesByRoomId);
router.post("/", messageController_1.createMessage);
router.delete("/:id", messageController_1.deleteMessage);
exports.default = router;
//# sourceMappingURL=messageRoutes.js.map