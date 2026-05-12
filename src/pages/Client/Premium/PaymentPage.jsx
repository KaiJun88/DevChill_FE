import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Crown, Loader2, ArrowLeft } from 'lucide-react';
import { getPackageById } from '../../../data/packages';

const PAYMENT_METHODS = [
  { id: 'momo',  label: 'MoMo',                      desc: 'Ví điện tử MoMo',     emoji: '📱' },
  { id: 'card',  label: 'Thẻ tín dụng / ghi nợ',     desc: 'Visa, Mastercard, JCB', emoji: '💳' },
  { id: 'bank',  label: 'Chuyển khoản ngân hàng',     desc: 'Internet Banking',      emoji: '🏦' },
];

export default function PaymentPage() {
  const { packageId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const billingCycle = location.state?.billingCycle ?? 'monthly';
  const pkg = getPackageById(packageId);

  const [payMethod, setPayMethod] = useState('momo');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8FAFC' }}>
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: '#0F172A' }}>Không tìm thấy gói này.</p>
          <button
            onClick={() => navigate('/upgrade')}
            className="btn-cinematic px-6 py-2.5 rounded-xl text-sm font-bold"
          >
            Quay lại chọn gói
          </button>
        </div>
      </div>
    );
  }

  const displayPrice =
    billingCycle === 'yearly' && pkg.duration === 1
      ? Math.round(pkg.price * 0.72)
      : pkg.price;

  const handlePay = () => {
    if (!agreed) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/payment/success', { state: { packageId: pkg.id, packageName: pkg.name } });
    }, 2000);
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-8" style={{ background: '#F8FAFC' }}>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/upgrade')}
          className="flex items-center gap-2 text-sm mb-8 transition-colors hover:text-gray-900"
          style={{ color: '#64748B' }}
        >
          <ArrowLeft size={16} /> Quay lại chọn gói
        </button>
        <h1 className="text-3xl font-black mb-8" style={{ color: '#0F172A' }}>Thanh toán</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-5">
            <div
              className="p-5 rounded-2xl"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E0F2FE',
                boxShadow: '0 1px 6px rgba(14,165,233,0.08)',
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
                style={{ color: '#0EA5E9' }}
              >
                <Crown size={13} /> Thông tin thanh toán
              </p>

              <div className="space-y-3 text-sm">
                <Row label="Tên gói dịch vụ" value={pkg.name} valueColor={pkg.color} />
                <Row
                  label="Thời hạn sử dụng"
                  value={`${pkg.duration === 12 ? '365' : '30'} ngày kể từ ngày thanh toán`}
                />
                <Row
                  label="Giá gói"
                  value={`${displayPrice.toLocaleString('vi-VN')} ₫`}
                />
                {billingCycle === 'yearly' && pkg.duration === 1 && (
                  <Row label="Tiết kiệm" value="28% so với thanh toán hàng tháng" valueColor="#10B981" />
                )}
                <Row label="Thuế GTGT (VAT)" value="Đã bao gồm" valueColor="#10B981" />
              </div>

              <div
                className="border-t mt-4 pt-4 flex items-center justify-between"
                style={{ borderColor: '#E0F2FE' }}
              >
                <span className="font-bold" style={{ color: '#0F172A' }}>Tổng thanh toán</span>
                <span className="text-xl font-black" style={{ color: '#0EA5E9' }}>
                  {displayPrice.toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <label className="flex items-start gap-3 mt-4 cursor-pointer group">
                <div
                  onClick={() => setAgreed((v) => !v)}
                  className="mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
                  style={{
                    background: agreed ? '#00D4FF' : 'transparent',
                    border: `2px solid ${agreed ? '#00D4FF' : 'rgba(100,116,139,0.5)'}`,
                  }}
                >
                  {agreed && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-xs leading-relaxed" style={{ color: '#64748B' }}>
                  Bổ sung thông tin hóa đơn (không bắt buộc) và đồng ý với{' '}
                  <span className="underline" style={{ color: '#00D4FF' }}>Điều khoản dịch vụ</span>{' '}
                  và{' '}
                  <span className="underline" style={{ color: '#00D4FF' }}>Chính sách bảo mật</span>.
                </span>
              </label>
            </div>
            <div>
              <p className="text-sm font-semibold mb-3" style={{ color: '#94A3B8' }}>
                Phương thức thanh toán
              </p>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left"
                    style={{
                      background: payMethod === m.id ? '#EFF6FF' : '#FFFFFF',
                      border: `1px solid ${payMethod === m.id ? '#93C5FD' : '#E2E8F0'}`,
                    }}
                  >
                    <span className="text-xl">{m.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>{m.label}</p>
                      <p className="text-xs" style={{ color: '#64748B' }}>{m.desc}</p>
                    </div>
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{ borderColor: payMethod === m.id ? '#3B82F6' : '#CBD5E1' }}
                    >
                      {payMethod === m.id && (
                        <div className="w-2 h-2 rounded-full" style={{ background: '#3B82F6' }} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: QR / Confirm ── */}
          <div className="flex flex-col gap-5">
            <div
              className="p-6 rounded-2xl flex flex-col items-center gap-5"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
              }}
            >
              <p className="font-bold text-center" style={{ color: '#0F172A' }}>Quét mã QR để thanh toán</p>

              {/* QR Placeholder */}
              <div
                className="w-48 h-48 rounded-2xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: agreed ? '#fff' : '#F1F5F9',
                  border: '1px solid #E2E8F0',
                }}
              >
                {agreed ? (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=DEVCHILL_PAY_${pkg.id.toUpperCase()}_${displayPrice}`}
                    alt="QR Code"
                    className="w-full h-full rounded-xl"
                  />
                ) : (
                  <div className="text-center px-4">
                    <div className="text-3xl mb-2">🔒</div>
                    <p className="text-xs text-center" style={{ color: '#64748B' }}>
                      Vui lòng đồng ý điều khoản để hiện mã QR
                    </p>
                  </div>
                )}
              </div>

              <p className="text-xs text-center" style={{ color: '#64748B' }}>
                Mở app{' '}
                <span className="font-semibold text-white">
                  {payMethod === 'momo' ? 'MoMo' : payMethod === 'card' ? 'Banking' : 'Internet Banking'}
                </span>{' '}
                và quét mã để hoàn tất thanh toán
              </p>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={loading || !agreed}
              className="w-full py-3.5 rounded-xl font-bold text-black flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #00D4FF 0%, #0891B2 100%)',
                boxShadow: agreed ? '0 0 20px rgba(0,212,255,0.3)' : 'none',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Crown size={18} />
                  Xác nhận thanh toán
                </>
              )}
            </button>

            <p className="text-center text-xs" style={{ color: '#374151' }}>
              🔒 Giao dịch được bảo mật bởi SSL 256-bit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, valueColor }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span style={{ color: '#64748B' }}>{label}</span>
      <span className="font-semibold text-right" style={{ color: valueColor || '#fff' }}>
        {value}
      </span>
    </div>
  );
}
