import express, { Router } from "express";
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesByOwner,
  getPropertiesByCity,
  getPropertiesSearch,
  // findPropertiesByLocations,
} from "../controllers/PropertyController";

const router: Router = express.Router();

router.get("/", getProperties);

router.get("/owner/:ownerId", getPropertiesByOwner);
router.get("/city/:cityName", getPropertiesByCity);
router.get("/search", getPropertiesSearch);

router.get("/:id", getPropertyById);
router.post("/", createProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);

// router.post("/search/locations", findPropertiesByLocations);

export default router;
