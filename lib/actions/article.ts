const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      required: true,
    },
    consome: {
      type: Number,
      default: 0,
    },

    restant: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// export const UserModel = mongoose.model("user", userSchema);
const ArticleModel = mongoose.models.article || mongoose.model("article", articleSchema);
export default ArticleModel;
