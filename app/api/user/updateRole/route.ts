import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/option";
import UserPMN from "@/lib/models/user";

export async function POST(req: Request) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { role } = await req.json();

    await UserPMN.findByIdAndUpdate(
      session.user.id,
      { role },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ message: "Role updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
