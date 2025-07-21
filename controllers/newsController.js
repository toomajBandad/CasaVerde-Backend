const News = require("../models/newsModel");

const getAllNews = async (req, res) => {
  try {
    const newses = await News.find({});
    res.json(newses);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
const getAllnewsCat = async (req, res) => {
  try {
    let newsCats = [];
    const newses = await News.find({});
    newses.map((item) => {
      newsCats.push(item.category);
    });
    uniq = [...new Set(newsCats)];
    res.json(uniq);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ msg: "News not found !" });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getAllNewsByCategory = async (req, res) => {
  try {
    const newsesArr = await News.find({ category: req.params.categoryName });
    if (!newsesArr.length) {
      return res.status(404).json({ msg: "no News found in this category !" });
    }
    return res.status(200).json(newsesArr);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createNews = async (req, res) => {
  try {
    const { category, mainTitle, items } = req.body;

    if (!category || !mainTitle || !items) {
      return res
        .status(400)
        .json({ msg: "error with  items, mainTitle or category" });
    }

    const newNews = await News.create({
      category: category,
      mainTitle: mainTitle,
      items: items,
    });
    res.status(201).json({
      msg: "new News created successfully",
      news: newNews,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const editNews = async (req, res) => {
  try {
    const { category, mainTitle, items } = req.body;

    if (!category || !items || !mainTitle) {
      return res
        .status(400)
        .json({ msg: "error with  items, mainTitle or category" });
    }

    const news = await News.findByIdAndUpdate(
      req.params.id,
      { category, mainTitle, items },
      { new: true }
    );
    if (!news) {
      return res.status(404).json({ msg: "News did not find ! " });
    }
    res.status(201).json({ msg: " News updated successfully", news });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      return res.status(404).json({ msg: "News did not find !" });
    }

    res.status(200).json({ msg: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getAllNews,
  getAllnewsCat,
  getNewsById,
  getAllNewsByCategory,
  createNews,
  editNews,
  deleteNews,
};
