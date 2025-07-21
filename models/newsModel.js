const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    mainTitle: {
      type: String,
      required: true,
    },

    items: [
      {
        title: {
          type: String,
          unique: true,
        },
        desc: {
          type: String,
          unique: true,
        },
        img: {
          type: String,
        },
        type: Object,
      },
      {
        title: {
          type: String,
          unique: true,
        },
        desc: {
          type: String,
          unique: true,
        },
        img: {
          type: String,
        },
        type: Object,
      },
      {
        title: {
          type: String,
          unique: true,
        },
        desc: {
          type: String,
          unique: true,
        },
        img: {
          type: String,
        },
        type: Object,
      },
      {
        title: {
          type: String,
          unique: true,
        },
        desc: {
          type: String,
          unique: true,
        },
        img: {
          type: String,
        },
        type: Object,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const News = mongoose.model("News", NewsSchema);

module.exports = News;
