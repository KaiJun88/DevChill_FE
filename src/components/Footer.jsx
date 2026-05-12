import {
  FaTelegramPlane,
  FaDiscord,
  FaTimes,
  FaFacebookF,
  FaTiktok,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import anhlogoweb from "../assets/devchill-logo.png";

export default function Footer() {
  return (
    <footer className="relative bg-blue-50/90 backdrop-blur-md text-gray-800 border-t border-blue-100/50">
      <div className="absolute inset-0 bg-linear-to-t from-blue-100/40 to-transparent pointer-events-none" />

      <div className="w-full flex justify-center py-2 relative z-10">
        <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm">
          <svg viewBox="0 0 30 20" className="w-5 h-3.5">
            <rect width="30" height="20" fill="#DA1212" />
            <polygon
              points="15,3 17,9 23,9 18,12.5 20,18 15,14.5 10,18 12,12.5 7,9 13,9"
              fill="#FFEB3B"
            />
          </svg>
          <span>Hoàng Sa & Trường Sa là của Việt Nam</span>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-tr from-blue-500 to-indigo-500 rounded-full p-0.5 shadow-sm">
                <img
                  src={anhlogoweb}
                  className="w-12 h-12 rounded-full bg-white object-cover"
                />
              </div>

              <div>
                <h2 className="font-bold text-blue-700 text-lg tracking-tight">
                  🎬 DevChill
                </h2>
                <p className="text-xs text-blue-600/80 font-medium">
                  Phim hay cả rổ
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              🎬 DevChill — xem phim online miễn phí, Vietsub & thuyết minh.
            </p>

            <div className="flex items-center gap-2 mt-1">
              {[
                FaTelegramPlane,
                FaDiscord,
                FaTimes,
                FaFacebookF,
                FaTiktok,
                FaYoutube,
                FaInstagram,
              ].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="bg-white/60 hover:bg-blue-100 border border-blue-100/50 p-2 rounded-full transition-colors shadow-sm"
                >
                  <Icon className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 tracking-tight">
              Trang
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              {["Hỏi-Đáp", "Chính sách bảo mật", "Điều khoản sử dụng"].map(
                (t, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {t}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 tracking-tight">
              Danh mục
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              {["Dongphim", "Ghienphim", "Motphim", "Subnhanh"].map((t, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 tracking-tight">
              Liên hệ
            </h3>
            <ul className="space-y-2.5 text-sm font-medium text-gray-600">
              {["Liên hệ quảng cáo", "Gửi link phim", "Báo lỗi nội dung"].map(
                (t, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {t}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-blue-100/50 text-center py-4 text-xs font-medium text-gray-500 bg-white/20">
        © {new Date().getFullYear()} 🎬 DevChill — Bản Quyền Thuộc Về KaiJun
      </div>
    </footer>
  );
}
