/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Filter,
  RefreshCw,
  Eye,
  DollarSign,
  UserPlus,
  Headset,
} from "lucide-react";
import ExportCSV from "../../components/common/ExportCSV";
import { getReports } from "../../api/overviewApi";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#64748b",
  "#ec4899",
  "#06b6d4",
];

export default function DashboardReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [filter, setFilter] = useState({
    from_date: lastMonth.toISOString().split("T")[0],
    to_date: today.toISOString().split("T")[0],
    type: "day",
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getReports(filter);
      if (res.success || res) setData(res.data || res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const chartData = useMemo(() => {
    if (!data || !data.views) return [];
    return data.views.map((v, i) => {
      let shortLabel = v.label;
      if (filter.type === "day" && v.label.includes("-")) {
        const parts = v.label.split("-");
        shortLabel = `${parts[2]}/${parts[1]}`;
      } else if (filter.type === "week" && v.label.includes("-")) {
        const parts = v.label.split("-");
        shortLabel = `Tuần ${parts[1]}`;
      }
      return {
        label: shortLabel,
        fullLabel: v.label,
        views: v.views,
        revenue: data.revenue?.[i]?.revenue || 0,
        users: data.users ? data.users[i]?.users || 0 : 0,
        tickets: data.tickets ? data.tickets[i]?.tickets || 0 : 0, // Dữ liệu ticket mới
      };
    });
  }, [data, filter.type]);

  const summaryTotals = useMemo(() => {
    if (!data) return { views: 0, revenue: 0, users: 0, tickets: 0 };
    return {
      views: data.views?.reduce((sum, item) => sum + item.views, 0) || 0,
      revenue: data.revenue?.reduce((sum, item) => sum + item.revenue, 0) || 0,
      users: data.users
        ? data.users.reduce((sum, item) => sum + item.users, 0)
        : 0,
      tickets: data.tickets
        ? data.tickets.reduce((sum, item) => sum + item.tickets, 0)
        : 0,
    };
  }, [data]);
  const csvData = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    return chartData.map((row) => ({
      "Thời gian": row.fullLabel || row.label,
      "Lượt xem": row.views,
      "Doanh thu (VNĐ)": row.revenue,
      "Tài khoản mới": row.users,
      "Yêu cầu hỗ trợ": row.tickets,
    }));
  }, [chartData]);

  const SimpleTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg">
          <p className="text-slate-500 font-bold mb-2 text-xs border-b border-slate-100 pb-2">
            {label}
          </p>
          <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
            {payload[0].name.includes("Doanh thu")
              ? payload[0].value.toLocaleString() + "₫"
              : payload[0].value.toLocaleString()}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col relative w-full min-h-screen bg-[#FCFDFE] p-6 space-y-6 font-sans">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Báo cáo & Phân tích
        </h1>
        <p className="text-[14px] text-slate-500 font-medium">
          Chi tiết 4 biểu đồ báo cáo hiệu suất 📊
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 border-r border-slate-200 text-slate-500">
            <Filter size={18} strokeWidth={2.5} />
            <span className="text-[13px] font-black uppercase tracking-wider mr-2">
              Bộ lọc
            </span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200/60">
            <input
              type="date"
              value={filter.from_date}
              onChange={(e) =>
                setFilter({ ...filter, from_date: e.target.value })
              }
              className="px-3 py-1.5 text-[13px] bg-transparent outline-none text-slate-700 font-bold"
            />
            <span className="text-slate-300 font-bold">➝</span>
            <input
              type="date"
              value={filter.to_date}
              onChange={(e) =>
                setFilter({ ...filter, to_date: e.target.value })
              }
              className="px-3 py-1.5 text-[13px] bg-transparent outline-none text-slate-700 font-bold"
            />
          </div>
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="px-4 py-2.5 text-[13px] bg-white border border-slate-200 rounded-xl text-slate-700 font-bold outline-none shadow-sm"
          >
            <option value="day">Hiển thị theo Ngày</option>
            <option value="week">Hiển thị theo Tuần</option>
            <option value="month">Hiển thị theo Tháng</option>
            <option value="year">Hiển thị theo Năm</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          {data && data.views && data.views.length > 0 && (
            <ExportCSV
              data={csvData}
              fileName={`Bao_Cao_Thong_Ke_${filter.from_date}_den_${filter.to_date}`}
            />
          )}
          <button
            onClick={fetchReports}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 text-[13px] font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl transition-all shadow-[0_4px_15px_rgba(37,99,235,0.25)]"
          >
            <RefreshCw
              size={16}
              strokeWidth={2.5}
              className={loading ? "animate-spin" : ""}
            />
            {loading ? "Đang xử lý..." : "Áp dụng"}
          </button>
        </div>
      </div>

      {!data ? (
        <div className="h-64 flex items-center justify-center text-slate-400">
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="space-y-6">
          {/* SỬA LẠI THÀNH LƯỚI 4 CỘT CHO SUMMARY CARDS */}
          <div className="grid grid-cols-4 gap-5">
            <div className="bg-white border border-blue-100 p-5 rounded-3xl shadow-sm flex justify-between items-center">
              <div>
                <div className="text-blue-500 text-[11px] font-black mb-1 uppercase tracking-wider">
                  Tổng Lượt Xem
                </div>
                <div className="text-3xl font-black text-slate-800">
                  {summaryTotals.views.toLocaleString()}
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                <Eye size={24} />
              </div>
            </div>
            <div className="bg-white border border-emerald-100 p-5 rounded-3xl shadow-sm flex justify-between items-center">
              <div>
                <div className="text-emerald-500 text-[11px] font-black mb-1 uppercase tracking-wider">
                  Tổng Doanh Thu
                </div>
                <div className="text-3xl font-black text-slate-800">
                  {summaryTotals.revenue.toLocaleString()}₫
                </div>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                <DollarSign size={24} />
              </div>
            </div>
            <div className="bg-white border border-amber-100 p-5 rounded-3xl shadow-sm flex justify-between items-center">
              <div>
                <div className="text-amber-500 text-[11px] font-black mb-1 uppercase tracking-wider">
                  Tài Khoản Mới
                </div>
                <div className="text-3xl font-black text-slate-800">
                  {summaryTotals.users.toLocaleString()}
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                <UserPlus size={24} />
              </div>
            </div>
            {/* THẺ YÊU CẦU HỖ TRỢ MỚI */}
            <div className="bg-white border border-rose-100 p-5 rounded-3xl shadow-sm flex justify-between items-center">
              <div>
                <div className="text-rose-500 text-[11px] font-black mb-1 uppercase tracking-wider">
                  Yêu Cầu Hỗ Trợ
                </div>
                <div className="text-3xl font-black text-slate-800">
                  {summaryTotals.tickets.toLocaleString()}
                </div>
              </div>
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                <Headset size={24} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100">
              <h2 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-sm" /> Doanh Thu
                Kì Lọc (VNĐ)
              </h2>
              <div className="h-50 w-full">
                <ResponsiveContainer>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorR" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                      tickFormatter={(val) =>
                        val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val
                      }
                    />
                    <RechartsTooltip
                      content={<SimpleTooltip />}
                      cursor={{ stroke: "#cbd5e1", strokeDasharray: "3 3" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Doanh thu"
                      stroke="#10b981"
                      strokeWidth={3}
                      fill="url(#colorR)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100">
              <h2 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-sm" /> Lượt Xem Kì
                Lọc
              </h2>
              <div className="h-50 w-full">
                <ResponsiveContainer>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                      allowDecimals={false}
                    />
                    <RechartsTooltip
                      content={<SimpleTooltip />}
                      cursor={{ stroke: "#cbd5e1", strokeDasharray: "3 3" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      name="Lượt xem"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#colorV)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100">
              <h2 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-sm" /> Người Dùng
                Mới
              </h2>
              <div className="h-50 w-full">
                <ResponsiveContainer>
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                      allowDecimals={false}
                    />
                    <RechartsTooltip
                      content={<SimpleTooltip />}
                      cursor={{ fill: "#f8fafc" }}
                    />
                    <Bar
                      dataKey="users"
                      name="Người dùng"
                      fill="#f59e0b"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100">
              <h2 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-rose-500 rounded-sm" /> Lượt Yêu Cầu
                Hỗ Trợ
              </h2>
              <div className="h-50 w-full">
                <ResponsiveContainer>
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                      allowDecimals={false}
                    />
                    <RechartsTooltip
                      content={<SimpleTooltip />}
                      cursor={{ fill: "#fff1f2" }}
                    />
                    <Bar
                      dataKey="tickets"
                      name="Yêu cầu hỗ trợ"
                      fill="#f43f5e"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-[16px] font-bold text-slate-800">
                  Top Phim Xem Nhiều Nhất Kì Lọc
                </h2>
              </div>
              <div className="overflow-x-auto max-h-95">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-slate-50/80 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest w-20">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Tên Phim
                      </th>
                      <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">
                        Tổng Lượt Xem
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.top_movies?.length === 0 ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="text-center py-10 text-slate-400 font-medium"
                        >
                          Không có dữ liệu lượt xem
                        </td>
                      </tr>
                    ) : (
                      data.top_movies?.map((m, i) => (
                        <tr
                          key={m.id}
                          className="hover:bg-blue-50/40 transition-colors border-b border-slate-50 last:border-0"
                        >
                          <td className="px-6 py-4 font-black text-slate-300 text-[14px]">
                            #{i + 1}
                          </td>
                          <td className="px-6 py-4 flex items-center gap-4">
                            <img
                              src={m.poster_url}
                              alt={m.name}
                              className="w-12 h-16 rounded-xl object-cover shadow-sm border border-slate-100"
                            />
                            <span className="font-bold text-slate-700 text-[14px] hover:text-blue-600 cursor-pointer transition-colors">
                              {m.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="inline-flex items-center px-4 py-2 rounded-xl text-[13px] font-black bg-slate-50 text-slate-600 border border-slate-100">
                              {m.views.toLocaleString()} view
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100">
              <h2 className="text-[16px] font-bold text-slate-800 mb-4">
                Phân bổ Gói VIP
              </h2>
              <div className="h-55">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <RechartsTooltip
                      formatter={(value) => `${value.toLocaleString()}₫`}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        fontWeight: "bold",
                      }}
                    />
                    <Pie
                      data={
                        data.plans_distribution?.filter(
                          (p) => p.total_revenue > 0,
                        ) || []
                      }
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="total_revenue"
                      nameKey="name"
                      stroke="none"
                    >
                      {data.plans_distribution
                        ?.filter((p) => p.total_revenue > 0)
                        .map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 space-y-3 max-h-40 overflow-y-auto pr-2">
                {data.plans_distribution?.filter((p) => p.total_revenue > 0)
                  .length === 0 ? (
                  <div className="text-center text-slate-400 text-sm font-medium mt-10">
                    Chưa có giao dịch
                  </div>
                ) : (
                  data.plans_distribution
                    ?.filter((p) => p.total_revenue > 0)
                    .map((plan, i) => (
                      <div
                        key={plan.id}
                        className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3.5 h-3.5 rounded-full shadow-sm"
                            style={{
                              backgroundColor: COLORS[i % COLORS.length],
                            }}
                          ></div>
                          <span className="text-[13px] font-bold text-slate-600">
                            {plan.name}
                          </span>
                        </div>
                        <span className="text-[14px] font-black text-slate-800">
                          {plan.total_revenue.toLocaleString()}₫
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
