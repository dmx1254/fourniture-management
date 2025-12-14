import UserPMN from "@/lib/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/actions/db";

export async function POST(req: Request) {
  const { email, password, identicationcode } = await req.json();

  try {
    await connectDB();
    const user = await UserPMN.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { errorMessage: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const isIdenticationCorrect = user.identicationcode
    if (isIdenticationCorrect !== identicationcode) {
      return NextResponse.json(
        { errorMessage: "Code d'accès incorrect" },
        { status: 401 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { errorMessage: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    const userData = await UserPMN.findOne({ email });

    if (!userData) {
      return NextResponse.json(
        { errorMessage: "Une erreur est survenue" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { user: userData, message: "Connexion réussie" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { errorMessage: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    return NextResponse.json({ message: "Connexion réussie" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { errorMessage: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
