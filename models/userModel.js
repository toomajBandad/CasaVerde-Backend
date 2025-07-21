const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 6,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/, // Simple email regex pattern
    },
    password: {
      type: String,
      required: true,
    },
    recentSearches: {
      type: Object,
      required: false,
    },
    messages: {
      type: Array,
      required: false,
    },
    favorites: {
      type: Array,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
