import { Request, Response } from "express";
import News from "../models/newsModel";

// Get all news
export const getAllNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const newses = await News.find({});
    res.json(newses);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Get all unique news categories
export const getAllnewsCat = async (req: Request, res: Response): Promise<void> => {
  try {
    const newses = await News.find({});
    const newsCats = newses.map((item) => item.category);
    const uniq = [...new Set(newsCats)];
    res.json(uniq);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Get news by ID
export const getNewsById = async (req: Request, res: Response): Promise<void> => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      res.status(404).json({ msg: "News not found!" });
      return;
    }
    res.json(news);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Get all news by category
export const getAllNewsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const newsesArr = await News.find({ category: req.params.categoryName });
    if (!newsesArr.length) {
      res.status(404).json({ msg: "No news found in this category!" });
      return;
    }
    res.status(200).json(newsesArr);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Create a new news entry
export const createNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, mainTitle, items } = req.body;

    if (!category || !mainTitle || !items) {
      res.status(400).json({ msg: "Error with items, mainTitle or category" });
      return;
    }

    const newNews = await News.create({
      category,
      mainTitle,
      items,
    });

    res.status(201).json({
      msg: "New news created successfully",
      news: newNews,
    });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Edit news
export const editNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, mainTitle, items } = req.body;

    if (!category || !items || !mainTitle) {
      res.status(400).json({ msg: "Error with items, mainTitle or category" });
      return;
    }

    const news = await News.findByIdAndUpdate(
      req.params.id,
      { category, mainTitle, items },
      { new: true }
    );

    if (!news) {
      res.status(404).json({ msg: "News not found!" });
      return;
    }

    res.status(201).json({ msg: "News updated successfully", news });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete news
export const deleteNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      res.status(404).json({ msg: "News not found!" });
      return;
    }

    res.status(200).json({ msg: "News deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};