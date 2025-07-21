const Property = require("../models/propertyModel");
const ContractCategory = require("../models/contractCategoryModel");
const TypeCategory = require("../models/typeCategoryModel");

const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({})
      .populate("contractCategory")
      .populate("typeCategory");

    res.json(properties);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("contractCategory")
      .populate("typeCategory");

    if (!property) {
      return res.status(404).json({ msg: "Property did not find" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createProperty = async (req, res) => {
  try {
    const {
      title,
      desc,
      location,
      price,
      duration,
      bedrooms,
      bathrooms,
      pets,
      couples,
      minors,
      owner,
      contractCategory,
      typeCategory,
      city,
      image,
      latlng,
      area,
    } = req.body;

    if (
      !title ||
      !desc ||
      !location ||
      !price ||
      !duration ||
      !bedrooms ||
      !bathrooms ||
      !pets ||
      !couples ||
      !minors ||
      !owner ||
      !contractCategory ||
      !typeCategory ||
      !city ||
      !image ||
      !area
    ) {
      return res.status(400).json({ msg: "one or more data did not send" });
    }

    const thiscontractCategory = await ContractCategory.findOne({
      name: contractCategory,
    });
    if (!thiscontractCategory) {
      return res.status(400).json({ msg: "contract category did not match" });
    }

    const thistypeCategory = await TypeCategory.findOne({
      name: typeCategory,
    });
    if (!thistypeCategory) {
      return res.status(400).json({ msg: "type Category did not match" });
    }

    const newProperty = await Property.create({
      title: title,
      desc: desc,
      location: location,
      price: price,
      duration: duration,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      pets: pets,
      couples: couples,
      minors: minors,
      owner: owner || null, //If has no owner must be null
      contractCategory: thiscontractCategory,
      typeCategory: thistypeCategory,
      city: city,
      image: image,
      latlng: latlng,
      area: area,
    });

    res.status(201).json({
      msg: "Property successfully created",
      id: newProperty._id,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const {
      title,
      price,
      city,
      location,
      contractCategory,
      bathrooms,
      typeCategory,
      bedrooms,
      pets,
      couples,
      desc,
      minors,
      duration,
      area,
    } = req.body;

    if (
      !title ||
      !price ||
      !city ||
      !location ||
      !contractCategory ||
      !bathrooms ||
      !typeCategory ||
      !bedrooms ||
      !pets ||
      !couples ||
      !desc ||
      !minors ||
      !duration ||
      !area
    ) {
      return res.status(400).json({ msg: "one or more data did not send" });
    }

    const thiscontractCategory = await ContractCategory.findOne({
      name: contractCategory,
    });
    if (!thiscontractCategory) {
      return res.status(400).json({ msg: "contract category did not match" });
    }

    const thistypeCategory = await TypeCategory.findOne({
      name: typeCategory,
    });
    if (!thistypeCategory) {
      return res.status(400).json({ msg: "type Category did not match" });
    }

    updateData = {
      title: title,
      price: price,
      city: city,
      location: location,
      contractCategory: thiscontractCategory,
      bathrooms: bathrooms,
      typeCategory: thistypeCategory,
      bedrooms: bedrooms,
      pets: pets,
      couples: couples,
      desc: desc,
      minors: minors,
      duration: duration,
      area: area,
    };
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("owner", "id");

    if (!property) {
      return res.status(404).json({ msg: "Property no encontrada" });
    }
    res.status(201).json({ msg: "Property edited successfully", property });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({ msg: "Property did not find" });
    }

    res.json({ msg: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const assignOwner = async (req, res) => {
  try {
    const { ownerId } = req.body;

    if (!ownerId) {
      return res.status(400).json({ msg: "Falta el ID del propietario" });
    }

    // Edit the property with id
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { owner: ownerId },
      { new: true }
    ).populate("owner", "id");

    if (!property) {
      return res.status(404).json({ msg: "Property no encontrada" });
    }

    res.json({ msg: "Propietario asignado correctamente", property });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getPropertiesByOwner = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const properties = await Property.find({ owner: ownerId })
      .populate("owner", "id")
      .populate("contractCategory")
      .populate("typeCategory");
    res.json(properties);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getPropertiesByCity = async (req, res) => {
  try {
    const city = req.params.cityName;
    const properties = await Property.find({ city: city })
      .populate("contractCategory")
      .populate("typeCategory");
    res.status(200).json({ msg: "success", properties });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const assignCategoryToProperty = async (req, res) => {
  try {
    const { typeCategoryId } = req.body;

    if (!typeCategoryId) {
      return res.status(400).json({ msg: "Falta el ID del typeCategory" });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { typeCategory: typeCategoryId },
      { new: true }
    ).populate("typeCategory", "title");

    if (!property) {
      return res.status(404).json({ msg: "Property no encontrada" });
    }

    res.json({ msg: "typeCategory asignado correctamente", property });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getPropertiesByCategory = async (req, res) => {
  try {
    const typeCategoryId = req.params.typeCategoryId;

    const properties = await Property.find({
      typeCategory: typeCategoryId,
    }).populate("typeCategory", "title");

    res.status(200).json({ msg: "tareas find successfully", properties });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getPropertiesSearch = async (req, res) => {
  try {
    const city = req.params.cityName;

    const contract = await ContractCategory.findOne({
      name: req.params.contract,
    });
    const type = await TypeCategory.findOne({ name: req.params.type });
    if (!contract || !type || !city) {
      return res
        .status(400)
        .json({ msg: "Contract or type or city not found" });
    }

    // start checking the map polygon
    const { polyArray } = req.body;
    if (polyArray.length) {
      polyArray.push(polyArray[0]);
      const polygon = {
        type: "Polygon",
        coordinates: [polyArray],
      };
      const properties = await Property.find({
        latlng: {
          $geoWithin: {
            $geometry: polygon,
          },
        },
        city: city,
        contractCategory: contract,
        typeCategory: type,
      })
        .populate("contractCategory")
        .populate("typeCategory");
      res.status(200).json({ msg: "success with map", properties });
      //finish checking the map polygon
    } else {
      const properties = await Property.find({
        city: city,
        contractCategory: contract,
        typeCategory: type,
      })
        .populate("contractCategory")
        .populate("typeCategory");
      res.status(200).json({ msg: "success without map", properties });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const findPropertiesByLocations = async (req, res) => {
  try {
    const { polygonCoords, city, typeCat, contractCat } = req.body;
    polygonCoords.push(polygonCoords[0]);

    const contract = await ContractCategory.findOne({
      name: contractCat,
    });
    const type = await TypeCategory.findOne({ name: typeCat });

    if (!polygonCoords || !city || !type || !contract) {
      return res.status(400).json({ msg: "polygonCoords or datas not found" });
    }

    const polygon = {
      type: "Polygon",
      coordinates: [polygonCoords],
    };

    const results = await Property.find({
      latlng: {
        $geoWithin: {
          $geometry: polygon,
        },
      },
      city: city,
      contractCategory: contract,
      typeCategory: type,
    });
    if (!results.length) {
      return res.status(400).json({ msg: "not found any props" });
    }

    res.status(200).json({ msg: "success", results });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  assignOwner,
  getPropertiesByOwner,
  getPropertiesByCity,
  assignCategoryToProperty,
  getPropertiesByCategory,
  getPropertiesSearch,
  findPropertiesByLocations,
};
