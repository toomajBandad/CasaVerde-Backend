const City = require("../models/cityModel");

const getAllCity = async (req, res) => {
  try {
    const cities = await City.find({});
    res.json(cities);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ msg: "City did not find !" });
    }
    res.json(city);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getAllCityByProvince = async (req, res) => {
  try {
    const citiesArr = await City.find({ province: req.params.proName });
    if (!citiesArr.length) {
      return res.status(404).json({ msg: "no City found in this province !" });
    }
    return res.status(200).json(citiesArr);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createCity = async (req, res) => {
  try {
    const { province, name } = req.body;

    if (!province || !name) {
      return res.status(400).json({ msg: "error with  name or province" });
    }

    const newCity = await City.create({
      province: province,
      name: name,
    });
    res.status(201).json({
      msg: "new City created successfully",
      city: newCity,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const editCity = async (req, res) => {
  try {
    const { province, name } = req.body;

    if (!province || !name) {
      return res.status(400).json({ msg: "error with  name or province" });
    }

    const city = await City.findByIdAndUpdate(
      req.params.id,
      { province, name },
      { new: true }
    );
    if (!city) {
      return res.status(404).json({ msg: "User did not find ! " });
    }
    res.status(201).json({ msg: " City updated successfully", city });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteCity = async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);

    if (!city) {
      return res.status(404).json({ msg: "City did not find !" });
    }

    res.status(200).json({ msg: "City deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const searchCityByName = async (req, res) => {
  const city = await City.findOne({ name: req.params.name });

  if (!city) {
    return res.status(404).json({ msg: "City did not find !" });
  }
  res.status(200).json({ msg: "City found successfully", city });
  try {
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getAllCity,
  getCityById,
  getAllCityByProvince,
  createCity,
  editCity,
  deleteCity,
  searchCityByName,
};
