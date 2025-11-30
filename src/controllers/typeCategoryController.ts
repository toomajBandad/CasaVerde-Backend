import { Request, Response } from "express";
import TypeCategory from "../models/typeCategoryModel";

// Get all type categories
export const getTypeCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const typeCategories = await TypeCategory.find({});
    res.status(200).json({
      msg: "Fetched type categories successfully",
      typeCategories,
    });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Get type category by ID
export const getTypeCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const typeCategory = await TypeCategory.findById(req.params.id);

    if (!typeCategory) {
      res.status(404).json({ msg: "TypeCategory not found" });
      return;
    }

    res.status(200).json({
      msg: "Fetched type category successfully",
      typeCategory,
    });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Create a new type category
export const createTypeCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, desc } = req.body as { name: string; desc: string };

    if (!name || !desc) {
      res.status(400).json({ msg: "Error: name or desc missing" });
      return;
    }

    const newCategory = await TypeCategory.create({ name, desc });

    res.status(201).json({
      msg: "TypeCategory created successfully",
      typeCategory: newCategory,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ msg: "TypeCategory name must be unique" });
      return;
    }
    res.status(500).json({ msg: error.message });
  }
};

// Update type category
export const updateTypeCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, desc } = req.body as { name?: string; desc?: string };

    const updateData: any = {};
    if (name) updateData.name = name;
    if (desc) updateData.desc = desc;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ msg: "No valid fields provided for update" });
      return;
    }

    const typeCategory = await TypeCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!typeCategory) {
      res.status(404).json({ msg: "TypeCategory not found" });
      return;
    }

    res.status(200).json({
      msg: "TypeCategory updated successfully",
      typeCategory,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ msg: "TypeCategory name must be unique" });
      return;
    }
    res.status(500).json({ msg: error.message });
  }
};

// Delete type category
export const deleteTypeCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const typeCategory = await TypeCategory.findByIdAndDelete(req.params.id);

    if (!typeCategory) {
      res.status(404).json({ msg: "TypeCategory not found" });
      return;
    }

    res.status(200).json({
      msg: "TypeCategory deleted successfully",
      typeCategory,
    });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};