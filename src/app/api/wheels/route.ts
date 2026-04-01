import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateShareCode } from "@/lib/utils";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wheels = await prisma.wheel.findMany({
    where: { userId: session.user.id },
    include: { items: true, _count: { select: { history: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(wheels);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Tên vòng quay không được trống" }, { status: 400 });
  }

  const wheel = await prisma.wheel.create({
    data: {
      name,
      userId: session.user.id,
      shareCode: generateShareCode(),
    },
  });

  return NextResponse.json(wheel);
}
