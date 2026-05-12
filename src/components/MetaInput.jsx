import { useState } from "react";
import { Plus, X, User, Briefcase } from "lucide-react";

export default function MetaInput({ label, data = [], onChange, hasRole }) {
  const [custom, setCustom] = useState("");

  const update = (i, field, value) => {
    const newArr = data.map((item, idx) =>
      idx === i ? { ...item, [field]: value } : item,
    );
    onChange(newArr);
  };

  const add = () => {
    const v = custom.trim();
    if (!v) return;

    // Kiểm tra trùng lặp
    if (data.some((item) => item.name.toLowerCase() === v.toLowerCase())) {
      setCustom("");
      return;
    }

    const newItem = hasRole ? { name: v, role: "actor" } : { name: v };

    onChange([...(data || []), newItem]);
    setCustom("");
  };

  const remove = (i) => {
    const newArr = data.filter((_, idx) => idx !== i);
    onChange(newArr);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {label && (
        <h4 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest ml-1">
          {label}
        </h4>
      )}
      <div className="flex flex-col gap-2">
        {data?.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 bg-slate-50/30 group transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm"
          >
            <div className="relative flex-1">
              <User
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-700"
                value={item.name || ""}
                onChange={(e) => update(i, "name", e.target.value)}
                placeholder="Tên nhân sự..."
              />
            </div>
            {hasRole && (
              <div className="relative w-40">
                <Briefcase
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-700"
                  value={item.role || ""}
                  onChange={(e) => update(i, "role", e.target.value)}
                  placeholder="Vai trò..."
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
              title="Xóa dòng này"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-1">
        <div className="relative flex-1">
          <input
            className="w-full pl-4 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400 font-medium shadow-sm"
            placeholder={
              label
                ? `Thêm ${label.toLowerCase()}...`
                : "Nhập tên nhân sự mới..."
            }
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button
          type="button"
          onClick={add}
          disabled={!custom.trim()}
          className="flex items-center justify-center px-4 rounded-xl bg-blue-500 text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-600 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>
      </div>
      {data.length > 0 && (
        <p className="text-[11px] text-slate-400 ml-1 italic">
          * Nhấn Enter để thêm nhanh. Bạn có thể chỉnh sửa trực tiếp trên từng
          dòng.
        </p>
      )}
    </div>
  );
}
