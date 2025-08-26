import UserPMN from "@/lib/models/user";
import axios from "axios";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/actions/db";

const accessCodes = [
  "pmn_JST12",
  "pmn_DNW23",
  "pmn_KZT45",
  "pmn_LQW67",
  "pmn_MZX89",
  "pmn_NBY01",
  "pmn_OCV23",
  "pmn_PDX45",
  "pmn_QAS67",
  "pmn_RCT89",
  "pmn_SDW01",
  "pmn_TEZ23",
  "pmn_UFX45",
  "pmn_VGB67",
  "pmn_WJY89",
];

const accessEmails = [
  "aminata.diouf@pmn.sn",
  "ba.ramatoulaye@pmn.sn",
  "bassirou.sy@pmn.sn",
  "coumbadoudou.diatta@pmn.sn",
  "diouf.modou@pmn.sn",
  "fall.aminata@pmn.sn",
  "faye.ndeyekhane@pmn.sn",
  "faye.rose@pmn.sn",
  "harouna.sylla@pmn.sn",
  "mamadousy@pmn.sn",
  "papa.elamadou.gaye@pmn.sn",
  "sarr.mameadam@pmn.sn",
  "tall.ibrahima@pmn.sn",
  "sarr.mameadam@pmn.sn",
];

await connectDB();

export async function POST(req: Request) {
  try {
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

    if (!accessCodes.includes(identicationcode)) {
      return NextResponse.json(
        { errorMessage: "Code d'accès invalide" },
        { status: 500 }
      );
    }

    if (!accessEmails.includes(email)) {
      return NextResponse.json(
        { errorMessage: "Email invalide" },
        { status: 500 }
      );
    }

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
