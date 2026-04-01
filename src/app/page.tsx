import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="text-7xl mb-6">💝</div>
      <h1 className="text-4xl font-bold text-rose-700 mb-4">
        Love Wheel
      </h1>
      <p className="text-xl text-rose-500 mb-2">Vòng Quay May Mắn Cho Cặp Đôi</p>
      <p className="text-gray-500 mb-10 max-w-md mx-auto">
        Thêm những món quà bạn muốn, quay vòng quay và để số phận quyết định!
        Người yêu sẽ mua món quà mà vòng quay chọn.
      </p>

      <div className="flex gap-4 justify-center">
        <Link
          href="/register"
          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition transform hover:scale-105 shadow-lg"
        >
          Bắt đầu ngay
        </Link>
        <Link
          href="/login"
          className="border-2 border-rose-300 text-rose-600 hover:bg-rose-50 font-semibold py-3 px-8 rounded-full text-lg transition"
        >
          Đăng nhập
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-sm">
          <div className="text-3xl mb-3">🎁</div>
          <h3 className="font-semibold text-gray-800 mb-1">Thêm món đồ</h3>
          <p className="text-sm text-gray-500">
            Ghi tên và mô tả những món đồ bạn muốn được tặng lên vòng quay.
          </p>
        </div>
        <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-sm">
          <div className="text-3xl mb-3">🎰</div>
          <h3 className="font-semibold text-gray-800 mb-1">Quay ngẫu nhiên</h3>
          <p className="text-sm text-gray-500">
            Nhấn quay và để vòng quay chọn ngẫu nhiên một món đồ cho bạn.
          </p>
        </div>
        <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-sm">
          <div className="text-3xl mb-3">📝</div>
          <h3 className="font-semibold text-gray-800 mb-1">Lưu lịch sử</h3>
          <p className="text-sm text-gray-500">
            Mọi lần quay đều được lưu lại để bạn theo dõi và xem lại.
          </p>
        </div>
      </div>
    </div>
  );
}
