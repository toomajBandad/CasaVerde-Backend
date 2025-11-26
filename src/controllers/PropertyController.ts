import { Request, Response } from "express";
import Property from "../models/propertyModel";
import ContractCategory from "../models/contractCategoryModel";
import TypeCategory from "../models/typeCategoryModel";


// Get all properties
export const getProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const properties = await Property.find({})
      .populate("contractCategory")
      .populate("typeCategory");
    res.json(properties);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Get property by ID
export const getPropertyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("contractCategory")
      .populate("typeCategory");

    if (!property) {
      res.status(404).json({ msg: "Property not found" });
      return;
    }
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Create property
export const createProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title, desc, location, price, duration,
      bedrooms, bathrooms, pets, couples, minors,
      owner, contractCategory, typeCategory,
      city, image, latlng, area,
    } = req.body;

    if (!title || !desc || !location || !price || !duration ||
        !bedrooms || !bathrooms || !pets || !couples || !minors ||
        !owner || !contractCategory || !typeCategory || !city || !image || !area) {
      res.status(400).json({ msg: "One or more required fields missing" });
      return;
    }

    const thisContractCategory = await ContractCategory.findOne({ name: contractCategory });
    if (!thisContractCategory) {
      res.status(400).json({ msg: "Contract category did not match" });
      return;
    }

    const thisTypeCategory = await TypeCategory.findOne({ name: typeCategory });
    if (!thisTypeCategory) {
      res.status(400).json({ msg: "Type category did not match" });
      return;
    }

    const newProperty = await Property.create({
      title, desc, location, price, duration,
      bedrooms, bathrooms, pets, couples, minors,
      owner: owner || null,
      contractCategory: thisContractCategory,
      typeCategory: thisTypeCategory,
      city, image, latlng, area,
    });

    res.status(201).json({ msg: "Property successfully created", id: newProperty._id });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Update property
export const updateProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title, price, city, location, contractCategory,
      bathrooms, typeCategory, bedrooms, pets, couples,
      desc, minors, duration, area,
    } = req.body;

    if (!title || !price || !city || !location || !contractCategory ||
        !bathrooms || !typeCategory || !bedrooms || !pets || !couples ||
        !desc || !minors || !duration || !area) {
      res.status(400).json({ msg: "One or more required fields missing" });
      return;
    }

    const thisContractCategory = await ContractCategory.findOne({ name: contractCategory });
    if (!thisContractCategory) {
      res.status(400).json({ msg: "Contract category did not match" });
      return;
    }

    const thisTypeCategory = await TypeCategory.findOne({ name: typeCategory });
    if (!thisTypeCategory) {
      res.status(400).json({ msg: "Type category did not match" });
      return;
    }

    const updateData = {
      title, price, city, location,
      contractCategory: thisContractCategory,
      bathrooms, typeCategory: thisTypeCategory,
      bedrooms, pets, couples, desc, minors, duration, area,
    };

    const property = await Property.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate("owner", "id");

    if (!property) {
      res.status(404).json({ msg: "Property not found" });
      return;
    }

    res.status(201).json({ msg: "Property updated successfully", property });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete property
