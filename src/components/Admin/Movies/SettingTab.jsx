import { FaCog, FaSlidersH, FaDatabase, FaCheckCircle } from "react-icons/fa";

import Select from "../../Select";
import Checkbox from "../../Checkbox";

const STATUS = [
  { label: "Bản nháp", value: "draft" },
  { label: "Đã xuất bản", value: "published" },
  { label: "Ngưng phát hành", value: "hidden" },
];

const LIFECYCLE = [
  { label: "Sắp chiếu", value: "upcoming" },
  { label: "Đang chiếu", value: "ongoing" },
  { label: "Trọn bộ", value: "completed" },
];

const PRODUCTION = [
  { label: "Lên kế hoạch", value: "planning" },
  { label: "Đang quay", value: "filming" },
  { label: "Sản Xuất", value: "post-production" },
];

const SOURCE = [
  { label: "Galaxy", value: "galaxy" },
  { label: "Netflix", value: "netflix" },
];

export default function SettingTab({ edit, onChange }) {
  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
          <div className="p-2 rounded-lg bg-emerald-100/50 text-emerald-600">
            <FaCog size={14} />
          </div>
          <h3 className="text-base font-bold text-slate-700 tracking-tight">
            Cài đặt hệ thống
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <FaSlidersH className="text-indigo-500" size={14} />
              <span>Trạng thái phim</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Select
                label="Status"
                value={edit.status || ""}
                options={STATUS}
                onChange={(v) => onChange("status", v)}
              />

              <Select
                label="Lifecycle"
                value={edit.lifecycle_status || ""}
                options={LIFECYCLE}
                onChange={(v) => onChange("lifecycle_status", v)}
              />

              <Select
                label="Production"
                value={edit.production_status || ""}
                options={PRODUCTION}
                onChange={(v) => onChange("production_status", v)}
              />
            </div>
          </section>
          <section className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <FaDatabase className="text-purple-500" size={14} />
              <span>Nguồn phát hành</span>
            </div>
            <div className="max-w-sm">
              <Select
                label="Source"
                value={edit.source || ""}
                options={SOURCE}
                onChange={(v) => onChange("source", v)}
              />
            </div>
          </section>
          <section className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <FaCheckCircle className="text-emerald-500" size={14} />
              <span>Tuỳ chọn hiển thị</span>
            </div>

            <div className="flex flex-wrap gap-6">
              <Checkbox
                label="Hiển thị cho người dùng"
                checked={!!edit.is_available}
                onChange={(v) => onChange("is_available", v)}
              />

              <Checkbox
                label="Premium"
                checked={!!edit.is_premium}
                onChange={(v) => onChange("is_premium", v)}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
