import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
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
    include: { items: true },
  });

  if (!wheel) {
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  }

  if (wheel.items.length < 2) {
    return NextResponse.json(
      { error: "Cần ít nhất 2 món đồ để quay" },
      { status: 400 }
    );
  }

  // Random pick
  const winnerIndex = Math.floor(Math.random() * wheel.items.length);
  const winner = wheel.items[winnerIndex];

  // Save history with winner name (persists even if item is deleted)
  const record = await prisma.spinHistory.create({
    data: {
      wheelId: id,
      winnerId: winner.id,
      winnerName: winner.name,
      spunById: session.user.id,
    },
    include: { winner: true },
  });

  // Remove winning item if option is enabled
  if (wheel.removeOnWin) {
    await prisma.wheelItem.delete({ where: { id: winner.id } });
  }

  return NextResponse.json({ ...record, winnerIndex, removed: wheel.removeOnWin });
}
