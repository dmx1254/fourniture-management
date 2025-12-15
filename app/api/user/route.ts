import UserPMN from "@/lib/models/user";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/actions/db";

export async function GET() {
  try {
    await connectDB();
    const users = await UserPMN.find();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
