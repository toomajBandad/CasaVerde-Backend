import mongoose, { Schema, Document, Types } from "mongoose";

// Define the TypeScript interface for User documents
export interface IUser {
  username: string;
  email: string;
  password: string;
  role: "user" | "owner" | "admin"; // controls permissions
  listings?: Types.ObjectId[];      // properties posted by the user
  favorites?: Types.ObjectId[];     // saved properties
  recentSearches?: object[];        // personalized recommendations
  messages?: Types.ObjectId[];
  profile?: {
    image?: string;
    bio?: string;
    phone?: string;
  };
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
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "user",
    },

    listings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
    ],

    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
    ],

    recentSearches: {
      type: Array,
      default: [],
    },

    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],

    profile: {
      image: { type: String, default: "" },
      bio: { type: String, maxlength: 200 },
      phone: { type: String },
    },
  },
  { timestamps: true }
);

// Create the model
const User = mongoose.model<UserDocument>("User", userSchema);

// Export it properly
export default User;