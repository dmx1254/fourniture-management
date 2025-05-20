import { NextRequest, NextResponse } from "next/server";
import TransactionModel from "@/lib/actions/transaction";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = await params;
  // console.log(userId);
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    TransactionModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    TransactionModel.countDocuments({ userId }),
  ]);

  return NextResponse.json({ data, total });
}
