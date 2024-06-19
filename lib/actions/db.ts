const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 1024,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
      required: true,
    },

    profil: {
      type: String,
      default: "",
    },
    lastname: {
      type: String,
      default: "",
    },
    firstname: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    clientIp: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// export const UserModel = mongoose.model("user", userSchema);
const UserModel = mongoose.models.user || mongoose.model("user", userSchema);
export default UserModel;

export const connectDB = async () => {
  await mongoose
    .connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("connected to database with success"))
    .catch((err: Error) =>
      console.log("failled to connected to database", err)
    );
};
