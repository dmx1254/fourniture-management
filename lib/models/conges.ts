import mongoose, { Schema, Document, models } from "mongoose";

interface ICongesEmploye extends Document {
  userId: mongoose.Types.ObjectId;
  congesAcquis: number;
  congesConsommes: number;
  derniereMiseAJour: Date;
}

const congesEmployeSchema = new Schema<ICongesEmploye>(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true, 
      unique: true,
      ref: "pmnuser" // Référence vers le modèle User
    },
    congesAcquis: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    congesConsommes: { 
      type: Number, 
      required: true, 
      default: 0,
      min: 0 // Les congés consommés ne peuvent pas être négatifs
    },
    derniereMiseAJour: { 
      type: Date, 
      required: true, 
      default: Date.now 
    }
  },
  { timestamps: true }
);

const CongesEmployeModel = 
  models.congesEmploye || mongoose.model<ICongesEmploye>("congesEmploye", congesEmployeSchema);

export default CongesEmployeModel;
