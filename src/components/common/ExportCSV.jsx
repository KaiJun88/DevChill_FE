import { toast } from "react-toastify";
import { Download } from "lucide-react";

export default function ExportCSV({ data, fileName = "export", fields }) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.error("Không có dữ liệu để xuất CSV!");
      return;
    }
    const headers = fields || Object.keys(data[0]);

    const rows = data.map((item) =>
      headers.map((key) => (item[key] !== null ? item[key] : "")),
    );

    const csv =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center justify-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white bg-green-600 hover:bg-green-700 active:scale-95 rounded-xl transition-all shadow-[0_4px_15px_rgba(22,163,74,0.25)]"
    >
      <Download size={16} strokeWidth={2.5} />
      Xuất CSV
    </button>
  );
}
