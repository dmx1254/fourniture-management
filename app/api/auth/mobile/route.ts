import UserPMN from "@/lib/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/actions/db";


await connectDB();

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    const user = await UserPMN.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    return NextResponse.json({ message: "Connexion réussie" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    return NextResponse.json({ message: "Connexion réussie" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
