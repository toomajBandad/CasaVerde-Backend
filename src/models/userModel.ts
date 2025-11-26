import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for User documents
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  recentSearches?: Record<string, any>; // refine if you know exact structure
  messages?: any[];                     // refine if you know message type
  favorites?: any[];                    // refine if you know favorite type
  image?: string;
}

// Define the schema
const userSchema: Schema<IUser> = new Schema(
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
  { timestamps: true }
);

// Create the model
const User = mongoose.model<IUser>("User", userSchema);

// Export it properly
export default User;