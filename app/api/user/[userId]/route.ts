import { NextResponse } from "next/server";
import { connectDB } from "@/lib/actions/db";
import UserPMN from "@/lib/models/user";
import CongesEmployeModel from "@/lib/models/conges";

export async function DELETE(
  _req: Request,
  { params }: { params: { userId: string } },
) {
  try {
    await connectDB();
    const userId = params.userId;

    if (!userId) {
      return NextResponse.json({ error: "userId est requis" }, { status: 400 });
    }

    const deletedUser = await UserPMN.findByIdAndDelete(userId);
    if (!deletedUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 },
      );
    }

    // Nettoyer aussi l'enregistrement des congés lié (si présent)
    await CongesEmployeModel.deleteOne({ userId });

    return NextResponse.json(
      { message: "Utilisateur supprimé avec succès" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'utilisateur" },
      { status: 500 },
    );
  }
}
