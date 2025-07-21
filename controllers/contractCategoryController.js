const ContractCategory = require("../models/contractCategoryModel");

const getContractCategorys = async (req, res) => {
  try {
    const contractCategories = await ContractCategory.find({});
    res.json(contractCategories);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getContractCategoryById = async (req, res) => {
  try {
    const contractCategory = await ContractCategory.findById(req.params.id);

    if (!contractCategory) {
      return res.status(404).json({ msg: "contractCategory not found" });
    }

    res.json(contractCategory);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createContractCategory = async (req, res) => {
  try {
    const { name, desc } = req.body;

    if (!name || !desc) {
      return res.status(400).json({ msg: "error on name or desc" });
    }

    const newCategory = await ContractCategory.create({ name, desc });

    res.status(201).json({
      msg: "ContractCategory crteated successfully",
      id: newCategory._id,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateContractCategory = async (req, res) => {
  try {
    const { name, desc } = req.body;

    if (!name || !desc) {
      return res.status(400).json({ msg: "error on name or desc" });
    }

    const contractCategory = await ContractCategory.findByIdAndUpdate(
      req.params.id,
      { name, desc },
      { new: true }
    );

    if (!contractCategory) {
      return res.status(404).json({ msg: "contractCategory not found" });
    }

    res.json({ msg: "contractCategory edited", contractCategory });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteContractCategory = async (req, res) => {
  try {
    const contractCategory = await ContractCategory.findByIdAndDelete(
      req.params.id
    );

    if (!contractCategory) {
      return res.status(404).json({ msg: "contractCategory no encontrado" });
    }

    res.json({ msg: "contractCategory eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getContractCategorys,
  getContractCategoryById,
  createContractCategory,
  updateContractCategory,
  deleteContractCategory,
};
