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

export const connectDB = async (): Promise<void> => {
  // Vérifier que DB_CONNECT est défini
  if (!process.env.DB_CONNECT) {
    throw new Error("DB_CONNECT environment variable is not defined");
  }

  // Vérifier si la connexion existe et est toujours active
  if (cached.conn) {
    // Vérifier que la connexion est toujours active
    if (mongoose.connection.readyState === 1) {
      return; // Déjà connecté et actif
    } else {
      // La connexion existe mais n'est plus active, réinitialiser
      cached.conn = null;
      cached.promise = null;
    }
  }

  // Si une promesse de connexion est en cours, l'attendre
  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      // Vérifier que la connexion est active après l'attente
      if (mongoose.connection.readyState === 1) {
        return;
      } else {
        // La connexion a échoué, réinitialiser
        cached.conn = null;
        cached.promise = null;
      }
    } catch (error) {
      // La connexion a échoué, réinitialiser
      cached.conn = null;
      cached.promise = null;
      throw error;
    }
  }

  // Créer une nouvelle connexion
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Désactiver le buffering pour éviter les timeouts
      maxPoolSize: 10, // Maintenir jusqu'à 10 connexions socket
      serverSelectionTimeoutMS: 5000, // Timeout de 5 secondes pour la sélection du serveur
      socketTimeoutMS: 45000, // Fermer les sockets après 45 secondes d'inactivité
    };

    cached.promise = mongoose
      .connect(process.env.DB_CONNECT!, opts)
      .then((mongoose) => {
        console.log("✅ Connected to MongoDB");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.conn = null;
    cached.promise = null;
    throw error;
  }
};
