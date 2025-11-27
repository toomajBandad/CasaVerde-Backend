"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PropertyController_1 = require("../controllers/PropertyController");
const router = express_1.default.Router();
router.get("/", PropertyController_1.getProperties);
router.get("/:id", PropertyController_1.getPropertyById);
router.post("/", PropertyController_1.createProperty);
router.put("/:id", PropertyController_1.updateProperty);
router.delete("/:id", PropertyController_1.deleteProperty);
router.get("/owner/:ownerId", PropertyController_1.getPropertiesByOwner);
router.get("/city/:cityName", PropertyController_1.getPropertiesByCity);
// router.post("/search/:cityName/:contract/:type", getPropertiesSearch);
// router.post("/search/locations", findPropertiesByLocations);
exports.default = router;
//# sourceMappingURL=propertyRoutes.js.map