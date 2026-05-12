import {
  FaPlus,
  FaPlayCircle,
  FaFilm,
  FaListUl,
  FaServer,
  FaLink,
  FaImage,
  FaFileExcel,
} from "react-icons/fa";
import { useRef } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import MediaInput from "../../MediaInput";
import Input from "../../Input";
import Select from "../../Select";
const SERVER_OPTIONS = [
  { label: "-- Chọn server --", value: "" },
  { label: "#Hà Nội (Vietsub)", value: "#Hà Nội (Vietsub)" },
  { label: "#Hà Nội (Lồng Tiếng)", value: "#Hà Nội (Lồng Tiếng)" },
  { label: "#Hà Nội (Thuyết Minh)", value: "#Hà Nội (Thuyết Minh)" },
];

const LANG_OPTIONS = [
  { label: "-- Chọn ngôn ngữ --", value: "" },
  { label: "Vietsub", value: "vietsub" },
  { label: "Dub", value: "dub" },
  { label: "Raw", value: "raw" },
];

export default function MediaTab({
  edit,
  handleChange,
  handleFileChange,
  addEpisode,
  updateEpisode,
  addStream,
  updateStream,
  handleImportEpisodes,
}) {
  const fileInputRef = useRef(null);

  const onImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChangeLocal = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !file.type.includes("sheet") &&
      !file.type.includes("excel") &&
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls") &&
      !file.name.endsWith(".csv")
    ) {
      toast.error("Vui lòng chọn file Excel hoặc CSV");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          toast.error("File Excel trống hoặc không hợp lệ");
          return;
        }
        const episodeMap = {};

        const normalizeRow = (r) => {
          const res = {};
          Object.keys(r).forEach((k) => {
            res[k.trim().toLowerCase()] = r[k];
          });
          return res;
        };

        jsonData.forEach((rawRow) => {
          const row = normalizeRow(rawRow);

          const season = row["season"] || row["phần"] || row["phan"] || 1;
          const epNum =
            row["episode"] ||
            row["episodenumber"] ||
            row["tập số"] ||
            row["tập"] ||
            row["tap so"] ||
            row["tap"];

          if (epNum === undefined || epNum === null || epNum === "") {
            return; // Skip rows without episode number
          }

          const key = `${season}_${epNum}`;

          if (!episodeMap[key]) {
            // Lấy cột publish / hiển thị từ excel (nếu có)
            const rawPublish =
              row["publish"] || row["hiển thị"] || row["hien thi"];
            const isPub =
              rawPublish === "true" ||
              rawPublish === true ||
              rawPublish === 1 ||
              rawPublish === "1";

            episodeMap[key] = {
              season: Number(season) || 1,
              episode_number: Number(epNum),
              name:
                row["name"] ||
                row["episodename"] ||
                row["tên tập"] ||
                row["ten tap"] ||
                row["title"] ||
                "",
              is_published: isPub, // Thêm dòng này để nhận dữ liệu từ file
              streams: [],
            };
          }

          const rawLang =
            row["language"] ||
            row["ngôn ngữ"] ||
            row["ngon ngu"] ||
            row["lang"];
          const parsedLang = rawLang
            ? String(rawLang).toLowerCase()
            : "vietsub";

          const stream = {
            server_name:
              row["server"] || row["máy chủ"] || row["may chu"] || "",
            quality:
              row["quality"] ||
              row["chất lượng"] ||
              row["chat luong"] ||
              "1080p",
            lang: parsedLang,
            link_embed:
              row["embed url"] ||
              row["embedurl"] ||
              row["embed"] ||
              row["link embed"] ||
              "",
            link_m3u8:
              row["m3u8 url"] ||
              row["m3u8url"] ||
              row["m3u8"] ||
              row["link m3u8"] ||
              "",
          };

          if (stream.link_embed || stream.link_m3u8) {
            episodeMap[key].streams.push(stream);
          }
        });

        const importedEpisodes = Object.values(episodeMap);
        if (importedEpisodes.length > 0) {
          handleImportEpisodes(importedEpisodes);
        } else {
          toast.error("Không tìm thấy dữ liệu tập phim hợp lệ trong file");
        }
      } catch (err) {
        toast.error("Lỗi khi đọc file Excel: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = ""; // Reset input
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="bg-linear-to-r from-slate-50 to-white border-b border-slate-100 px-6 py-4 flex items-center gap-2.5">
          <div className="p-2 bg-blue-100/50 rounded-lg text-blue-600">
            <FaFilm size={14} />
          </div>
          <h3 className="text-base font-bold text-slate-700 tracking-tight">
            Thông tin Media
          </h3>
        </div>

        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="group bg-slate-50/40 border border-slate-100 rounded-xl p-5 space-y-4 hover:border-blue-200 transition-colors">
              <MediaInput
                label="Poster"
                mode={edit.poster_mode}
                onChange={(v) => handleChange("poster_url", v)}
                onFile={(f) => handleFileChange("poster_url", f)}
                onMode={(v) => handleChange("poster_mode", v)}
              />
              {edit.poster_url && (
                <div className="relative mt-4 flex justify-center p-3 border-2 border-dashed border-slate-200 rounded-xl bg-white group-hover:border-blue-300 transition-colors">
                  <img
                    src={edit.poster_url}
                    alt="poster"
                    className="w-28 h-40 object-cover rounded-lg shadow-sm"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <span className="bg-white/90 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1.5">
                      <FaImage className="text-blue-500" /> Poster Preview
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="group bg-slate-50/40 border border-slate-100 rounded-xl p-5 space-y-4 hover:border-blue-200 transition-colors">
              <MediaInput
                label="Thumbnail"
                mode={edit.thumb_mode}
                onChange={(v) => handleChange("thumb_url", v)}
                onFile={(f) => handleFileChange("thumb_url", f)}
                onMode={(v) => handleChange("thumb_mode", v)}
              />
              {edit.thumb_url && (
                <div className="relative mt-4 flex justify-center p-3 border-2 border-dashed border-slate-200 rounded-xl bg-white group-hover:border-blue-300 transition-colors">
                  <img
                    src={edit.thumb_url}
                    alt="thumb"
                    className="w-full max-w-50 h-28 object-cover rounded-lg shadow-sm"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <span className="bg-white/90 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1.5">
                      <FaImage className="text-blue-500" /> Thumb Preview
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-slate-50/40 border border-slate-100 rounded-xl p-5 hover:border-red-200 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <FaPlayCircle className="text-red-500" size={16} />
              <span className="text-sm font-bold text-slate-700">
                Trailer URL
              </span>
            </div>
            <Input
              value={edit.trailer_url || ""}
              onChange={(v) => handleChange("trailer_url", v)}
              placeholder="VD: https://youtube.com/watch?v=..."
            />
          </div>
        </div>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-linear-to-r from-slate-50 to-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100/50 rounded-lg text-indigo-600">
              <FaListUl size={14} />
            </div>
            <h3 className="text-base font-bold text-slate-700 tracking-tight">
              Danh sách Tập phim
            </h3>
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChangeLocal}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />
            <button
              type="button"
              onClick={onImportClick}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl 
              bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 
              transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <FaFileExcel className="text-green-600" size={12} /> Nhập Excel
            </button>
            <button
              type="button"
              onClick={addEpisode}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl 
              bg-linear-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 
              transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <FaPlus size={12} /> Thêm tập mới
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 bg-slate-50/30">
          {edit.episodes?.length > 1 && (
            <div className="flex justify-end mb-2 pr-2">
              <label className="relative inline-flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={edit.episodes.every((ep) => ep.is_published)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    const updatedEpisodes = edit.episodes.map((ep) => ({
                      ...ep,
                      is_published: isChecked,
                    }));
                    handleChange("episodes", updatedEpisodes);
                  }}
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 shadow-sm group-hover:shadow-md"></div>
                <span className="ml-3 text-sm font-bold text-slate-700">
                  {edit.episodes.every((ep) => ep.is_published)
                    ? "Đã hiển thị tất cả"
                    : "Hiển thị TẤT CẢ tập phim"}
                </span>
              </label>
            </div>
          )}

          {edit.episodes?.map((ep, i) => (
            <div
              key={i}
              className="border border-slate-200/80 rounded-2xl bg-white shadow-sm overflow-hidden hover:border-indigo-300 transition-colors"
            >
              <div className="bg-linear-to-r from-indigo-50/50 to-white border-b border-slate-100 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 font-bold text-sm rounded-full">
                    {i + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    Thông tin tập phim
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={ep.is_published || false}
                    onChange={(e) =>
                      updateEpisode(i, "is_published", e.target.checked)
                    }
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ml-3 text-sm font-bold text-slate-600">
                    Hiển thị
                  </span>
                </label>
                {/* --------------------------------------------- */}
              </div>
              <div className="p-5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Input
                    label="Season"
                    value={ep.season || ""}
                    onChange={(v) => updateEpisode(i, "season", v)}
                    placeholder="VD: 1"
                  />
                  <Input
                    label="Tập số"
                    value={ep.episode_number || ""}
                    onChange={(v) => updateEpisode(i, "episode_number", v)}
                    placeholder="VD: 1, 2, 3..."
                  />
                  <Input
                    label="Tên tập (Không bắt buộc)"
                    value={ep.name || ""}
                    onChange={(v) => updateEpisode(i, "name", v)}
                    placeholder="VD: Khởi đầu mới"
                  />
                </div>
                <div className="pt-5 border-t border-slate-100 space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FaServer className="text-slate-400" size={14} />
                    <span className="text-sm font-bold text-slate-700">
                      Nguồn phát (Streams)
                    </span>
                  </div>

                  <div className="space-y-4">
                    {ep.streams?.map((s, j) => (
                      <div
                        key={j}
                        className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-5 relative group hover:border-blue-200 transition-colors"
                      >
                        <div className="absolute -top-3 -left-3 bg-white border border-slate-200 text-slate-600 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold shadow-sm">
                          {j + 1}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          <Select
                            label="Server"
                            value={s.server_name || ""}
                            options={SERVER_OPTIONS}
                            onChange={(v) =>
                              updateStream(i, j, "server_name", v)
                            }
                          />
                          <Input
                            label="Chất lượng"
                            value={s.quality || ""}
                            onChange={(v) => updateStream(i, j, "quality", v)}
                            placeholder="VD: 1080p, 720p..."
                          />
                          <Select
                            label="Ngôn ngữ"
                            value={s.lang || ""}
                            options={LANG_OPTIONS}
                            onChange={(v) => updateStream(i, j, "lang", v)}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                              <FaLink className="text-slate-400" /> Embed URL
                            </label>
                            <Input
                              value={s.link_embed || ""}
                              onChange={(v) =>
                                updateStream(i, j, "link_embed", v)
                              }
                              placeholder="https://..."
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                              <FaLink className="text-slate-400" /> M3U8 URL
                            </label>
                            <Input
                              value={s.link_m3u8 || ""}
                              onChange={(v) =>
                                updateStream(i, j, "link_m3u8", v)
                              }
                              placeholder="https://...m3u8"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addStream(i)}
                    className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all w-full active:scale-[0.99]"
                  >
                    <FaPlus size={12} /> Thêm nguồn phát (Add Stream)
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
