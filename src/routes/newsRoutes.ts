import express, { Router } from "express";
import {
  getAllNews,
  getAllNewsCat,
  getNewsById,
  getAllNewsByCategory,
  createNews,
  editNews,
  deleteNews,
} from "../controllers/newsController";

const router: Router = express.Router();

router.get("/categories", getAllNewsCat);
router.get("/category/:categoryName", getAllNewsByCategory);
router.get("/:id", getNewsById);
router.get("/", getAllNews);
router.post("/", createNews);
router.put("/:id", editNews);
router.delete("/:id", deleteNews);

export default router;