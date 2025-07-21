const express = require("express");
const router = express.Router();

const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesByOwner,
  getPropertiesByCity,
  getPropertiesSearch,
  findPropertiesByLocations,
} = require("../controllers/PropertyController");

router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.post("/", createProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);
router.get("/owner/:ownerId", getPropertiesByOwner);
router.get("/city/:cityName", getPropertiesByCity);
router.post("/search/:cityName/:contract/:type", getPropertiesSearch);
router.post("/search/locations", findPropertiesByLocations);

module.exports = router;
