"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-rose-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-rose-600 text-lg">
          <span className="text-2xl">💕</span>
          Love Wheel
        </Link>

        <nav className="flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-rose-600 transition"
              >
                Vòng quay của tôi
              </Link>
              <span className="text-sm text-gray-400">{session.user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-gray-500 hover:text-rose-600 transition"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-rose-600 transition"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="text-sm bg-rose-600 text-white px-4 py-1.5 rounded-full hover:bg-rose-700 transition"
              >
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
