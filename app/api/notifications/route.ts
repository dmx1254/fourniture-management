import { NextResponse } from "next/server";
import NotificationModel from "@/lib/models/notifications";
import { connectDB } from "@/lib/actions/db";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const query: any = {};
    if (userId) {
      query.userId = userId;
    }

    const notifications = await NotificationModel.find(query).sort({
      createdAt: -1,
    });
    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { content, userId, type, urgency, isRead } = await req.json();
    const notification = await NotificationModel.create({
      content,
      userId,
      type,
      urgency,
      isRead,
    });
    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { notificationId } = await req.json();
    const notification = await NotificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    return NextResponse.json({ notification }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
