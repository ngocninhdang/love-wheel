import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { id, itemId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wheel = await prisma.wheel.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!wheel) {
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  }

  await prisma.wheelItem.delete({ where: { id: itemId } });
  return NextResponse.json({ ok: true });
}
