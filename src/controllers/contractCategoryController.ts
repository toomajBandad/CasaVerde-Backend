import { Request, Response } from "express";
import ContractCategory from "../models/contractCategoryModel";

// Get all contract categories
export const getContractCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contractCategories = await ContractCategory.find({});
    res.status(200).json({
      msg: "Fetched contract categories successfully",
      contractCategories,
    });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Get contract category by ID
export const getContractCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contractCategory = await ContractCategory.findById(req.params.id);

    if (!contractCategory) {
      res.status(404).json({ msg: "ContractCategory not found" });
      return;
    }

    res.status(200).json({
      msg: "Fetched contract category successfully",
      contractCategory,
    });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Create a new contract category
export const createContractCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, desc } = req.body;

    if (!name || !desc) {
      res.status(400).json({ msg: "Error on name or desc" });
      return;
    }

    const allowedNames = ["BUY", "RENT", "SHARE"];

    if (!allowedNames.includes(name)) {
      res.status(400).json({ msg: "Error on name selecting" });
      return;
    }

    const newCategory = await ContractCategory.create({ name, desc });

    res.status(201).json({
      msg: "ContractCategory created successfully",
      contractCategory: newCategory,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ msg: "ContractCategory name must be unique" });
      return;
    }
    res.status(500).json({ msg: error.message });
  }
};

// Update contract category
export const updateContractCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, desc } = req.body;

    const allowedNames = ["BUY", "RENT", "SHARE"];

    // Validate name only if provided
    if (name && !allowedNames.includes(name)) {
      res.status(400).json({ msg: "Invalid contract category name" });
      return;
    }

    // Build update object dynamically
    const updateData: any = {};
    if (name) updateData.name = name;
    if (desc) updateData.desc = desc;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ msg: "No valid fields provided for update" });
      return;
    }

    const contractCategory = await ContractCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!contractCategory) {
      res.status(404).json({ msg: "ContractCategory not found" });
      return;
    }

    res.status(200).json({
      msg: "ContractCategory updated successfully",
      contractCategory,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ msg: "ContractCategory name must be unique" });
      return;
    }
    res.status(500).json({ msg: error.message });
  }
};

// Delete contract category
export const deleteContractCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contractCategory = await ContractCategory.findByIdAndDelete(
      req.params.id
    );

    if (!contractCategory) {
      res.status(404).json({ msg: "ContractCategory not found" });
      return;
    }

    res.status(200).json({
      msg: "ContractCategory deleted successfully",
      contractCategory,
    });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};
