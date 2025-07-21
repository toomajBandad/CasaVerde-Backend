const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
      unique: true,
    },

    location: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    bedrooms: {
      type: String,
      required: true,
    },
    bathrooms: {
      type: String,
      required: true,
    },
    pets: {
      type: String,
      required: true,
    },
    couples: {
      type: String,
      required: true,
    },
    minors: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contractCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContractCategory",
      required: true,
    },
    typeCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TypeCategory",
      required: true,
    },
    image: {
      type: Object,
      required: false,
    },
    city: {
      type: String,
      required: true,
    },
    latlng: {
      type: Array,
      required: false,
    },
    area: {
      type: String,
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
