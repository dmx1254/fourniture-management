import CongesEmployeModel from "@/lib/models/conges";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const conges = await CongesEmployeModel.find();
    return NextResponse.json(conges, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des congés" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await CongesEmployeModel.deleteMany({});

    return NextResponse.json(
      { message: "Congés supprimés avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression des congés" },
      { status: 500 }
    );
  }
}
