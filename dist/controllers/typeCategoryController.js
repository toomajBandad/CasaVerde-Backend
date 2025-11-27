"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTypeCategory = exports.updateTypeCategory = exports.createTypeCategory = exports.getTypeCategoryById = exports.getTypeCategories = void 0;
const typeCategoryModel_1 = __importDefault(require("../models/typeCategoryModel"));
// Get all type categories
const getTypeCategories = async (req, res) => {
    try {
        const typeCategories = await typeCategoryModel_1.default.find({});
        res.json(typeCategories);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getTypeCategories = getTypeCategories;
// Get type category by ID
const getTypeCategoryById = async (req, res) => {
    try {
        const typeCategory = await typeCategoryModel_1.default.findById(req.params.id);
        if (!typeCategory) {
            res.status(404).json({ msg: "TypeCategory not found" });
            return;
        }
        res.json(typeCategory);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getTypeCategoryById = getTypeCategoryById;
// Create a new type category
const createTypeCategory = async (req, res) => {
    try {
        const { name, desc } = req.body;
        if (!name || !desc) {
            res.status(400).json({ msg: "Error: name or desc missing" });
            return;
        }
        const newCategory = await typeCategoryModel_1.default.create({ name, desc });
        res.status(201).json({
            msg: "TypeCategory created successfully",
            id: newCategory._id,
        });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.createTypeCategory = createTypeCategory;
// Update type category
const updateTypeCategory = async (req, res) => {
    try {
        const { name, desc } = req.body;
        if (!name || !desc) {
            res.status(400).json({ msg: "Error: name or desc missing" });
            return;
        }
        const typeCategory = await typeCategoryModel_1.default.findByIdAndUpdate(req.params.id, { name, desc }, { new: true });
        if (!typeCategory) {
            res.status(404).json({ msg: "TypeCategory not found" });
            return;
        }
        res.json({ msg: "TypeCategory updated successfully", typeCategory });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.updateTypeCategory = updateTypeCategory;
// Delete type category
const deleteTypeCategory = async (req, res) => {
    try {
        const typeCategory = await typeCategoryModel_1.default.findByIdAndDelete(req.params.id);
        if (!typeCategory) {
            res.status(404).json({ msg: "TypeCategory not found" });
            return;
        }
        res.json({ msg: "TypeCategory deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.deleteTypeCategory = deleteTypeCategory;
//# sourceMappingURL=typeCategoryController.js.map