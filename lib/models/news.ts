import mongoose, { Schema, Document, models } from "mongoose";

interface INews extends Document {
  title: string;
  content: string;
  image: string;
  author: string;
  tags: string[];
}

const newsSchema = new Schema<INews>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: false },
    author: { type: String, required: true },
    tags: { type: [String], required: false },
  },
  { timestamps: true }
);

const NewsModel = models.news || mongoose.model<INews>("news", newsSchema);

export default NewsModel;
