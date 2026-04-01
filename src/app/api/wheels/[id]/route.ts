import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wheel = await prisma.wheel.findUnique({
    where: { id, userId: session.user.id },
    include: {
      items: { orderBy: { createdAt: "asc" } },
      history: {
        include: { winner: true, spunBy: true },
        orderBy: { spunAt: "desc" },
        take: 10,
      },
    },
  });

  if (!wheel) {
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  }

  return NextResponse.json(wheel);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const wheel = await prisma.wheel.update({
    where: { id, userId: session.user.id },
    data: { removeOnWin: body.removeOnWin },
  });

  return NextResponse.json(wheel);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.wheel.delete({ where: { id, userId: session.user.id } });
  return NextResponse.json({ ok: true });
}
