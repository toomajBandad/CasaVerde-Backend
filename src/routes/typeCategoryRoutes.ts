import express, { Router } from "express";
import {
  getTypeCategories,
  getTypeCategoryById,
  createTypeCategory,
  updateTypeCategory,
  deleteTypeCategory,
} from "../controllers/typeCategoryController";

const router: Router = express.Router();

router.get("/", getTypeCategories);
router.get("/:id", getTypeCategoryById);
router.post("/", createTypeCategory);
router.put("/:id", updateTypeCategory);
router.delete("/:id", deleteTypeCategory);

export default router;