/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Home,
  RotateCcw,
  ReceiptText,
} from "lucide-react";
import { toast } from "react-toastify";
import { planApi } from "../../../api/planApi";

// Hàm hỗ trợ format thời gian trả về từ VNPay (YYYYMMDDHHmmss -> HH:mm:ss DD/MM/YYYY)
const formatVnpDate = (dateString) => {
  if (!dateString || dateString.length !== 14) return "";
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  const hour = dateString.substring(8, 10);
  const minute = dateString.substring(10, 12);
  const second = dateString.substring(12, 14);
  return `${hour}:${minute}:${second} - ${day}/${month}/${year}`;
};

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  // Cờ chặn React StrictMode gọi API 2 lần liên tiếp
  const hasVerified = useRef(false);

  // Trích xuất các tham số quan trọng từ URL VNPay trả về
  const responseCode = searchParams.get("vnp_ResponseCode");
  const txnRef = searchParams.get("vnp_TxnRef");
  const amount = searchParams.get("vnp_Amount");
  const transactionNo = searchParams.get("vnp_TransactionNo");
  const bankCode = searchParams.get("vnp_BankCode");
  const payDate = searchParams.get("vnp_PayDate");
  const orderInfo = searchParams.get("vnp_OrderInfo");

  useEffect(() => {
    if (hasVerified.current) return;

    const verifyPayment = async () => {
      hasVerified.current = true;

      if (responseCode !== "00") {
        setStatus("failed");
        toast.error("Giao dịch đã bị hủy hoặc thất bại!", {
          toastId: "payment_fail",
        });
        return;
      }

      try {
        const res = await planApi.checkPaymentStatus(txnRef);
        if (res && res.status === "success") {
          setStatus("success");
          toast.success("Tuyệt vời! Thanh toán thành công.", {
            toastId: "payment_success",
          });
        } else {
          setStatus("failed");
          toast.error("Giao dịch đang chờ hoặc bị lỗi.", {
            toastId: "payment_pending",
          });
        }
      } catch (error) {
        setStatus("failed");
        toast.error("Lỗi xác minh từ máy chủ.", { toastId: "payment_error" });
      }
    };

    if (txnRef && responseCode) {
      verifyPayment();
    } else {
      setStatus("failed");
    }
  }, [txnRef, responseCode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      {/* Box layout nhỏ gọn, tinh tế max-w-sm */}
      <div className="max-w-sm w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 p-8 text-center">
        {/* State: Đang xử lý */}
        {status === "loading" && (
          <div className="flex flex-col items-center py-6">
            <Loader2 size={48} className="text-sky-500 animate-spin mb-5" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Đang xác minh...
            </h2>
            <p className="text-sm text-slate-500">
              Vui lòng không đóng trang này.
            </p>
          </div>
        )}

        {/* State: Thành công */}
        {status === "success" && (
          <div className="animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 relative">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Thanh toán thành công!
            </h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Đặc quyền VIP của bạn đã được kích hoạt. Dưới đây là biên lai giao
              dịch.
            </p>

            {/* Khối hiển thị Biên lai (Receipt) */}
            <div className="bg-slate-50/70 rounded-xl mb-6 border border-slate-200 text-left overflow-hidden">
              <div className="bg-slate-100/50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                <ReceiptText size={16} className="text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">
                  Chi tiết giao dịch
                </span>
              </div>

              <div className="p-4 space-y-3 text-sm">
                {amount && (
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200 border-dashed">
                    <span className="text-slate-500">Số tiền:</span>
                    <span className="text-lg font-black text-slate-900">
                      {(Number(amount) / 100).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                )}

                {transactionNo && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Mã giao dịch:</span>
                    <span className="font-medium text-slate-900">
                      {transactionNo}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Mã đơn hàng:</span>
                  <span className="font-medium text-slate-900">{txnRef}</span>
                </div>

                {bankCode && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Ngân hàng:</span>
                    <span className="font-medium text-slate-900">
                      {bankCode}
                    </span>
                  </div>
                )}

                {payDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Thời gian:</span>
                    <span className="font-medium text-slate-900">
                      {formatVnpDate(payDate)}
                    </span>
                  </div>
                )}

                {/* Tùy chọn: Hiển thị thêm thông tin nội dung thanh toán nếu muốn */}
                {/* {orderInfo && (
                  <div className="flex justify-between items-start gap-4 pt-3 border-t border-slate-200 border-dashed">
                    <span className="text-slate-500 whitespace-nowrap">Nội dung:</span>
                    <span className="font-medium text-slate-900 text-right">{decodeURIComponent(orderInfo.replace(/\+/g, ' '))}</span>
                  </div>
                )} */}
              </div>
            </div>

            <Link
              to="/"
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Home size={16} /> Về trang chủ
            </Link>
          </div>
        )}

        {/* State: Thất bại */}
        {status === "failed" && (
          <div className="animate-in fade-in duration-300">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <XCircle size={40} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Giao dịch thất bại
            </h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Giao dịch đã bị hủy hoặc có lỗi xảy ra. Tài khoản của bạn không bị
              trừ tiền.
            </p>

            {/* Vẫn có thể show mã đơn hàng bị lỗi để user dễ báo cáo hỗ trợ */}
            {txnRef && (
              <div className="bg-slate-50 p-3 rounded-lg mb-6 border border-slate-100 flex justify-between items-center text-sm">
                <span className="text-slate-500">Mã tham chiếu:</span>
                <span className="font-mono font-medium text-slate-800">
                  {txnRef}
                </span>
              </div>
            )}

            <button
              onClick={() => navigate("/premium")}
              className="w-full py-3 bg-sky-500 text-white rounded-xl font-bold text-sm hover:bg-sky-600 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-sky-500/20"
            >
              <RotateCcw size={16} /> Thử thanh toán lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
