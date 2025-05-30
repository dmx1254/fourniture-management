import mongoose from "mongoose";

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
    poste: {
      type: String,
      default: "",
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

// export const connectDB = async () => {
//   await mongoose
//     .connect(process.env.DB_CONNECT, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then(() => console.log("connected to database with success"))
//     .catch((err: Error) =>
//       console.log("failled to connected to database", err)
//     );
// };

const globalWithMongoose = global as typeof global & {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

export const connectDB = async (): Promise<string> => {
  if (cached.conn) {
    return "Already connected to database";
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.DB_CONNECT!)
      .then((mongoose) => {
        return mongoose;
      });
  }
  cached.conn = await cached.promise;
  return "Connected to database with success";
};
