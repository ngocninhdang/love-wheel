"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import confetti from "canvas-confetti";

interface WheelItem {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface SpinWheelProps {
  items: WheelItem[];
  wheelId: string;
  onSpinComplete?: (winner: WheelItem) => void;
}

export function SpinWheel({ items, wheelId, onSpinComplete }: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const animationRef = useRef<number>(0);

  const size = 340;
  const center = size / 2;
  const radius = center - 10;

  const drawWheel = useCallback(
    (currentRotation: number) => {
      const canvas = canvasRef.current;
      if (!canvas || items.length === 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, size, size);
      const sliceAngle = (2 * Math.PI) / items.length;

      items.forEach((item, i) => {
        const startAngle = currentRotation + i * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 13px sans-serif";
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 2;
        const label =
          item.name.length > 12 ? item.name.slice(0, 12) + "…" : item.name;
        ctx.fillText(label, radius - 15, 5);
        ctx.restore();
      });

      // Center circle
      ctx.beginPath();
      ctx.arc(center, center, 22, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = "#E11D48";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Heart in center
      ctx.font = "18px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("💗", center, center);
    },
    [items, center, radius, size]
  );

  useEffect(() => {
    drawWheel(rotation);
  }, [drawWheel, rotation]);

  const spin = async () => {
    if (isSpinning || items.length < 2) return;
    setIsSpinning(true);

    try {
      const res = await fetch(`/api/wheels/${wheelId}/spin`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        setIsSpinning(false);
        return;
      }

      const winnerIndex: number = data.winnerIndex;
      const sliceAngle = (2 * Math.PI) / items.length;
      // Target: the pointer is at the right (angle 0). We need to rotate so that
      // the winning segment's center is at the pointer position.
      const targetSegmentCenter = winnerIndex * sliceAngle + sliceAngle / 2;
      // We rotate clockwise, so we need (2π - targetSegmentCenter) + extra full rotations
      const extraRotations = 5 * 2 * Math.PI; // 5 full spins
      const targetRotation =
        rotationRef.current +
        extraRotations +
        (2 * Math.PI - targetSegmentCenter - (rotationRef.current % (2 * Math.PI)));

      const startRotation = rotationRef.current;
      const totalDelta = targetRotation - startRotation;
      const duration = 4000;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Cubic ease-out
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = startRotation + totalDelta * eased;

        rotationRef.current = current;
        setRotation(current);
        drawWheel(current);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsSpinning(false);
          // Confetti!
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#E11D48", "#F472B6", "#F59E0B", "#EC4899"],
          });
          onSpinComplete?.(data.winner);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    } catch {
      setIsSpinning(false);
      alert("Có lỗi xảy ra khi quay!");
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[340px] text-gray-400">
        <span className="text-5xl mb-3">🎡</span>
        <p>Thêm món đồ để bắt đầu quay!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Pointer */}
        <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 z-10 text-rose-600 text-2xl drop-shadow-lg">
          ▶
        </div>
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="drop-shadow-xl"
        />
      </div>

      <button
        onClick={spin}
        disabled={isSpinning || items.length < 2}
        className="bg-rose-600 hover:bg-rose-700 disabled:bg-gray-300 text-white font-bold py-3 px-10 rounded-full text-lg transition transform hover:scale-105 active:scale-95 disabled:transform-none shadow-lg"
      >
        {isSpinning ? "Đang quay..." : "🎰 QUAY!"}
      </button>
    </div>
  );
}
