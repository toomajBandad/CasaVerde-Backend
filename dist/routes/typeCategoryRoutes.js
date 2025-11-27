"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typeCategoryController_1 = require("../controllers/typeCategoryController");
const router = express_1.default.Router();
router.get("/", typeCategoryController_1.getTypeCategories);
router.get("/:id", typeCategoryController_1.getTypeCategoryById);
router.post("/", typeCategoryController_1.createTypeCategory);
router.put("/:id", typeCategoryController_1.updateTypeCategory);
router.delete("/:id", typeCategoryController_1.deleteTypeCategory);
exports.default = router;
//# sourceMappingURL=typeCategoryRoutes.js.map