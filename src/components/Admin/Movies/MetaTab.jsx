import { Tags, Globe, Users, ChevronRight } from "lucide-react";
import MetaInput from "../../MetaInput";
import MultiCheckbox from "../../MultiCheckbox";

const CATEGORY_PRESET = [
  "Hành Động",
  "Kinh Dị",
  "Chính Kịch",
  "Tình Cảm",
  "Hài",
  "Phiêu Lưu",
  "Viễn Tưởng",
  "Hoạt Hình",
];

const COUNTRY_PRESET = [
  "Việt Nam",
  "Hàn Quốc",
  "Nhật",
  "Trung Quốc",
  "Mỹ",
  "Anh",
  "Thái",
  "Ấn",
];

export default function MetaTab({ edit, onChange }) {
  return (
    <div className="space-y-6 animate-fade-in text-slate-800 pb-10">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-purple-100 text-purple-600 shadow-sm border border-purple-200">
              <Tags size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                Phân loại & Metadata
              </h3>
              <p className="text-[11px] text-slate-400 font-medium italic">
                Gán thẻ thể loại, quốc gia và dàn nhân sự cho phim
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500 uppercase tracking-widest ml-1">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
              <span>Thể loại phim</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/30 p-5 hover:border-purple-200 hover:bg-white transition-all duration-300 shadow-inner-sm">
              <MultiCheckbox
                options={CATEGORY_PRESET.map((name) => ({ name }))}
                value={edit.categories || []}
                onChange={(v) => onChange("categories", v)}
              />
            </div>
          </section>
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500 uppercase tracking-widest ml-1">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              <span>Quốc gia sản xuất</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/30 p-5 hover:border-indigo-200 hover:bg-white transition-all duration-300 shadow-inner-sm">
              <MultiCheckbox
                options={COUNTRY_PRESET.map((name) => ({ name }))}
                value={edit.countries || []}
                onChange={(v) => onChange("countries", v)}
              />
            </div>
          </section>
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span>Nhân sự & Vai trò</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                <Users size={12} />
                <span className="text-[10px] font-bold">Cast & Crew</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/30 p-2 hover:border-blue-200 hover:bg-white transition-all duration-300 shadow-inner-sm">
              <MetaInput
                data={edit.people || []}
                hasRole
                onChange={(v) => onChange("people", v)}
              />
            </div>
            <p className="text-[11px] text-slate-400 ml-1 flex items-center gap-1">
              <ChevronRight size={10} className="text-slate-300" />
              Sử dụng nút X để gỡ bỏ nhân sự nếu nhập nhầm
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
