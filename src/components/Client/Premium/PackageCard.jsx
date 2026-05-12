import { Crown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PackageCard({ pkg, billingCycle }) {
  const navigate = useNavigate();

  const displayPrice =
    billingCycle === 'yearly' && pkg.duration === 1
      ? Math.round(pkg.price * 0.72)
      : pkg.price;

  const handleSubscribe = () => {
    navigate(`/payment/${pkg.id}`, { state: { billingCycle } });
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] flex flex-col"
      style={{
        background: '#FFFFFF',
        border: `2px solid ${pkg.popular ? pkg.color : '#E2E8F0'}`,
        boxShadow: pkg.popular
          ? `0 4px 24px ${pkg.color}30`
          : '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* Popular badge */}
      {pkg.popular && (
        <div
          className="text-center py-1.5 text-xs font-black tracking-wider"
          style={{ background: pkg.color, color: '#fff' }}
        >
          ⭐ PHỔ BIẾN NHẤT
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
          style={{
            background: `${pkg.color}18`,
            border: `1px solid ${pkg.color}40`,
          }}
        >
          <Crown size={18} style={{ color: pkg.color }} />
        </div>

        {/* Name */}
        <h3 className="text-lg font-black mb-1" style={{ color: '#0F172A' }}>
          {pkg.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-2xl font-black" style={{ color: pkg.color }}>
            {displayPrice.toLocaleString('vi-VN')}
          </span>
          <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>
            ₫/tháng
          </span>
        </div>

        {/* Strikethrough original price when yearly */}
        {billingCycle === 'yearly' && pkg.duration === 1 && (
          <p className="text-xs mb-3 line-through" style={{ color: '#CBD5E1' }}>
            {pkg.price.toLocaleString('vi-VN')} ₫
          </p>
        )}

        {/* Features */}
        <ul className="space-y-2 mb-5 mt-3 flex-1">
          {pkg.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 text-xs font-medium"
              style={{ color: '#475569' }}
            >
              <Check
                size={13}
                className="shrink-0 mt-0.5"
                style={{ color: pkg.color }}
              />
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={handleSubscribe}
          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
          style={{
            background: pkg.popular ? pkg.color : `${pkg.color}15`,
            color: pkg.popular ? '#fff' : pkg.color,
            border: pkg.popular ? 'none' : `1.5px solid ${pkg.color}60`,
          }}
        >
          Đăng ký ngay
        </button>

        <p
          className="text-center text-xs mt-2 font-medium"
          style={{ color: '#94A3B8' }}
        >
          {pkg.subscribers.toLocaleString()} đang dùng
        </p>
      </div>
    </div>
  );
}
