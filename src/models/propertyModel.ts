import mongoose, { Schema, Document, Types } from "mongoose";

// Define the TypeScript interface for Property documents
export interface IProperty {
  title: string;
  desc: string;
  location: string;
  price: string;
  duration: string;
  bedrooms: string;
  bathrooms: string;
  pets: string;
  couples: string;
  minors: string;
  owner: Types.ObjectId;            // reference to User
  contractCategory: Types.ObjectId; // reference to ContractCategory
  typeCategory: Types.ObjectId;     // reference to TypeCategory
  image?: string;                   // image URL
  city: string;
  latlng?: any[];                   // e.g. [lat, lng]
  area: string;
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
      type: Array,
    },
    area: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create the model
const Property = mongoose.model<PropertyDocument>("Property", propertySchema);

// Export it properly
export default Property;