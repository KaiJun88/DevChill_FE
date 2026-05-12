import {
  ArrowLeft,
  Shield,
  Film,
  CreditCard,
  UserCheck,
  Lock,
  Scale,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();

  const policies = [
    {
      id: "account",
      icon: UserCheck,
      title: "1. Tài khoản & Đăng ký",
      content: (
        <ul className="list-disc pl-5 space-y-2 text-slate-600 leading-relaxed">
          <li>
            Người dùng phải cung cấp thông tin Email chính xác để nhận mã OTP và
            khôi phục tài khoản khi cần thiết.
          </li>
          <li>
            Bạn hoàn toàn chịu trách nhiệm về việc bảo mật thông tin đăng nhập
            (mật khẩu) của mình. DevChill sẽ không chịu trách nhiệm cho mọi thất
            thoát phát sinh do tài khoản bị lộ thông tin từ phía người dùng.
          </li>
          <li>
            DevChill có quyền khóa vĩnh viễn các tài khoản có hành vi gian lận,
            spam, hoặc chia sẻ tài khoản Premium cho nhiều người dùng khác một
            cách bất hợp pháp.
          </li>
        </ul>
      ),
    },
    {
      id: "copyright",
      icon: Film,
      title: "2. Bản quyền & Sở hữu trí tuệ",
      content: (
        <ul className="list-disc pl-5 space-y-2 text-slate-600 leading-relaxed">
          <li>
            Toàn bộ nội dung phim, hình ảnh, phụ đề và các dữ liệu liên quan
            trên hệ thống DevChill đều được bảo vệ bởi luật Sở hữu trí tuệ và
            bản quyền số (DMCA).
          </li>
          <li>
            Người dùng chỉ được phép truy cập và xem nội dung cho mục đích{" "}
            <strong>giải trí cá nhân</strong>. Mọi hành vi sao chép, tải xuống
            trái phép, quay phát lại (re-stream), hoặc sử dụng nội dung cho mục
            đích thương mại đều bị nghiêm cấm.
          </li>
          <li>
            Nếu phát hiện vi phạm bản quyền, DevChill sẽ ngay lập tức hủy bỏ
            dịch vụ và phối hợp với cơ quan pháp luật nếu cần thiết.
          </li>
        </ul>
      ),
    },
    {
      id: "payment",
      icon: CreditCard,
      title: "3. Chính sách Gói cước & Thanh toán",
      content: (
        <ul className="list-disc pl-5 space-y-2 text-slate-600 leading-relaxed">
          <li>
            Các giao dịch thanh toán Premium được xử lý qua các cổng thanh toán
            an toàn (VNPay, Momo). DevChill <strong>không</strong> lưu trữ trực
            tiếp thông tin thẻ ngân hàng của bạn.
          </li>
          <li>
            <strong>Chính sách hoàn tiền:</strong> Do đặc thù là dịch vụ nội
            dung số (Digital Content), mọi giao dịch mua gói Premium đã kích
            hoạt thành công sẽ <strong>không được hoàn tiền</strong> dưới mọi
            hình thức.
          </li>
          <li>
            Trường hợp người dùng mua thêm gói mới khi gói cũ vẫn còn hạn
            (Active), thời gian sử dụng sẽ được hệ thống{" "}
            <strong>cộng dồn tự động</strong> một cách minh bạch.
          </li>
        </ul>
      ),
    },
    {
      id: "privacy",
      icon: Lock,
      title: "4. Bảo mật dữ liệu & Quyền riêng tư",
      content: (
        <ul className="list-disc pl-5 space-y-2 text-slate-600 leading-relaxed">
          <li>
            DevChill cam kết bảo vệ quyền riêng tư của bạn. Mật khẩu được mã hóa
            an toàn một chiều (Hashing) trước khi lưu vào cơ sở dữ liệu.
          </li>
          <li>
            Chúng tôi tuyệt đối không bán, trao đổi hoặc cho thuê thông tin cá
            nhân (Email, Lịch sử xem phim) của người dùng cho bất kỳ bên thứ ba
            nào vì mục đích quảng cáo mà không có sự đồng ý.
          </li>
        </ul>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#F0F6FC] text-slate-800 overflow-x-hidden font-['Be_Vietnam_Pro',sans-serif] antialiased selection:bg-blue-500 selection:text-white">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 flex gap-1 md:gap-3 -rotate-6 select-none pointer-events-none">
          {"DEVCHILL".split("").map((char, index) => (
            <span
              key={index}
              className="text-[6rem] md:text-[12rem] lg:text-[16rem] font-black tracking-tighter text-blue-900 opacity-[0.04] animate-wave-flag inline-block"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-20">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 font-semibold transition-colors bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-slate-200 shadow-sm w-fit"
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>
        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Scale size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
              Điều khoản Dịch vụ & Chính sách Pháp lý
            </h1>
            <p className="text-slate-500 font-medium">
              Cập nhật lần cuối: Tháng 4, 2026
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed mb-10 text-lg text-center px-4 md:px-10">
              Chào mừng bạn đến với <strong>DevChill</strong>. Bằng việc đăng ký
              tài khoản và sử dụng dịch vụ của chúng tôi (bao gồm nền tảng web
              và ứng dụng), bạn đồng ý tuân thủ các quy định và điều khoản dưới
              đây.
            </p>

            <div className="space-y-12">
              {policies.map((section) => {
                const Icon = section.icon;
                return (
                  <div key={section.id} className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-100 rounded-full"></div>

                    <div className="pl-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                          <Icon size={20} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 m-0">
                          {section.title}
                        </h2>
                      </div>

                      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                        {section.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-16 pt-8 border-t border-slate-200 text-center">
              <Shield className="mx-auto text-slate-300 mb-4" size={40} />
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Đội ngũ DevChill
              </h3>
              <p className="text-slate-500">
                Nếu bạn có bất kỳ câu hỏi nào về chính sách này, vui lòng liên
                hệ{" "}
                <a
                  href="mailto:support@devchill.com"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  support@devchill.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
