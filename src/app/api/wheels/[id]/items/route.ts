import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSegmentColor } from "@/lib/utils";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wheel = await prisma.wheel.findUnique({
    where: { id, userId: session.user.id },
    include: { items: true },
  });

  if (!wheel) {
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  }

  const { name, description } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Tên món đồ không được trống" }, { status: 400 });
  }

  const item = await prisma.wheelItem.create({
    data: {
      wheelId: id,
      name,
      description: description || "",
      color: getSegmentColor(wheel.items.length),
    },
  });

  return NextResponse.json(item);
}
