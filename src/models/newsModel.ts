import mongoose, { Schema, Document } from "mongoose";

// Define the interface for your News document
export interface INews {
  title: string;           // Main headline
  subtitle?: string;       // Secondary line
  teaser?: string;         // Short preview text
  content: string;         // Full article body
  category: string;        // e.g. "Business", "Events"
  coverImage?: string;     // Thumbnail/banner image URL
  author?: string;         // Author name
  tags?: string[];         // Keywords for search
}

// Mongoose document type
export type NewsDocument = INews & Document;

// Define the schema
const NewsSchema: Schema<NewsDocument> = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    teaser: { type: String },
    content: { type: String, required: true },
    category: { type: String, required: true },
    coverImage: { type: String },
    author: { type: String },
    tags: { type: [String] },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// Create the model
const News = mongoose.model<NewsDocument>("News", NewsSchema);

export default News;