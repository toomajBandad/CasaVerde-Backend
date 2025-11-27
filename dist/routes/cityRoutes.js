"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cityController_1 = require("../controllers/cityController");
const router = express_1.default.Router();
router.get("/all", cityController_1.getAllCity);
router.get("/all/:id", cityController_1.getCityById);
router.get("/province/:proName", cityController_1.getAllCityByProvince);
router.post("/", cityController_1.createCity);
router.put("/:id", cityController_1.editCity);
router.delete("/:id", cityController_1.deleteCity);
router.get("/search/:name", cityController_1.searchCityByName);
exports.default = router;
//# sourceMappingURL=cityRoutes.js.map