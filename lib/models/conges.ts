import mongoose, { Schema, Document, models } from "mongoose";

interface IMonthlyBalance {
  year: number;
  month: number; // 1-12
  joursAcquis: number;
  joursConsommes: number;
}

interface ILeaveContract {
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  monthlyBalances: IMonthlyBalance[];
}

interface ICongesEmploye extends Document {
  userId: mongoose.Types.ObjectId;
  congesAcquis: number;
  congesConsommes: number;
  derniereMiseAJour: Date;
  contracts: ILeaveContract[];
}

const monthlyBalanceSchema = new Schema<IMonthlyBalance>(
  {
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    joursAcquis: {
      type: Number,
      required: true,
      default: 2,
      min: 0,
    },
    joursConsommes: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { _id: false },
);

const leaveContractSchema = new Schema<ILeaveContract>(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
    isCurrent: {
      type: Boolean,
      required: true,
      default: true,
    },
    monthlyBalances: {
      type: [monthlyBalanceSchema],
      default: [],
    },
  },
  { _id: false },
);

const congesEmployeSchema = new Schema<ICongesEmploye>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "pmnuser", // Référence vers le modèle User
    },
    congesAcquis: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    congesConsommes: {
      type: Number,
      required: true,
      default: 0,
      min: 0, // Les congés consommés ne peuvent pas être négatifs
    },
    derniereMiseAJour: {
      type: Date,
      required: true,
      default: Date.now,
    },
    contracts: {
      type: [leaveContractSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const CongesEmployeModel =
  models.congesEmploye ||
  mongoose.model<ICongesEmploye>("congesEmploye", congesEmployeSchema);

export default CongesEmployeModel;
