import mongoose, { Schema, Document, Types } from "mongoose";

// Define the TypeScript interface for User documents
export interface IUser {
  username: string;
  email: string;
  password: string;
  recentSearches?: Record<string, any>;
  messages?: any[];
  favorites?: Types.ObjectId[]; // array of Property IDs
  image?: string;
}

// Mongoose document type
export type UserDocument = IUser & Document;

// Define the schema
const userSchema: Schema<UserDocument> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 6,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
      required: true,
    },

    recentSearches: {
      type: Array,
      default: [],
    },

    messages: {
      type: Array,
      default: [],
    },

    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property", // reference to Property model
      }
    ],

    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Create the model
const User = mongoose.model<UserDocument>("User", userSchema);

// Export it properly
export default User;