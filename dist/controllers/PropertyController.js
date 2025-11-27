"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertiesByCategory = exports.assignCategoryToProperty = exports.getPropertiesByCity = exports.getPropertiesByOwner = exports.assignOwner = exports.deleteProperty = exports.updateProperty = exports.createProperty = exports.getPropertyById = exports.getProperties = void 0;
const propertyModel_1 = __importDefault(require("../models/propertyModel"));
const contractCategoryModel_1 = __importDefault(require("../models/contractCategoryModel"));
const typeCategoryModel_1 = __importDefault(require("../models/typeCategoryModel"));
// Get all properties
const getProperties = async (req, res) => {
    try {
        const properties = await propertyModel_1.default.find({})
            .populate("contractCategory")
            .populate("typeCategory");
        res.json(properties);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getProperties = getProperties;
// Get property by ID
const getPropertyById = async (req, res) => {
    try {
        const property = await propertyModel_1.default.findById(req.params.id)
            .populate("contractCategory")
            .populate("typeCategory");
        if (!property) {
            res.status(404).json({ msg: "Property not found" });
            return;
        }
        res.json(property);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getPropertyById = getPropertyById;
// Create property
const createProperty = async (req, res) => {
    try {
        const { title, desc, location, price, duration, bedrooms, bathrooms, pets, couples, minors, owner, contractCategory, typeCategory, city, image, latlng, area, } = req.body;
        if (!title || !desc || !location || !price || !duration ||
            !bedrooms || !bathrooms || !pets || !couples || !minors ||
            !owner || !contractCategory || !typeCategory || !city || !image || !area) {
            res.status(400).json({ msg: "One or more required fields missing" });
            return;
        }
        const thisContractCategory = await contractCategoryModel_1.default.findOne({ name: contractCategory });
        if (!thisContractCategory) {
            res.status(400).json({ msg: "Contract category did not match" });
            return;
        }
        const thisTypeCategory = await typeCategoryModel_1.default.findOne({ name: typeCategory });
        if (!thisTypeCategory) {
            res.status(400).json({ msg: "Type category did not match" });
            return;
        }
        const newProperty = await propertyModel_1.default.create({
            title, desc, location, price, duration,
            bedrooms, bathrooms, pets, couples, minors,
            owner: owner || null,
            contractCategory: thisContractCategory,
            typeCategory: thisTypeCategory,
            city, image, latlng, area,
        });
        res.status(201).json({ msg: "Property successfully created", id: newProperty._id });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.createProperty = createProperty;
// Update property
const updateProperty = async (req, res) => {
    try {
        const { title, price, city, location, contractCategory, bathrooms, typeCategory, bedrooms, pets, couples, desc, minors, duration, area, } = req.body;
        if (!title || !price || !city || !location || !contractCategory ||
            !bathrooms || !typeCategory || !bedrooms || !pets || !couples ||
            !desc || !minors || !duration || !area) {
            res.status(400).json({ msg: "One or more required fields missing" });
            return;
        }
        const thisContractCategory = await contractCategoryModel_1.default.findOne({ name: contractCategory });
        if (!thisContractCategory) {
            res.status(400).json({ msg: "Contract category did not match" });
            return;
        }
        const thisTypeCategory = await typeCategoryModel_1.default.findOne({ name: typeCategory });
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
        const property = await propertyModel_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true })
            .populate("owner", "id");
        if (!property) {
            res.status(404).json({ msg: "Property not found" });
            return;
        }
        res.status(201).json({ msg: "Property updated successfully", property });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.updateProperty = updateProperty;
// Delete property
const deleteProperty = async (req, res) => {
    try {
        const property = await propertyModel_1.default.findByIdAndDelete(req.params.id);
        if (!property) {
            res.status(404).json({ msg: "Property not found" });
            return;
        }
        res.json({ msg: "Property deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.deleteProperty = deleteProperty;
// Assign owner
const assignOwner = async (req, res) => {
    try {
        const { ownerId } = req.body;
        if (!ownerId) {
            res.status(400).json({ msg: "Owner ID is required" });
            return;
        }
        const property = await propertyModel_1.default.findByIdAndUpdate(req.params.id, { owner: ownerId }, { new: true }).populate("owner", "id");
        if (!property) {
            res.status(404).json({ msg: "Property not found" });
            return;
        }
        res.json({ msg: "Owner assigned successfully", property });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.assignOwner = assignOwner;
// Get properties by owner
const getPropertiesByOwner = async (req, res) => {
    try {
        const ownerId = req.params.ownerId;
        const properties = await propertyModel_1.default.find({ owner: ownerId })
            .populate("owner", "id")
            .populate("contractCategory")
            .populate("typeCategory");
        res.json(properties);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getPropertiesByOwner = getPropertiesByOwner;
// Get properties by city
const getPropertiesByCity = async (req, res) => {
    try {
        const city = req.params.cityName;
        const properties = await propertyModel_1.default.find({ city })
            .populate("contractCategory")
            .populate("typeCategory");
        res.status(200).json({ msg: "success", properties });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getPropertiesByCity = getPropertiesByCity;
// Assign category to property
const assignCategoryToProperty = async (req, res) => {
    try {
        const { typeCategoryId } = req.body;
        if (!typeCategoryId) {
            res.status(400).json({ msg: "TypeCategory ID is required" });
            return;
        }
        const property = await propertyModel_1.default.findByIdAndUpdate(req.params.id, { typeCategory: typeCategoryId }, { new: true }).populate("typeCategory", "title");
        if (!property) {
            res.status(404).json({ msg: "Property not found" });
            return;
        }
        res.json({ msg: "TypeCategory assigned successfully", property });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.assignCategoryToProperty = assignCategoryToProperty;
// Get properties by category
const getPropertiesByCategory = async (req, res) => {
    try {
        const typeCategoryId = req.params.typeCategoryId;
        const properties = await propertyModel_1.default.find({ typeCategory: typeCategoryId })
            .populate("typeCategory", "title");
        res.status(200).json({ msg: "Properties found successfully", properties });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
exports.getPropertiesByCategory = getPropertiesByCategory;
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
//# sourceMappingURL=PropertyController.js.map