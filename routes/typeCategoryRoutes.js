const express = require("express");
const router = express.Router();

const {
  getTypeCategorys,
  getTypeCategoryById,
  createTypeCategory,
  updateTypeCategory,
  deleteTypeCategory,
} = require("../controllers/typeCategoryController");

router.get("/", getTypeCategorys);
router.get("/:id", getTypeCategoryById);
router.post("/", createTypeCategory);
router.put("/:id", updateTypeCategory);
router.delete("/:id", deleteTypeCategory);

module.exports = router;
