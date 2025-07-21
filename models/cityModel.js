const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema(
  {
    province: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    location:{
      type:Array,
    }
  },
  {
    timestamps: true,
  }
);

const City = mongoose.model("City", CitySchema);

module.exports = City;
