"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const newsController_1 = require("../controllers/newsController");
const router = express_1.default.Router();
router.get("/all", newsController_1.getAllNews);
router.get("/allnews/:id", newsController_1.getNewsById);
router.get("/allCat", newsController_1.getAllnewsCat);
router.get("/category/:categoryName", newsController_1.getAllNewsByCategory);
router.post("/", newsController_1.createNews);
router.put("/:id", newsController_1.editNews);
router.delete("/:id", newsController_1.deleteNews);
exports.default = router;
//# sourceMappingURL=newsRoutes.js.map