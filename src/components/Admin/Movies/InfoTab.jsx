import { FaInfoCircle, FaChevronDown } from "react-icons/fa";
import Input from "../../Input";
import Textarea from "../../Textarea";

export default function InfoTab({ edit, onChange, contracts, errors }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear + 5 - i);
  const selectStyle = (hasError) => `
    w-full rounded-xl border bg-white px-3 py-2.5 text-sm shadow-sm
    appearance-none transition-all duration-200
    hover:border-slate-300
    focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none
    cursor-pointer
    ${hasError ? "border-red-400" : "border-slate-200"}
  `;

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-50 rounded-lg text-blue-600 shadow-sm border border-blue-100">
            <FaInfoCircle size={14} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">
              Thông tin nội dung
            </h3>
            <p className="text-[11px] text-slate-400 font-medium italic">
              Vui lòng điền đầy đủ các thông tin hiển thị của phim
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <Input
              label="Tên phim (Tiếng Việt)"
              value={edit.name || ""}
              onChange={(v) => onChange("name", v)}
              error={errors.name}
              placeholder="VD: Kỵ Sĩ Bóng Đêm"
            />
            <Input
              label="Tên gốc (Tiếng Anh)"
              value={edit.origin_name || ""}
              onChange={(v) => onChange("origin_name", v)}
              placeholder="VD: The Dark Knight"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Năm sản xuất
              </label>
              <div className="relative group">
                <select
                  value={edit.year || ""}
                  onChange={(e) => onChange("year", e.target.value)}
                  className={selectStyle(errors.year)}
                >
                  <option value="" disabled className="text-slate-400">
                    --- Chọn năm ---
                  </option>
                  {years.map((y) => (
                    <option key={`year-${y}`} value={y} className="py-2">
                      Năm {y}
                    </option>
                  ))}
                </select>
                <FaChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors"
                  size={10}
                />
              </div>
              {errors.year && (
                <p className="text-[11px] text-red-500 mt-1 ml-1 font-medium animate-pulse">
                  * {errors.year}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Định dạng phim
              </label>
              <div className="relative group">
                <select
                  value={edit.type || ""}
                  onChange={(e) => onChange("type", e.target.value)}
                  className={selectStyle(false)}
                >
                  <option value="" disabled>
                    --- Chọn loại hình ---
                  </option>
                  <option key="type-movie" value="movie">
                    Phim lẻ (Movie)
                  </option>
                  <option key="type-series" value="series">
                    Phim bộ (Series)
                  </option>
                </select>
                <FaChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors"
                  size={10}
                />
              </div>
            </div>
            <Input
              label="Thời lượng (Phút)"
              value={edit.duration || ""}
              onChange={(v) => onChange("duration", v)}
              error={errors.duration}
              placeholder="VD: 120"
            />
            <Input
              label="Tổng số tập"
              value={edit.episode_total || ""}
              onChange={(v) => onChange("episode_total", v)}
              error={errors.episode_total}
              placeholder="VD: 12"
            />

            <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Hợp đồng bản quyền
              </label>
              <div className="relative group">
                <select
                  value={edit.contract_id || ""}
                  onChange={(e) => onChange("contract_id", e.target.value)}
                  className={selectStyle(errors.contract_id)}
                >
                  <option value="" disabled>
                    --- Liên kết hợp đồng bản quyền ---
                  </option>
                  {contracts
                    .filter((c) => c.status === "active")
                    .map((c) => (
                      <option key={`contract-${c.id}`} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
                <FaChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors"
                  size={10}
                />
              </div>

              {errors.contract_id && (
                <p className="text-[11px] text-red-500 mt-1 ml-1 font-medium animate-pulse">
                  * {errors.contract_id}
                </p>
              )}
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100">
            <Textarea
              label="Nội dung tóm tắt"
              value={edit.content || ""}
              onChange={(v) => onChange("content", v)}
              placeholder="Nhập mô tả chi tiết về cốt truyện, giải thưởng hoặc thông tin đặc biệt khác..."
              rows={5}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
