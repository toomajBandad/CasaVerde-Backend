import express, { Router } from "express";
import {
  getAllCity,
  getCityById,
  getAllCityByProvince,
  createCity,
  editCity,
  deleteCity,
  searchCityByName,
} from "../controllers/cityController";

const router: Router = express.Router();

router.get("/all", getAllCity);
router.get("/all/:id", getCityById);
router.get("/province/:proName", getAllCityByProvince);
router.post("/", createCity);
router.put("/:id", editCity);
router.delete("/:id", deleteCity);
router.get("/search/:name", searchCityByName);

export default router;