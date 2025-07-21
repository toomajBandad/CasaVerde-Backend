const express = require("express");
const router = express.Router();

const {
  getContractCategorys,
  getContractCategoryById,
  createContractCategory,
  updateContractCategory,
  deleteContractCategory,
} = require("../controllers/contractCategoryController");

router.get("/", getContractCategorys);
router.get("/:id", getContractCategoryById);
router.post("/", createContractCategory);
router.put("/:id", updateContractCategory);
router.delete("/:id", deleteContractCategory);

module.exports = router;
