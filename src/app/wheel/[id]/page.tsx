"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SpinWheel } from "@/components/wheel/spin-wheel";

interface WheelItem {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface SpinRecord {
  id: string;
  spunAt: string;
  winnerName: string;
  winner: { name: string } | null;
  spunBy: { name: string };
}

interface WheelData {
  id: string;
  name: string;
  shareCode: string;
  removeOnWin: boolean;
  items: WheelItem[];
  history: SpinRecord[];
}

export default function WheelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { status } = useSession();
  const router = useRouter();
  const [wheel, setWheel] = useState<WheelData | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [adding, setAdding] = useState(false);
  const [winner, setWinner] = useState<WheelItem | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const fetchWheel = () => {
    fetch(`/api/wheels/${id}`)
      .then((r) => r.json())
      .then(setWheel);
  };

  useEffect(() => {
    if (status === "authenticated") fetchWheel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, id]);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    setAdding(true);

    await fetch(`/api/wheels/${id}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: itemName, description: itemDesc }),
    });

    setItemName("");
    setItemDesc("");
    setAdding(false);
    fetchWheel();
  };

  const deleteItem = async (itemId: string) => {
    await fetch(`/api/wheels/${id}/items/${itemId}`, { method: "DELETE" });
    fetchWheel();
  };

  const toggleRemoveOnWin = async () => {
    if (!wheel) return;
    await fetch(`/api/wheels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ removeOnWin: !wheel.removeOnWin }),
    });
    fetchWheel();
  };

  const deleteWheel = async () => {
    if (!confirm("Bạn có chắc muốn xóa vòng quay này?")) return;
    await fetch(`/api/wheels/${id}`, { method: "DELETE" });
    router.push("/dashboard");
  };

  if (!wheel) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin text-3xl">💫</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 hover:text-rose-500 transition"
          >
            ← Quay lại
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-1">
            {wheel.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/wheel/${id}/history`}
            className="text-sm border border-gray-200 hover:border-rose-300 text-gray-600 hover:text-rose-600 px-4 py-2 rounded-lg transition"
          >
            📋 Lịch sử
          </Link>
          <button
            onClick={deleteWheel}
            className="text-sm border border-gray-200 hover:border-red-300 text-gray-400 hover:text-red-500 px-4 py-2 rounded-lg transition"
          >
            Xóa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Wheel */}
        <div className="flex justify-center">
          <SpinWheel
            items={wheel.items}
            wheelId={id}
            onSpinComplete={(w) => {
              setWinner(w);
              fetchWheel();
            }}
          />
        </div>

        {/* Items panel */}
        <div>
          {/* Remove on win toggle */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">Xóa món khi trúng</p>
              <p className="text-xs text-gray-400">Trúng món nào thì tự động xóa khỏi vòng quay</p>
            </div>
            <button
              onClick={toggleRemoveOnWin}
              className={`relative w-11 h-6 rounded-full transition ${
                wheel.removeOnWin ? "bg-rose-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  wheel.removeOnWin ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          {/* Add item form */}
          <form onSubmit={addItem} className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <h3 className="font-semibold text-gray-700 mb-3">Thêm món đồ</h3>
            <div className="space-y-2">
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Tên món đồ (VD: Túi xách)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                required
              />
              <input
                type="text"
                value={itemDesc}
                onChange={(e) => setItemDesc(e.target.value)}
                placeholder="Mô tả (VD: Túi xách màu hồng từ Zara)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <button
                type="submit"
                disabled={adding}
                className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-gray-300 text-white font-semibold py-2 rounded-lg transition text-sm"
              >
                {adding ? "Đang thêm..." : "Thêm"}
              </button>
            </div>
          </form>

          {/* Item list */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-700 mb-3">
              Danh sách ({wheel.items.length} món)
            </h3>
            {wheel.items.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                Chưa có món đồ nào
              </p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {wheel.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group"
                  >
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {item.name}
                      </p>
                      {item.description && (
                        <p className="text-xs text-gray-400 truncate">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent spins */}
          {wheel.history.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
              <h3 className="font-semibold text-gray-700 mb-3">Quay gần đây</h3>
              <div className="space-y-2">
                {wheel.history.slice(0, 5).map((h) => (
                  <div key={h.id} className="flex items-center justify-between text-sm">
                    <span className="text-rose-600 font-medium">
                      🎁 {h.winnerName}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(h.spunAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Winner modal */}
      {winner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-rose-600 mb-2">
              {winner.name}
            </h2>
            {winner.description && (
              <p className="text-gray-500 mb-4">{winner.description}</p>
            )}
            <p className="text-sm text-gray-400 mb-6">
              Vòng quay đã chọn! Hãy mua món này nhé!
            </p>
            <button
              onClick={() => setWinner(null)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 px-8 rounded-full transition"
            >
              OK!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
