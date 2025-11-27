"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCityByName = exports.deleteCity = exports.editCity = exports.createCity = exports.getAllCityByProvince = exports.getCityById = exports.getAllCity = void 0;
const cityModel_1 = __importDefault(require("../models/cityModel"));
// Get all cities
const getAllCity = async (req, res) => {
    try {
        const cities = await cityModel_1.default.find({});
        res.json(cities);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getAllCity = getAllCity;
// Get city by ID
const getCityById = async (req, res) => {
    try {
        const city = await cityModel_1.default.findById(req.params.id);
        if (!city) {
            res.status(404).json({ msg: "City not found!" });
            return;
        }
        res.json(city);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getCityById = getCityById;
// Get all cities by province
const getAllCityByProvince = async (req, res) => {
    try {
        const citiesArr = await cityModel_1.default.find({ province: req.params.proName });
        if (!citiesArr.length) {
            res.status(404).json({ msg: "No city found in this province!" });
            return;
        }
        res.status(200).json(citiesArr);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getAllCityByProvince = getAllCityByProvince;
// Create a new city
const createCity = async (req, res) => {
    try {
        const { province, name } = req.body;
        if (!province || !name) {
            res.status(400).json({ msg: "Error with name or province" });
            return;
        }
        const newCity = await cityModel_1.default.create({ province, name });
        res.status(201).json({
            msg: "New city created successfully",
            city: newCity,
        });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.createCity = createCity;
// Edit city
const editCity = async (req, res) => {
    try {
        const { province, name } = req.body;
        if (!province || !name) {
            res.status(400).json({ msg: "Error with name or province" });
            return;
        }
        const city = await cityModel_1.default.findByIdAndUpdate(req.params.id, { province, name }, { new: true });
        if (!city) {
            res.status(404).json({ msg: "City not found!" });
            return;
        }
        res.status(201).json({ msg: "City updated successfully", city });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.editCity = editCity;
// Delete city
const deleteCity = async (req, res) => {
    try {
        const city = await cityModel_1.default.findByIdAndDelete(req.params.id);
        if (!city) {
            res.status(404).json({ msg: "City not found!" });
            return;
        }
        res.status(200).json({ msg: "City deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.deleteCity = deleteCity;
// Search city by name
const searchCityByName = async (req, res) => {
    try {
        const city = await cityModel_1.default.findOne({ name: req.params.name });
        if (!city) {
            res.status(404).json({ msg: "City not found!" });
            return;
        }
        res.status(200).json({ msg: "City found successfully", city });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.searchCityByName = searchCityByName;
//# sourceMappingURL=cityController.js.map