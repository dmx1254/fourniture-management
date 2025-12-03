import { NextResponse } from "next/server";

interface PHONE {
  phone: string;
  fullname: string;
}

export async function POST(req: Request) {
  try {
    const { phones } = await req.json();
    const smsResults = await Promise.all(
      phones.map(async (phone: PHONE) => {
        try {
          const res = await fetch(
            `${process.env.AXIOMTEXT_API_URL_MESSAGE}message`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.AXIOMTEXT_API_KEY!}`,
              },
              body: JSON.stringify({
                to: phone.phone,
                message: `Bonjour, ${phone.fullname}, vous avez une demande d'absence en attente de validation. Voici le lien: https://pmn.vercel.app/dashboard/absences`,
                signature: "PMN",
              }),
            }
          );

        //   const data = await res.json();
        //   console.log(data);
          return { success: true, phone: phone.phone };
        } catch (error) {
          console.log(`Erreur SMS pour ${phone.fullname}:`, error);
          return { success: false, phone: phone.phone, error };
        }
      })
    );
    console.log(smsResults);
    return NextResponse.json(
      { message: "SMS envoyés avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi des SMS" },
      { status: 500 }
    );
  }
}
