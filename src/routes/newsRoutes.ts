import express, { Router } from "express";
import {
  getAllNews,
  getAllnewsCat,
  getNewsById,
  getAllNewsByCategory,
  createNews,
  editNews,
  deleteNews,
} from "../controllers/newsController";

const router: Router = express.Router();

router.get("/all", getAllNews);
router.get("/allnews/:id", getNewsById);
router.get("/allCat", getAllnewsCat);
router.get("/category/:categoryName", getAllNewsByCategory);
router.post("/", createNews);
router.put("/:id", editNews);
router.delete("/:id", deleteNews);

export default router;