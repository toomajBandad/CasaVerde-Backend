"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.get("/all", userController_1.getUsers);
router.get("/me", userController_1.getMe);
router.get("/:id", userController_1.getUserById);
router.post("/newUser", userController_1.createUser);
router.put("/:id", userController_1.updateUser);
router.delete("/:id", userController_1.deleteUser);
router.post("/login", userController_1.loginUser);
router.post("/fotoEdit", userController_1.changeAvatar);
router.get("/search/:userName", userController_1.searchUsersByName);
router.get("/favorite/:userId", userController_1.getUserFavorite);
router.post("/favorite/:userId", userController_1.addUserFavorite);
router.delete("/favorite/:userId", userController_1.deleteUserFavorite);
router.post("/sendMail", userController_1.sendMail);
router.post("/contactUs", userController_1.contactUs);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map