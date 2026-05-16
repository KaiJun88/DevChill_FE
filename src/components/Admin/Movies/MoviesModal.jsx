/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { FaTimes, FaSave, FaFileExcel, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

import {
  getMovieById,
  updateMovieInfo,
  updateMovieMeta,
  updateMovieMedia,
  updateMovieSetting,
  createMovie,
} from "../../../api/moviesAdminApi";

import { getContracts } from "../../../api/contractApi";

import InfoTab from "./InfoTab";
import MetaTab from "./MetaTab";
import MediaTab from "./MediaTab";
import SettingTab from "./SettingTab";

const TAB = {
  INFO: "info",
  META: "meta",
  MEDIA: "media",
  SETTING: "setting",
};

export default function MoviesModal({
  movieId,
  mode = "edit",
  onClose,
  onReload,
}) {
  const [activeTab, setActiveTab] = useState(TAB.INFO);
  const [movie, setMovie] = useState(null);
  const [edit, setEdit] = useState({});
  const [contracts, setContracts] = useState([]);
  const [errors, setErrors] = useState({});

  const streamLocks = useRef({});
  const allInOneFileInputRef = useRef(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  useEffect(() => {
    if (mode === "edit" && movieId) {
      fetchMovie();
    }

    if (mode === "create") {
      setEdit({
        name: "",
        origin_name: "",
        year: "",
        type: "",
        duration: "",
        episode_total: "",
        content: "",
        contract_id: "",
        status: "draft",
        lifecycle_status: "ongoing",
        production_status: "",
        source: "",
        is_available: false,
        is_premium: false,
        categories: [],
        countries: [],
        people: [],
        episodes: [],
        poster_url: "",
        thumb_url: "",
        trailer_url: "",
        poster_mode: "url",
        thumb_mode: "url",
      });
    }
  }, [movieId, mode]);

  const fetchContracts = async () => {
    try {
      const res = await getContracts();
      setContracts(res.data || []);
    } catch {
      toast.error("Lỗi khi tải hợp đồng");
    }
  };

  const fetchMovie = async () => {
    try {
      const res = await getMovieById(movieId);
      setMovie(res.data);
      setEdit({
        ...res.data,
        poster_mode: "url",
        thumb_mode: "url",
      });
    } catch {
      toast.error("Lỗi khi tải phim");
    }
  };

  const cleanEpisodes = (episodes = []) =>
    episodes
      .map((ep) => {
        const season = Number(ep.season);
        const episode_number = Number(ep.episode_number);

        if (Number.isNaN(season) || Number.isNaN(episode_number)) return null;

        const streams = (ep.streams || [])
          .map((s) => ({
            server_name: s.server_name || "",
            quality: s.quality || "",
            lang: s.lang || "",
            link_embed: s.link_embed || "",
            link_m3u8: s.link_m3u8 || "",
          }))
          .filter((s) => s.link_embed || s.link_m3u8);

        return {
          season,
          episode_number,
          name: ep.name,
          is_published: ep.is_published,
          streams,
        };
      })
      .filter(Boolean);

  const handleChange = (field, value) => {
    if (["duration", "episode_total"].includes(field)) {
      if (value !== "" && !/^\d*$/.test(value)) {
        toast.warning("Trường này chỉ được phép nhập SỐ!");
        return; 
      }
    }
    setEdit((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[field];
        return newErr;
      });
    }
  };

  const handleFileChange = (field, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange(field, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const addEpisode = () => {
    setEdit((prev) => ({
      ...prev,
      episodes: [
        ...(prev.episodes || []),
        {
          season: 1,
          episode_number: 1,
          name: "",
          is_published: false,
          streams: [],
        },
      ],
    }));
  };

  const updateEpisode = (i, field, value) => {
    setEdit((prev) => {
      const eps = [...(prev.episodes || [])];
      eps[i] = { ...eps[i], [field]: value };
      return { ...prev, episodes: eps };
    });
  };

  const addStream = (i) => {
    if (streamLocks.current[i]) return;

    streamLocks.current[i] = true;

    setEdit((prev) => {
      const eps = [...(prev.episodes || [])];

      eps[i].streams = [
        ...(eps[i].streams || []),
        {
          server_name: "",
          quality: "",
          lang: "",
          link_embed: "",
          link_m3u8: "",
        },
      ];

      return { ...prev, episodes: eps };
    });

    setTimeout(() => {
      streamLocks.current[i] = false;
    }, 0);
  };

  const updateStream = (i, j, field, value) => {
    setEdit((prev) => {
      const eps = [...(prev.episodes || [])];
      const streams = [...(eps[i].streams || [])];

      streams[j] = { ...streams[j], [field]: value };
      eps[i] = { ...eps[i], streams };

      return { ...prev, episodes: eps };
    });
  };

  const handleImportEpisodes = (importedEpisodes) => {
    if (!Array.isArray(importedEpisodes)) return;

    setEdit((prev) => ({
      ...prev,
      episodes: [...(prev.episodes || []), ...importedEpisodes],
    }));
    toast.success(`Đã nối thêm ${importedEpisodes.length} tập phim mới!`);
  };

  const handleImportAllInOne = (e) => {
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

        let updatedEdit = { ...edit };
        let newEpisodes = [];
        let hasNumberWarning = false;

        const normalizeRow = (r) => {
          const res = {};
          Object.keys(r).forEach((k) => {
            res[k.trim().toLowerCase()] = r[k];
          });
          return res;
        };

        const parseNumber = (val, fieldName, fallbackValue) => {
          if (val === undefined || val === null || val === "")
            return fallbackValue;
          const num = Number(val);
          if (isNaN(num)) {
            hasNumberWarning = true;
            return fallbackValue;
          }
          return num;
        };

        const parseBoolean = (val, fallbackValue) => {
          if (val === undefined || val === null) return fallbackValue;
          const str = String(val).toLowerCase().trim();
          return str === "true" || str === "1" || str === "yes" || str === "có";
        };

        const parseArray = (val, fallbackValue) => {
          if (!val) return fallbackValue;
          return String(val)
            .split(",")
            .map((s) => ({ name: s.trim() }))
            .filter((c) => c.name);
        };

        const parsePeople = (val, fallbackValue) => {
          if (!val) return fallbackValue;
          return String(val)
            .split(",")
            .map((s) => ({ name: s.trim(), role: "actor" }))
            .filter((p) => p.name);
        };

        workbook.SheetNames.forEach((sheetName, index) => {
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          if (jsonData.length === 0) return;

          const isEpisodeSheet =
            index === 3 ||
            sheetName.toLowerCase().includes("tap") ||
            sheetName.toLowerCase().includes("ep");

          if (isEpisodeSheet) {
            const episodeMap = {};
            jsonData.forEach((rawRow) => {
              const row = normalizeRow(rawRow);
              const season = row["season"] || row["phần"] || 1;
              const epNum = row["episode"] || row["tập số"] || row["tập"];

              if (epNum === undefined || epNum === "") return;

              const key = `${season}_${epNum}`;

              if (!episodeMap[key]) {
                const rawPublish = row["publish"] || row["hiển thị"];
                const isPub =
                  rawPublish === "true" ||
                  rawPublish === true ||
                  rawPublish === 1;

                episodeMap[key] = {
                  season: Number(season) || 1,
                  episode_number: Number(epNum),
                  name: row["name"] || row["tên tập"] || "",
                  is_published: isPub,
                  streams: [],
                };
              }

              const rawLang = row["language"] || row["ngôn ngữ"];
              const parsedLang = rawLang
                ? String(rawLang).toLowerCase()
                : "vietsub";

              const stream = {
                server_name: row["server"] || row["máy chủ"] || "",
                quality: row["quality"] || row["chất lượng"] || "1080p",
                lang: parsedLang,
                link_embed: row["embed url"] || row["embed"] || "",
                link_m3u8: row["m3u8 url"] || row["m3u8"] || "",
              };

              if (stream.link_embed || stream.link_m3u8) {
                episodeMap[key].streams.push(stream);
              }
            });

            newEpisodes = [...newEpisodes, ...Object.values(episodeMap)];
          } else {
            const row = normalizeRow(jsonData[0]);

            updatedEdit = {
              ...updatedEdit,
              name: row["name"] || row["tên phim"] || updatedEdit.name,
              origin_name:
                row["origin_name"] || row["tên gốc"] || updatedEdit.origin_name,
              year: parseNumber(
                row["year"] || row["năm sản xuất"],
                "Năm sản xuất",
                updatedEdit.year,
              ),
              type: row["type"] || row["định dạng"] || updatedEdit.type,
              duration: parseNumber(
                row["duration"] || row["thời lượng"],
                "Thời lượng",
                updatedEdit.duration,
              ),
              episode_total: parseNumber(
                row["episode_total"] || row["tổng số tập"],
                "Tổng số tập",
                updatedEdit.episode_total,
              ),
              content: row["content"] || row["nội dung"] || updatedEdit.content,
              contract_id: parseNumber(
                row["contract_id"] || row["mã hợp đồng"],
                "Mã hợp đồng",
                updatedEdit.contract_id,
              ),

              categories: parseArray(
                row["categories"] || row["thể loại"],
                updatedEdit.categories,
              ),
              countries: parseArray(
                row["countries"] || row["quốc gia"],
                updatedEdit.countries,
              ),
              people: parsePeople(
                row["people"] ||
                  row["diễn viên"] ||
                  row["nhân sự"] ||
                  row["actor"],
                updatedEdit.people,
              ),
              poster_url:
                row["poster_url"] || row["poster"] || updatedEdit.poster_url,
              thumb_url:
                row["thumb_url"] || row["thumbnail"] || updatedEdit.thumb_url,
              trailer_url:
                row["trailer_url"] || row["trailer"] || updatedEdit.trailer_url,
              status: row["status"] || row["trạng thái"] || updatedEdit.status,
              lifecycle_status:
                row["lifecycle_status"] ||
                row["vòng đời"] ||
                updatedEdit.lifecycle_status,
              production_status:
                row["production_status"] ||
                row["sản xuất"] ||
                updatedEdit.production_status,
              source: row["source"] || row["nguồn"] || updatedEdit.source,
              is_available: parseBoolean(
                row["is_available"] || row["hiển thị"],
                updatedEdit.is_available,
              ),
              is_premium: parseBoolean(
                row["is_premium"] || row["premium"],
                updatedEdit.is_premium,
              ),
            };
          }
        });

        if (newEpisodes.length > 0) {
          updatedEdit.episodes = [
            ...(updatedEdit.episodes || []),
            ...newEpisodes,
          ];
        }
        setEdit(updatedEdit);

        if (hasNumberWarning) {
          toast.warning(
            "Import All-in-One xong. Có một vài ô nhập sai kiểu số đã bị bỏ qua!",
          );
        } else {
          toast.success("Import thông tin & Tập phim thành công!");
        }
      } catch (err) {
        toast.error("Lỗi khi đọc file Excel Phim: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const validateInfo = () => {
    const err = {};

    if (!edit.name?.trim()) err.name = "Tên Phim Là Bắt Buộc";
    if (!edit.contract_id) err.contract_id = "Chọn Hợp Đồng Là Bắt Buộc";

    if (edit.episode_total && !/^\d+$/.test(String(edit.episode_total))) {
      err.episode_total = "Chỉ được nhập số (VD: 12)";
    }
    if (edit.duration && !/^\d+$/.test(String(edit.duration))) {
      err.duration = "Chỉ được nhập số (VD: 120)";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (activeTab === TAB.INFO) {
      if (!validateInfo()) {
        setActiveTab(TAB.INFO);
        toast.error("Vui lòng kiểm tra lại thông tin bị lỗi!");
        return;
      }
      setActiveTab(TAB.META);
    } else if (activeTab === TAB.META) {
      setActiveTab(TAB.MEDIA);
    } else if (activeTab === TAB.MEDIA) {
      setActiveTab(TAB.SETTING);
    }
  };

  const handleSaveAll = async () => {
    try {
      if (!validateInfo()) {
        setActiveTab(TAB.INFO);
        toast.error("Vui lòng kiểm tra lại thông tin bị lỗi!");
        return;
      }
      const cleanedEpisodes = cleanEpisodes(edit.episodes);

      if (mode === "create") {
        await createMovie({
          name: edit.name,
          origin_name: edit.origin_name,
          year: edit.year,
          type: edit.type,
          duration: edit.duration,
          episode_total: edit.episode_total,
          content: edit.content,
          contract_id: edit.contract_id,

          categories: edit.categories,
          countries: edit.countries,
          people: edit.people,

          poster_url: edit.poster_url,
          thumb_url: edit.thumb_url,
          trailer_url: edit.trailer_url,
          episodes: cleanedEpisodes,

          status: edit.status,
          lifecycle_status: edit.lifecycle_status,
          production_status: edit.production_status,
          is_available: edit.is_available,
          is_premium: edit.is_premium,
          source: edit.source,
        });
      } else {
        if (!movieId) {
          toast.error("Thiếu movieId");
          return;
        }

        await updateMovieInfo(movieId, {
          name: edit.name,
          origin_name: edit.origin_name,
          year: edit.year,
          type: edit.type,
          duration: edit.duration,
          episode_total: edit.episode_total,
          content: edit.content,
          contract_id: edit.contract_id,
        });

        await Promise.all([
          updateMovieMeta(movieId, {
            categories: edit.categories,
            countries: edit.countries,
            people: edit.people,
          }),

          updateMovieMedia(movieId, {
            poster_url: edit.poster_url,
            thumb_url: edit.thumb_url,
            trailer_url: edit.trailer_url,
            episodes: cleanedEpisodes,
          }),

          updateMovieSetting(movieId, {
            status: edit.status,
            lifecycle_status: edit.lifecycle_status,
            production_status: edit.production_status,
            is_available: edit.is_available,
            is_premium: edit.is_premium,
            source: edit.source,
          }),
        ]);
      }

      toast.success("Lưu Thành Công");

      if (mode === "edit") {
        await fetchMovie();
      }

      onReload();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Lưu Thất Bại");
    }
  };
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-275 max-h-[90vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-700">
              {mode === "create" ? "Create Movie" : "Movie Detail"}
            </h2>

            <input
              type="file"
              ref={allInOneFileInputRef}
              onChange={handleImportAllInOne}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />
            <button
              onClick={() => allInOneFileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-sm"
              title="Import 1 file Excel chứa tối đa 4 Sheet (Thông Tin, Phân Loại, Media, Tập Phim)"
            >
              <FaUpload size={12} /> Import Tự Động
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <FaTimes className="text-slate-500" />
          </button>
        </div>

        <div className="flex border-b border-slate-100 bg-slate-50/60">
          {Object.values(TAB).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-all
              ${
                activeTab === t
                  ? "text-blue-600 bg-white border-b-2 border-blue-500"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/40">
          {activeTab === TAB.INFO && (
            <InfoTab
              edit={edit}
              onChange={handleChange}
              contracts={contracts}
              errors={errors}
            />
          )}

          {activeTab === TAB.META && (
            <MetaTab edit={edit} onChange={handleChange} />
          )}

          {activeTab === TAB.MEDIA && (
            <MediaTab
              edit={edit}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              addEpisode={addEpisode}
              updateEpisode={updateEpisode}
              addStream={addStream}
              updateStream={updateStream}
              handleImportEpisodes={handleImportEpisodes}
            />
          )}

          {activeTab === TAB.SETTING && (
            <SettingTab edit={edit} onChange={handleChange} />
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition-all"
          >
            Hủy
          </button>

          <div className="flex items-center gap-3">
            {activeTab !== TAB.SETTING && (
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition-all"
              >
                Next
              </button>
            )}

            <button
              onClick={handleSaveAll}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl 
              bg-linear-to-r from-blue-600 to-indigo-600 text-white 
              hover:from-blue-700 hover:to-indigo-700 
              shadow-sm hover:shadow-md active:scale-95 transition-all"
            >
              <FaSave size={13} />
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
