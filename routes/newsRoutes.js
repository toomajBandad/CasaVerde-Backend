const express = require("express");
const router = express.Router();

const {
  getAllNews,
  getAllnewsCat,
  getNewsById,
  getAllNewsByCategory,
  createNews,
  editNews,
  deleteNews,
} = require("../controllers/newsController");

router.get("/all", getAllNews);
router.get("/allnews/:id", getNewsById);
router.get("/allCat", getAllnewsCat);
router.get("/category/:categoryName", getAllNewsByCategory);
router.post("/", createNews);
router.put("/:id", editNews);
router.delete("/:id", deleteNews);

module.exports = router;
