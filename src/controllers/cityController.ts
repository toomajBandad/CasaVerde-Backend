import { Request, Response } from "express";
import City from "../models/cityModel";

// Get all cities
export const getAllCity = async (req: Request, res: Response): Promise<void> => {
  try {
    const cities = await City.find({});
    res.json(cities);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Get city by ID
export const getCityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      res.status(404).json({ msg: "City not found!" });
      return;
    }
    res.json(city);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Get all cities by province
export const getAllCityByProvince = async (req: Request, res: Response): Promise<void> => {
  try {
    const citiesArr = await City.find({ province: req.params.proName });
    if (!citiesArr.length) {
      res.status(404).json({ msg: "No city found in this province!" });
      return;
    }
    res.status(200).json(citiesArr);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Create a new city
export const createCity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { province, name } = req.body;

    if (!province || !name) {
      res.status(400).json({ msg: "Error with name or province" });
      return;
    }

    const newCity = await City.create({ province, name });
    res.status(201).json({
      msg: "New city created successfully",
      city: newCity,
    });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Edit city
export const editCity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { province, name } = req.body;

    if (!province || !name) {
      res.status(400).json({ msg: "Error with name or province" });
      return;
    }

    const city = await City.findByIdAndUpdate(
      req.params.id,
      { province, name },
      { new: true }
    );

    if (!city) {
      res.status(404).json({ msg: "City not found!" });
      return;
    }

    res.status(201).json({ msg: "City updated successfully", city });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete city
export const deleteCity = async (req: Request, res: Response): Promise<void> => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);

    if (!city) {
      res.status(404).json({ msg: "City not found!" });
      return;
    }

    res.status(200).json({ msg: "City deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Search city by name
export const searchCityByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const city = await City.findOne({ name: req.params.name });

    if (!city) {
      res.status(404).json({ msg: "City not found!" });
      return;
    }

    res.status(200).json({ msg: "City found successfully", city });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};