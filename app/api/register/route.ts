import UserPMN from "@/lib/models/user";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/actions/db";

// const accessCodes = [""];
// const accessEmails = [""];

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const {
      email,
      phone,
      firstname,
      lastname,
      occupation,
      identicationcode,
      password,
    } = data;

    // if (!accessCodes.includes(identicationcode)) {
    //   return NextResponse.json(
    //     { errorMessage: "Code d'accès invalide" },
    //     { status: 500 }
    //   );
    // }

    return;

    // if (!accessEmails.includes(email)) {
    //   return NextResponse.json(
    //     { errorMessage: "Email invalide" },
    //     { status: 500 }
    //   );
    // }

    const isEmailAlreadyUsed = await UserPMN.findOne({ email });

    if (isEmailAlreadyUsed) {
      return NextResponse.json(
        { errorMessage: "Email déjà utilisé" },
        { status: 500 }
      );
    }

    const isPhoneAlreadyUsed = await UserPMN.findOne({ phone });

    if (isPhoneAlreadyUsed) {
      return NextResponse.json(
        { errorMessage: "Téléphone déjà utilisé" },
        { status: 500 }
      );
    }

    const isIdenticationCodeAlreadyUsed = await UserPMN.findOne({
      identicationcode,
    });

    if (isIdenticationCodeAlreadyUsed) {
      return NextResponse.json(
        { errorMessage: "Code d'accès déjà utilisé" },
        { status: 500 }
      );
    }

    const sendOtp = await fetch(`${process.env.AXIOMTEXT_API_URL}send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AXIOMTEXT_API_KEY!}`,
      },
      body: JSON.stringify({ phone, signature: "PMN" }),
    });

    const sendOtpData = await sendOtp.json();

    if (sendOtpData.success) {
      return NextResponse.json({ message: "Code OTP envoyé" }, { status: 200 });
    }

    return NextResponse.json(
      {
        errorMessage: sendOtpData.error || "Erreur lors de l'envoi du code OTP",
      },
      { status: 500 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { errorMessage: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}
