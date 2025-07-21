const TypeCategory = require("../models/typeCategoryModel");

const getTypeCategorys = async (req, res) => {
  try {
    const typeCategories = await TypeCategory.find({});
    res.json(typeCategories);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getTypeCategoryById = async (req, res) => {
  try {
    const typeCategory = await TypeCategory.findById(req.params.id);

    if (!typeCategory) {
      return res.status(404).json({ msg: "typeCategory no encontrado" });
    }

    res.json(typeCategory);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createTypeCategory = async (req, res) => {
  try {
    const { name, desc } = req.body;

    if (!name || !desc) {
      return res.status(400).json({ msg: "error on name or desc" });
    }

    const newCategory = await TypeCategory.create({ name, desc });

    res.status(201).json({
      msg: "TypeCategory crteated successfully",
      id: newCategory._id,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateTypeCategory = async (req, res) => {
  try {
    const { name, desc } = req.body;

    if (!name || !desc) {
      return res.status(400).json({ msg: "error on name or desc" });
    }

    const typeCategory = await TypeCategory.findByIdAndUpdate(
      req.params.id,
      { name, desc },
      { new: true }
    );

    if (!typeCategory) {
      return res.status(404).json({ msg: "typeCategory not found" });
    }

    res.json({ msg: "typeCategory edited", typeCategory });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteTypeCategory = async (req, res) => {
  try {
    const typeCategory = await TypeCategory.findByIdAndDelete(req.params.id);

    if (!typeCategory) {
      return res.status(404).json({ msg: "typeCategory no encontrado" });
    }

    res.json({ msg: "typeCategory eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getTypeCategorys,
  getTypeCategoryById,
  createTypeCategory,
  updateTypeCategory,
  deleteTypeCategory,
};
