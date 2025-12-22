import mongoose, { Schema, Document, Types } from "mongoose";

// Define the TypeScript interface for Property documents
export interface IProperty {
  title: string;
  desc: string;
  location: string;
  price: number;
  duration: number;
  bedrooms: number;
  bathrooms: number;
  pets: boolean;
  couples: boolean;
  minors: boolean;
  owner: Types.ObjectId;            // reference to User
  contractCategory: Types.ObjectId; // reference to ContractCategory
  typeCategory: Types.ObjectId;     // reference to TypeCategory
  image?: string;                   // image URL
  city: string;
  latlng?: number[];                // e.g. [lat, lng]
  area: number;
}

// Mongoose document type
export type PropertyDocument = IProperty & Document;

// Define the schema
const propertySchema: Schema<PropertyDocument> = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1, // must be > 0
    },
    duration: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 1, // must have at least 1 bathroom
    },
    pets: {
      type: Boolean,
      required: true,
    },
    couples: {
      type: Boolean,
      required: true,
    },
    minors: {
      type: Boolean,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contractCategory: {
      type: Schema.Types.ObjectId,
      ref: "ContractCategory",
      required: true,
    },
    typeCategory: {
      type: Schema.Types.ObjectId,
      ref: "TypeCategory",
      required: true,
    },
    image: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    latlng: {
      type: [Number], // array of numbers
    },
    area: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

// Create the model
const Property = mongoose.model<PropertyDocument>("Property", propertySchema);

// Export it properly
export default Property;