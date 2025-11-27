"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNews = exports.editNews = exports.createNews = exports.getAllNewsByCategory = exports.getNewsById = exports.getAllnewsCat = exports.getAllNews = void 0;
const newsModel_1 = __importDefault(require("../models/newsModel"));
// Get all news
const getAllNews = async (req, res) => {
    try {
        const newses = await newsModel_1.default.find({});
        res.json(newses);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getAllNews = getAllNews;
// Get all unique news categories
const getAllnewsCat = async (req, res) => {
    try {
        const newses = await newsModel_1.default.find({});
        const newsCats = newses.map((item) => item.category);
        const uniq = [...new Set(newsCats)];
        res.json(uniq);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getAllnewsCat = getAllnewsCat;
// Get news by ID
const getNewsById = async (req, res) => {
    try {
        const news = await newsModel_1.default.findById(req.params.id);
        if (!news) {
            res.status(404).json({ msg: "News not found!" });
            return;
        }
        res.json(news);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getNewsById = getNewsById;
// Get all news by category
const getAllNewsByCategory = async (req, res) => {
    try {
        const newsesArr = await newsModel_1.default.find({ category: req.params.categoryName });
        if (!newsesArr.length) {
            res.status(404).json({ msg: "No news found in this category!" });
            return;
        }
        res.status(200).json(newsesArr);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getAllNewsByCategory = getAllNewsByCategory;
// Create a new news entry
const createNews = async (req, res) => {
    try {
        const { category, mainTitle, items } = req.body;
        if (!category || !mainTitle || !items) {
            res.status(400).json({ msg: "Error with items, mainTitle or category" });
            return;
        }
        const newNews = await newsModel_1.default.create({
            category,
            mainTitle,
            items,
        });
        res.status(201).json({
            msg: "New news created successfully",
            news: newNews,
        });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.createNews = createNews;
// Edit news
const editNews = async (req, res) => {
    try {
        const { category, mainTitle, items } = req.body;
        if (!category || !items || !mainTitle) {
            res.status(400).json({ msg: "Error with items, mainTitle or category" });
            return;
        }
        const news = await newsModel_1.default.findByIdAndUpdate(req.params.id, { category, mainTitle, items }, { new: true });
        if (!news) {
            res.status(404).json({ msg: "News not found!" });
            return;
        }
        res.status(201).json({ msg: "News updated successfully", news });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.editNews = editNews;
// Delete news
const deleteNews = async (req, res) => {
    try {
        const news = await newsModel_1.default.findByIdAndDelete(req.params.id);
        if (!news) {
            res.status(404).json({ msg: "News not found!" });
            return;
        }
        res.status(200).json({ msg: "News deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.deleteNews = deleteNews;
//# sourceMappingURL=newsController.js.map