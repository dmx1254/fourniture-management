const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    articleId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    consome: {
      type: Number,
      default: 0,
    },
    lastname: {
      type: String,
      default: "",
    },
    firstname: {
      type: String,
      default: "",
    },
    poste: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// export const UserModel = mongoose.model("user", userSchema);
const TransactionModel =
  mongoose.models.transaction ||
  mongoose.model("transaction", transactionSchema);
export default TransactionModel;
