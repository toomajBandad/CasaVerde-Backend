"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContractCategory = exports.updateContractCategory = exports.createContractCategory = exports.getContractCategoryById = exports.getContractCategorys = void 0;
const contractCategoryModel_1 = __importDefault(require("../models/contractCategoryModel"));
// Get all contract categories
const getContractCategorys = async (req, res) => {
    try {
        const contractCategories = await contractCategoryModel_1.default.find({});
        res.json(contractCategories);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getContractCategorys = getContractCategorys;
// Get contract category by ID
const getContractCategoryById = async (req, res) => {
    try {
        const contractCategory = await contractCategoryModel_1.default.findById(req.params.id);
        if (!contractCategory) {
            res.status(404).json({ msg: "ContractCategory not found" });
            return;
        }
        res.json(contractCategory);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getContractCategoryById = getContractCategoryById;
// Create a new contract category
const createContractCategory = async (req, res) => {
    try {
        const { name, desc } = req.body;
        if (!name || !desc) {
            res.status(400).json({ msg: "Error on name or desc" });
            return;
        }
        const newCategory = await contractCategoryModel_1.default.create({ name, desc });
        res.status(201).json({
            msg: "ContractCategory created successfully",
            id: newCategory._id,
        });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.createContractCategory = createContractCategory;
// Update contract category
const updateContractCategory = async (req, res) => {
    try {
        const { name, desc } = req.body;
        if (!name || !desc) {
            res.status(400).json({ msg: "Error on name or desc" });
            return;
        }
        const contractCategory = await contractCategoryModel_1.default.findByIdAndUpdate(req.params.id, { name, desc }, { new: true });
        if (!contractCategory) {
            res.status(404).json({ msg: "ContractCategory not found" });
            return;
        }
        res.json({ msg: "ContractCategory edited", contractCategory });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.updateContractCategory = updateContractCategory;
// Delete contract category
const deleteContractCategory = async (req, res) => {
    try {
        const contractCategory = await contractCategoryModel_1.default.findByIdAndDelete(req.params.id);
        if (!contractCategory) {
            res.status(404).json({ msg: "ContractCategory not found" });
            return;
        }
        res.json({ msg: "ContractCategory deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.deleteContractCategory = deleteContractCategory;
//# sourceMappingURL=contractCategoryController.js.map