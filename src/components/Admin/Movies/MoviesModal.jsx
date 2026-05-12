/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";

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
          is_published: ep.is_published, // Bắn trường cờ này xuống cho DB
          streams,
        };
      })
      .filter(Boolean);

  const handleChange = (field, value) => {
    setEdit((prev) => ({ ...prev, [field]: value }));
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
          is_published: false, // Mặc định tập mới thêm vào sẽ là ẨN
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
    toast.success(`Đã nhập thành công ${importedEpisodes.length} tập phim`);
  };

  const validateInfo = () => {
    const err = {};

    if (!edit.name?.trim()) err.name = "Tên Phim Là Bắt Buộc";
    if (!edit.contract_id) err.contract_id = "Chọn Hợp Đồng Là Bắt Buộc";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (activeTab === TAB.INFO) {
      if (!validateInfo()) return;
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
          <h2 className="text-lg font-bold text-slate-700">
            {mode === "create" ? "Create Movie" : "Movie Detail"}
          </h2>

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
