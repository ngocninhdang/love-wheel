"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Wheel {
  id: string;
  name: string;
  shareCode: string;
  createdAt: string;
  items: { id: string }[];
  _count: { history: number };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wheels, setWheels] = useState<Wheel[]>([]);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/wheels")
        .then((r) => r.json())
        .then(setWheels);
    }
  }, [session]);

  const createWheel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);

    const res = await fetch("/api/wheels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });

    const wheel = await res.json();
    router.push(`/wheel/${wheel.id}`);
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin text-3xl">💫</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Vòng quay của tôi
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-5 rounded-full transition text-sm"
        >
          + Tạo vòng quay
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={createWheel}
          className="bg-white rounded-xl shadow p-4 mb-6 flex gap-3"
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tên vòng quay (VD: Quà sinh nhật)"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
            autoFocus
          />
          <button
            type="submit"
            disabled={creating}
            className="bg-rose-600 hover:bg-rose-700 disabled:bg-gray-300 text-white font-semibold py-2 px-5 rounded-lg transition"
          >
            {creating ? "..." : "Tạo"}
          </button>
        </form>
      )}

      {wheels.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🎡</div>
          <p>Bạn chưa có vòng quay nào.</p>
          <p className="text-sm mt-1">Nhấn &quot;Tạo vòng quay&quot; để bắt đầu!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {wheels.map((wheel) => (
            <Link
              key={wheel.id}
              href={`/wheel/${wheel.id}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 flex items-center justify-between group"
            >
              <div>
                <h2 className="font-semibold text-gray-800 group-hover:text-rose-600 transition">
                  {wheel.name}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {wheel.items.length} món đồ · {wheel._count.history} lần quay
                </p>
              </div>
              <span className="text-gray-300 group-hover:text-rose-400 transition text-xl">
                →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
