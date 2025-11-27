"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roomController_1 = require("../controllers/roomController");
const router = express_1.default.Router();
router.get("/all", roomController_1.getAllRoom);
router.get("/all/:userId", roomController_1.getRoomsByUserId);
router.post("/", roomController_1.createRoom);
router.delete("/:id", roomController_1.deleteRoom);
exports.default = router;
//# sourceMappingURL=roomRoutes.js.map