/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { X, Pencil, FileText, Download } from "lucide-react";
import { toast } from "react-toastify";
import { downloadContractFile } from "../../../api/contractApi"; // Import hàm tải file

export default function ContractModal({
  isOpen,
  onClose,
  contract,
  onSave,
  isEditMode: initialEditMode = false,
}) {
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("draft");
  const [file, setFile] = useState(null);
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [errors, setErrors] = useState({}); // Thêm state quản lý lỗi

  useEffect(() => {
    if (isOpen) {
      setErrors({}); // Reset lỗi mỗi lần mở lại modal
      if (contract) {
        setName(contract.name || "");
        setStartDate(
          contract.start_date ? contract.start_date.slice(0, 10) : "",
        );
        setEndDate(contract.end_date ? contract.end_date.slice(0, 10) : "");
        setStatus(contract.status || "draft");
        setFile(null);
        setCreatedAt(
          contract.created_at ? contract.created_at.slice(0, 10) : "",
        );
        setUpdatedAt(
          contract.updated_at ? contract.updated_at.slice(0, 10) : "",
        );
      } else {
        setName("");
        setStartDate("");
        setEndDate("");
        setStatus("draft");
        setFile(null);
        setCreatedAt("");
        setUpdatedAt("");
      }
      setIsEditMode(initialEditMode);
    }
  }, [isOpen, contract, initialEditMode]);

  const validateForm = () => {
    const newErrors = {};
    if (!name || !name.trim()) {
      newErrors.name = "Vui lòng nhập tên hợp đồng.";
    }
    if (!startDate) {
      newErrors.startDate = "Vui lòng chọn ngày bắt đầu.";
    }
    if (!endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc.";
    }

    // Kiểm tra ngày bắt đầu không lớn hơn ngày kết thúc (nếu cả 2 đều đã được nhập)
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = "Ngày kết thúc không hợp lệ (phải sau ngày bắt đầu).";
    }

    // Bắt buộc đính kèm file nếu chưa có file sẵn có
    if (!file && !contract?.file_url) {
      newErrors.file = "Vui lòng đính kèm tập tin (PDF).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Gọi hàm kiểm tra hợp lệ
    if (!validateForm()) {
      toast.warning("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    onSave({
      name: name.trim(),
      start_date: startDate,
      end_date: endDate,
      status,
      file,
    });
    setIsEditMode(false);
  };

  const handleDownloadFile = async () => {
    if (!contract?.id) return;
    try {
      const blob = await downloadContractFile(contract.id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        contract.name?.replace(/\s/g, "_") + ".pdf",
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Tải file thất bại");
    }
  };

  if (!isOpen) return null;

  const baseInputStyle =
    "w-full h-11 px-4 text-[13.5px] font-medium rounded-xl outline-none transition-all duration-200 border";
  const activeInputStyle =
    "bg-white border-slate-200 text-slate-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10";
  const errorInputStyle =
    "!border-rose-400 focus:!border-rose-500 focus:!ring-rose-500/10 bg-rose-50/30"; // Style cho ô bị lỗi
  const disabledStyle =
    "bg-slate-50 border-transparent text-slate-500 cursor-not-allowed";
  const labelStyle =
    "text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 block pl-1";
  const fileInputStyle = `w-full text-[13.5px] font-medium text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-[13px] file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all cursor-pointer`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-[#FCFDFE] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-screen">
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-white">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            {contract
              ? isEditMode
                ? "Chỉnh sửa hợp đồng"
                : "Chi tiết hợp đồng"
              : "Tạo hợp đồng mới"}
          </h2>
          <div className="flex items-center gap-2">
            {contract && !isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
                title="Chỉnh sửa"
              >
                <Pencil size={14} strokeWidth={2.5} />
                Chỉnh sửa
              </button>
            )}
            {contract && !isEditMode && (
              <div className="w-px h-5 bg-slate-200 mx-1"></div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        <form className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelStyle}>
                Tên hợp đồng <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
                readOnly={!isEditMode}
                placeholder="Nhập tên hợp đồng..."
                className={`${baseInputStyle} ${isEditMode ? activeInputStyle : disabledStyle} ${errors.name ? errorInputStyle : ""}`}
              />
              {errors.name && (
                <p className="text-[11px] font-medium text-rose-500 mt-1.5 pl-1 italic">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className={labelStyle}>
                Ngày bắt đầu <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (errors.startDate)
                    setErrors({ ...errors, startDate: null });
                }}
                readOnly={!isEditMode}
                className={`${baseInputStyle} ${isEditMode ? activeInputStyle : disabledStyle} ${!startDate && !isEditMode ? "text-transparent" : ""} ${errors.startDate ? errorInputStyle : ""}`}
              />
              {errors.startDate && (
                <p className="text-[11px] font-medium text-rose-500 mt-1.5 pl-1 italic">
                  {errors.startDate}
                </p>
              )}
            </div>

            <div>
              <label className={labelStyle}>
                Ngày kết thúc <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (errors.endDate) setErrors({ ...errors, endDate: null });
                }}
                readOnly={!isEditMode}
                className={`${baseInputStyle} ${isEditMode ? activeInputStyle : disabledStyle} ${!endDate && !isEditMode ? "text-transparent" : ""} ${errors.endDate ? errorInputStyle : ""}`}
              />
              {errors.endDate && (
                <p className="text-[11px] font-medium text-rose-500 mt-1.5 pl-1 italic">
                  {errors.endDate}
                </p>
              )}
            </div>

            <div>
              <label className={labelStyle}>Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={!isEditMode}
                className={`${baseInputStyle} cursor-pointer appearance-none ${isEditMode ? activeInputStyle : disabledStyle}`}
              >
                <option value="draft">Bản nháp (Draft)</option>
                <option value="active">Đang hiệu lực (Active)</option>
                <option value="expired">Đã hết hạn (Expired)</option>
                <option value="cancelled">Đã hủy (Cancelled)</option>
              </select>
            </div>

            <div>
              <label className={labelStyle}>
                Tập tin đính kèm (PDF){" "}
                {(!contract || !contract.file_url) && (
                  <span className="text-rose-500">*</span>
                )}
              </label>
              <div className="flex flex-col gap-2">
                {contract?.file_url && (
                  <div className="flex items-center gap-2 p-2.5 bg-blue-50/50 border border-blue-100 rounded-xl">
                    <FileText className="text-blue-500 min-w-5" size={18} />
                    <span
                      className="text-[13px] font-medium text-slate-600 flex-1 truncate"
                      title={`${contract.name}.pdf`}
                    >
                      {contract.name}.pdf
                    </span>
                    <button
                      type="button"
                      onClick={handleDownloadFile}
                      className="flex items-center gap-1 text-[12px] font-bold text-blue-600 hover:text-blue-700 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-blue-100 transition-colors"
                    >
                      <Download size={14} />
                      Tải về
                    </button>
                  </div>
                )}
                {isEditMode && (
                  <div className="flex flex-col gap-1.5">
                    <div
                      className={`flex items-center h-11 px-1 rounded-xl border border-slate-200 bg-white ${errors.file ? "border-rose-400! bg-rose-50/30" : ""}`}
                    >
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          setFile(e.target.files[0]);
                          if (errors.file) setErrors({ ...errors, file: null });
                        }}
                        className={fileInputStyle}
                      />
                    </div>
                    {errors.file && (
                      <p className="text-[11px] font-medium text-rose-500 pl-1 italic">
                        {errors.file}
                      </p>
                    )}
                  </div>
                )}
                {!isEditMode && !contract?.file_url && (
                  <div className="h-11 px-4 flex items-center bg-slate-50 rounded-xl text-[13px] font-medium text-slate-400 italic border border-transparent">
                    Không có tập tin đính kèm
                  </div>
                )}
              </div>
            </div>
          </div>

          {contract && (
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-2">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Ngày tạo
                </span>
                <span className="text-[13px] font-semibold text-slate-600">
                  {createdAt || "Chưa xác định"}
                </span>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="flex flex-col text-right">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Cập nhật lần cuối
                </span>
                <span className="text-[13px] font-semibold text-slate-600">
                  {updatedAt || "Chưa cập nhật"}
                </span>
              </div>
            </div>
          )}
        </form>
        {isEditMode && (
          <div className="flex justify-end gap-3 px-8 py-5 border-t border-slate-100 bg-white">
            <button
              type="button"
              onClick={() => setIsEditMode(false)}
              className="px-5 h-10 text-[13.5px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-all"
            >
              Hủy bỏ
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 h-10 text-[13.5px] font-bold text-white bg-slate-800 hover:bg-slate-700 shadow-md shadow-slate-200 rounded-xl transition-all"
            >
              Lưu thay đổi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
