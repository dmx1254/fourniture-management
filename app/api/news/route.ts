import { NextResponse } from "next/server";
import NewsModel from "@/lib/models/news";
import { connectDB } from "@/lib/actions/db";

export async function GET() {
  try {
    await connectDB();
    const news = await NewsModel.find().sort({ createdAt: -1 });
    return NextResponse.json({ news }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { errorMessage: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, image, author, tags } = body;
    await connectDB();
    await NewsModel.create({ title, content, image, author, tags });
    return NextResponse.json(
      { message: "News cree avec succes" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { errorMessage: "Erreur lors de la creation de la news" },
      { status: 500 }
    );
  }
}
