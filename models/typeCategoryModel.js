const mongoose = require("mongoose");

const typeCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: [
        "Apartment",
        "Villa",
        "Flat",
        "Room",
        "Office",
        "Garage",
        "Storage",
      ],
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TypeCategory = mongoose.model("TypeCategory", typeCategorySchema);

module.exports = TypeCategory;
