import UserPMN from "@/lib/models/user";
import axios from "axios";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/actions/db";

import bcrypt from "bcrypt";

await connectDB();

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // console.log("new data", data.data);
    // const newPhone = data.data.phone;

    // const verifyOtp = await fetch(`${process.env.AXIOMTEXT_API_URL}verify`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${process.env.AXIOMTEXT_API_KEY!}`,
    //   },
    //   body: JSON.stringify({ phone: data.data.phone, code: data.data.code }),
    // });

    // const verifyOtpData = await verifyOtp.json();

    // console.log("verifyOtpData", verifyOtpData);

    const verifyOtpData = { success: true };

    if (verifyOtpData.success) {
      const passwordHash = await bcrypt.hash(data.password, 10);
      await UserPMN.create({
        email: data.email,
        phone: data.phone,
        firstname: data.firstname,
        lastname: data.lastname,
        occupation: data.occupation,
        password: passwordHash,
        identicationcode: data.identicationcode,
        role: "user",
      });

      return NextResponse.json(
        { message: "Inscription réussie" },
        { status: 200 }
      );
    }

    // console.log("verifyOtpData", verifyOtpData);

    return NextResponse.json(
      { errorMessage: verifyOtpData.error || "Code OTP invalide" },
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
