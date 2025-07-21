const express = require("express");
const router = express.Router();

const {
  getAllCity,
  getCityById,
  getAllCityByProvince,
  createCity,
  editCity,
  deleteCity,
  searchCityByName,
} = require("../controllers/cityController");

router.get("/all", getAllCity);
router.get("/all/:id", getCityById);
router.get("/province/:proName", getAllCityByProvince);
router.post("/", createCity);
router.put("/:id", editCity);
router.delete("/:id", deleteCity);
router.get("/search/:name", searchCityByName);

module.exports = router;
