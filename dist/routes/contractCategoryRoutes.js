"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contractCategoryController_1 = require("../controllers/contractCategoryController");
const router = express_1.default.Router();
router.get("/", contractCategoryController_1.getContractCategorys);
router.get("/:id", contractCategoryController_1.getContractCategoryById);
router.post("/", contractCategoryController_1.createContractCategory);
router.put("/:id", contractCategoryController_1.updateContractCategory);
router.delete("/:id", contractCategoryController_1.deleteContractCategory);
exports.default = router;
//# sourceMappingURL=contractCategoryRoutes.js.map