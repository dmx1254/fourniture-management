import { NextResponse } from "next/server";
import ContactModel from "@/lib/models/contact";
import { connectDB } from "@/lib/actions/db";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs requis doivent être remplis" },
        { status: 400 }
      );
    }

    const contact = await ContactModel.create({
      name,
      email,
      phone: phone || undefined,
      subject,
      message,
      isRead: false,
    });

    return NextResponse.json(
      {
        message:
          "Votre message a été envoyé avec succès, nous vous répondrons dans les plus brefs délais",
        contact,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const contacts = await ContactModel.find().sort({ createdAt: -1 });
    return NextResponse.json({ contacts }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des contacts:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des contacts" },
      { status: 500 }
    );
  }
}
