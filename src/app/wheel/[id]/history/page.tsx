"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SpinRecord {
  id: string;
  spunAt: string;
  winner: { name: string; description: string };
  spunBy: { name: string };
}

interface WheelData {
  id: string;
  name: string;
  history: SpinRecord[];
}

export default function HistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { status } = useSession();
  const router = useRouter();
  const [wheel, setWheel] = useState<WheelData | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch(`/api/wheels/${id}`)
        .then((r) => r.json())
        .then(setWheel);
    }
  }, [status, id]);

  if (!wheel) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin text-3xl">💫</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link
        href={`/wheel/${id}`}
        className="text-sm text-gray-400 hover:text-rose-500 transition"
      >
        ← Quay lại vòng quay
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 mt-2 mb-6">
        Lịch sử quay - {wheel.name}
      </h1>

      {wheel.history.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">📋</div>
          <p>Chưa có lần quay nào.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {wheel.history.map((record, i) => (
            <div
              key={record.id}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
                #{wheel.history.length - i}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  🎁 {record.winner.name}
                </p>
                {record.winner.description && (
                  <p className="text-sm text-gray-400">{record.winner.description}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{record.spunBy.name}</p>
                <p className="text-xs text-gray-400">
                  {new Date(record.spunAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
