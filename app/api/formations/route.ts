import { connectDB } from "@/lib/actions/db";
import { NextResponse } from "next/server";
import ArtisanFormation from "@/lib/models/formartionmarchepublic";

await connectDB();

export async function GET() {
  try {
    const artisans = await ArtisanFormation.find().sort({ createdAt: -1 });
    return NextResponse.json(artisans, { status: 200 });
  } catch (error) {
    console.error("Formation GET API Error:", error);
    return NextResponse.json(
      { errorMessage: "Erreur lors de la récupération des données." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { data } = await req.json();

    console.log(data);

    // Validate required fields
    const requiredFields = [
      "prenom",
      "nom",
      "telephone",
      "genre",
      "cni",
      "validiteCni",
      "carteProfessionnelle",
      "validiteCartePro",
      "adresse",
      "region",
      "departement",
      "commune",
      "villageQuartier",
      "corpsMetiers",
      "entreprise",
      "ninea",
      "adresseEntreprise",
      "nombreEmployes",
      "anneesExperience",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { errorMessage: `Le champ ${field} est requis` },
          { status: 400 }
        );
      }
    }

    // Check if artisan already exists by phone
    const isArtisanExist = await ArtisanFormation.findOne({
      telephone: data.telephone,
    });

    if (isArtisanExist) {
      return NextResponse.json(
        { errorMessage: "Cet utilisateur est déjà enregistré." },
        { status: 409 }
      );
    }

    // Check for unique constraints
    const existingCni = await ArtisanFormation.findOne({ cni: data.cni });
    if (existingCni) {
      return NextResponse.json(
        { errorMessage: "Ce numéro CNI est déjà utilisé." },
        { status: 409 }
      );
    }

    const existingCartePro = await ArtisanFormation.findOne({
      carteProfessionnelle: data.carteProfessionnelle,
    });
    if (existingCartePro) {
      return NextResponse.json(
        {
          errorMessage: "Ce numéro de carte professionnelle est déjà utilisé.",
        },
        { status: 409 }
      );
    }

    const existingNinea = await ArtisanFormation.findOne({ ninea: data.ninea });
    if (existingNinea) {
      return NextResponse.json(
        { errorMessage: "Ce numéro NINEA est déjà utilisé." },
        { status: 409 }
      );
    }

    // Generate unique identifier
    const latestDoc = await ArtisanFormation.findOne().sort({
      identifiant: -1,
    });
    const ident = (latestDoc?.identifiant || 0) + 1;

    const newUser = {
      ...data,
      identifiant: ident,
    };

    const createNewArtisan = await ArtisanFormation.create(newUser);

    return NextResponse.json(
      {
        message: "Inscription réussie",
        data: createNewArtisan,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Formation API Error:", error);
    return NextResponse.json(
      { errorMessage: "Erreur lors de l'inscription. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
