import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for News items
export interface INewsItem {
  title: string;
  desc: string;
  img?: string;
  type?: Record<string, any>; // flexible object
}

// Define the TypeScript interface for News documents
export interface INews {
  category: string;
  mainTitle: string;
  items: INewsItem[];
}

// Mongoose document type
export type NewsDocument = INews & Document;

// Define the schema
const NewsSchema: Schema<NewsDocument> = new Schema(
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
        type: {
          type: Object,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create the model
const News = mongoose.model<NewsDocument>("News", NewsSchema);

// Export it properly
export default News;