const mongoose = require("mongoose");

const entrepriseSchema = new mongoose.Schema(
  {
    lastname: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: "",
    },
    departement: {
      type: String,
      required: true,
    },
    commune: {
      type: String,
      default: "",
    },
    village: {
      type: String,
      default: "",
    },
    quartier: {
      type: String,
      default: "",
    },
    region: {
      type: String,
      required: true,
    },
    corpsdemetiers: {
      type: String,
      required: true,
    },
    entreprise: {
      type: String,
      default: "",
    },
    statusEntreprise: {
      type: String,
      default: "",
    },
    formel: {
      type: String,
      required: true,
      trim: true,
    },
    formation: {
      type: String,
      default: "",
      trim: true,
    },
    besoinFormation: {
      type: String,
      default: "",
      trim: true,
    },
    financementEtat: {
      type: String,
      default: "",
      trim: true,
    },
    accesZonesExpositions: {
      type: String,
      default: "",
      trim: true,
    },
    siteExposition: {
      type: String,
      default: "",
    },
    genre: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
      default: 18,
    },

    chambreDemetier: {
      type: String,
      default: "",
      trim: true,
    },
    chambreDemetierRegion: {
      type: String,
      default: "",
    },
    besoins: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// export const UserModel = mongoose.model("user", userSchema);
const EntrepriseModel =
  mongoose.models.entreprise || mongoose.model("entreprise", entrepriseSchema);
export default EntrepriseModel;
