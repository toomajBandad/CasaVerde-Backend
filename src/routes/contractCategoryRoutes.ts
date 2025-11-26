import express, { Router } from "express";
import {
  getContractCategorys,
  getContractCategoryById,
  createContractCategory,
  updateContractCategory,
  deleteContractCategory,
} from "../controllers/contractCategoryController";

const router: Router = express.Router();

router.get("/", getContractCategorys);
router.get("/:id", getContractCategoryById);
router.post("/", createContractCategory);
router.put("/:id", updateContractCategory);
router.delete("/:id", deleteContractCategory);

export default router;