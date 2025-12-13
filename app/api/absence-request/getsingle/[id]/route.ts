import AbsenceRequestModel from "@/lib/models/absence";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const absence = await AbsenceRequestModel.findById(id);
    if (!absence) {
      return NextResponse.json(
        { errorMessage: "Demande d'absence non trouvée" },
        { status: 404 }
      );
    }
    return NextResponse.json({ absence }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        errorMessage: "Erreur lors de la récupération de la demande d'absence",
      },
      { status: 500 }
    );
  }
}