export const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      res.status(404).json({ msg: "Property not found" });
      return;
    }
    res.json({ msg: "Property deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Assign owner
export const assignOwner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ownerId } = req.body;
    if (!ownerId) {
      res.status(400).json({ msg: "Owner ID is required" });
      return;
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id, { owner: ownerId }, { new: true }
    ).populate("owner", "id");

    if (!property) {
      res.status(404).json({ msg: "Property not found" });
      return;
    }

    res.json({ msg: "Owner assigned successfully", property });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Get properties by owner
export const getPropertiesByOwner = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = req.params.ownerId;
    const properties = await Property.find({ owner: ownerId })
      .populate("owner", "id")
      .populate("contractCategory")
      .populate("typeCategory");
    res.json(properties);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Get properties by city
export const getPropertiesByCity = async (req: Request, res: Response): Promise<void> => {
  try {
    const city = req.params.cityName;
    const properties = await Property.find({ city })
      .populate("contractCategory")
      .populate("typeCategory");
    res.status(200).json({ msg: "success", properties });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Assign category to property
export const assignCategoryToProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { typeCategoryId } = req.body;
    if (!typeCategoryId) {
      res.status(400).json({ msg: "TypeCategory ID is required" });
      return;
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id, { typeCategory: typeCategoryId }, { new: true }
    ).populate("typeCategory", "title");

    if (!property) {
      res.status(404).json({ msg: "Property not found" });
      return;
    }

    res.json({ msg: "TypeCategory assigned successfully", property });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// Get properties by category
export const getPropertiesByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const typeCategoryId = req.params.typeCategoryId;
    const properties = await Property.find({ typeCategory: typeCategoryId })
      .populate("typeCategory", "title");
    res.status(200).json({ msg: "Properties found successfully", properties });
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

        
        // Search properties with optional polygon
        // export const getPropertiesSearch = async (req: Request, res: Response): Promise<void> => {
        //   try {
        //     const city: string|undefined = req.params.cityName;
        
        //     const contract = await ContractCategory.findOne({ name: req.params.contract });
        //     const type = await TypeCategory.findOne({ name: req.params.type });
        
        //     if (!contract || !type || !city) {
        //       res.status(400).json({ msg: "Contract, type, or city not found" });
        //       return;
        //     }
        
        //     // Explicitly type req.body
        //     const { polyArray } = req.body as { polyArray?: number[][] };
        
        //     if (polyArray && polyArray.length > 0) {
        //       // close polygon loop
        //       polyArray.push(polyArray[0]);
        
        //       const polygon = {
        //         type: "Polygon",
        //         coordinates: [polyArray],
        //       };
        
        //       const properties = await Property.find({
        //         latlng: { $geoWithin: { $geometry: polygon } },
        //         city,
        //         contractCategory: contract,
        //         typeCategory: type,
        //       })
        //         .populate("contractCategory")
        //         .populate("typeCategory");
        
        //       res.status(200).json({ msg: "success with map", properties });
        //     } else {
        //       const properties = await Property.find({
        //         city,
        //         contractCategory: contract,
        //         typeCategory: type,
        //       })
        //         .populate("contractCategory")
        //         .populate("typeCategory");
        
        //       res.status(200).json({ msg: "success without map", properties });
        //     }
        //   } catch (error: any) {
        //     res.status(500).json({ msg: error.message });
        //   }
        // };
        
        
        // Find properties by polygon + filters
        // export const findPropertiesByLocations = async (req: Request, res: Response): Promise<void> => {
        //   try {
        //     const { polygonCoords, city, typeCat, contractCat } = req.body as {
        //       polygonCoords: number[][];
        //       city: string;
        //       typeCat: string;
        //       contractCat: string;
        //     };
        
        //     if (!polygonCoords || !city || !typeCat || !contractCat) {
        //       res.status(400).json({ msg: "polygonCoords or datas not found" });
        //       return;
        //     }
        
        //     // close polygon loop
        //     polygonCoords.push(polygonCoords[0]);
        
        //     const contract = await ContractCategory.findOne({ name: contractCat });
        //     const type = await TypeCategory.findOne({ name: typeCat });
        
        //     if (!contract || !type) {
        //       res.status(400).json({ msg: "Contract or type category not found" });
        //       return;
        //     }
        
        //     const polygon = {
        //       type: "Polygon",
        //       coordinates: [polygonCoords],
        //     };
        
        //     const results = await Property.find({
        //       latlng: { $geoWithin: { $geometry: polygon } },
        //       city,
        //       contractCategory: contract,
        //       typeCategory: type,
        //     });
        
        //     if (!results.length) {
        //       res.status(400).json({ msg: "No properties found" });
        //       return;
        //     }
        
        //     res.status(200).json({ msg: "success", results });
        //   } catch (error: any) {
        //     res.status(500).json({ msg: error.message });
        //   }
        // };

