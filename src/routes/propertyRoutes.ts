import express, { Router } from "express";
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesByOwner,
  getPropertiesByCity,
  // getPropertiesSearch,
  // findPropertiesByLocations,
} from "../controllers/PropertyController";

const router: Router = express.Router();

router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.post("/", createProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);
router.get("/owner/:ownerId", getPropertiesByOwner);
router.get("/city/:cityName", getPropertiesByCity);
// router.post("/search/:cityName/:contract/:type", getPropertiesSearch);
// router.post("/search/locations", findPropertiesByLocations);

export default router;