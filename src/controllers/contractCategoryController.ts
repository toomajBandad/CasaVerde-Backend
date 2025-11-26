import { Request, Response } from "express";
import ContractCategory from "../models/contractCategoryModel";

// Get all contract categories
export const getContractCategorys = async (req: Request, res: Response): Promise<void> => {
  try {
    const contractCategories = await ContractCategory.find({});
    res.json(contractCategories);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Get contract category by ID
export const getContractCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const contractCategory = await ContractCategory.findById(req.params.id);

    if (!contractCategory) {
      res.status(404).json({ msg: "ContractCategory not found" });
      return;
    }

    res.json(contractCategory);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Create a new contract category
export const createContractCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, desc } = req.body;

    if (!name || !desc) {
      res.status(400).json({ msg: "Error on name or desc" });
      return;
    }

    const newCategory = await ContractCategory.create({ name, desc });

    res.status(201).json({
      msg: "ContractCategory created successfully",
      id: newCategory._id,
    });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Update contract category
export const updateContractCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, desc } = req.body;

    if (!name || !desc) {
      res.status(400).json({ msg: "Error on name or desc" });
      return;
    }

    const contractCategory = await ContractCategory.findByIdAndUpdate(
      req.params.id,
      { name, desc },
      { new: true }
    );

    if (!contractCategory) {
      res.status(404).json({ msg: "ContractCategory not found" });
      return;
    }

    res.json({ msg: "ContractCategory edited", contractCategory });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete contract category
export const deleteContractCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const contractCategory = await ContractCategory.findByIdAndDelete(req.params.id);

    if (!contractCategory) {
      res.status(404).json({ msg: "ContractCategory not found" });
      return;
    }

    res.json({ msg: "ContractCategory deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};