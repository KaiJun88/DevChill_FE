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
} from "recharts";
import {
  Users,
  CreditCard,
  DollarSign,
  AlertOctagon,
  TrendingUp,
  ShieldAlert,
  Ticket,
  Activity,
} from "lucide-react";
import ExportCSV from "../../components/common/ExportCSV";
import { getDashboard24h } from "../../api/overviewApi";

export default function DashboardOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboard24h();
        if (res.success || res) setData(res.data || res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentHour = new Date().getHours();

  const chartData = useMemo(() => {
    if (!data || !data.views_by_hour) return [];
    return data.views_by_hour.map((item, index) => {
      const hourNum = parseInt(item.hour.split(":")[0], 10);
      const isFuture = hourNum > currentHour;
      return {
        hour: item.hour,
        views: isFuture ? null : Number(item.views || 0),
        revenue: isFuture
          ? null
          : Number(data.revenue_by_hour?.[index]?.revenue || 0),
        transactions: isFuture
          ? null
          : Number(data.trans_by_hour?.[index]?.count || 0),
        users: isFuture
          ? null
          : Number(data.users_by_hour?.[index]?.count || 0),
        alerts: isFuture
          ? null
          : Number(data.alerts_by_hour?.[index]?.count || 0),
      };
    });
  }, [data, currentHour]);
  const csvData = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    return chartData.map((row) => ({
      "Khung giờ": row.hour,
      "Lượt xem": row.views || 0,
      "Doanh thu (VNĐ)": row.revenue || 0,
      "Giao dịch": row.transactions || 0,
      "User mới": row.users || 0,
      "Cảnh báo/Lỗi": row.alerts || 0,
    }));
  }, [chartData]);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg">
          <p className="text-slate-500 font-bold mb-2 text-xs border-b border-slate-100 pb-2">
            Khung giờ: {label}
          </p>
          <div className="flex flex-col gap-1.5">
            {payload.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-6 text-[13px] font-bold text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span>{entry.name}</span>
                </div>
                <span>
                  {entry.name.includes("Doanh thu")
                    ? entry.value.toLocaleString() + "₫"
                    : entry.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading || !data)
    return (
      <div className="flex h-screen items-center justify-center bg-[#FCFDFE]">
        <div className="flex flex-col items-center gap-3">
          <TrendingUp size={36} className="animate-bounce text-blue-500" />
          <span className="text-slate-500 font-medium text-sm">
            Đang đồng bộ dữ liệu...
          </span>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FCFDFE] p-6 space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2 text-left">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Báo Cáo Nhanh 24H
          </h1>
          <p className="text-[15px] text-slate-500 font-medium">
            Hệ thống giám sát chi tiết từ 00:00 đến hiện tại ⚡
          </p>
        </div>
        <div className="shrink-0">
          <ExportCSV
            data={csvData}
            fileName={`Bao_Cao_24h_${new Date().toLocaleDateString("vi-VN").replace(/\//g, "-")}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-slate-400 text-[11px] font-bold mb-1 uppercase tracking-wider">
                Doanh thu
              </div>
              <div className="text-2xl font-black text-slate-800">
                {data.kpi.revenue.toLocaleString()}₫
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <DollarSign size={20} strokeWidth={2.5} />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-slate-400 text-[11px] font-bold mb-1 uppercase tracking-wider">
                Lượt Giao Dịch
              </div>
              <div className="text-2xl font-black text-slate-800">
                {data.kpi.total_transactions}
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
              <CreditCard size={20} strokeWidth={2.5} />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-slate-400 text-[11px] font-bold mb-1 uppercase tracking-wider">
                Người dùng mới
              </div>
              <div className="text-2xl font-black text-slate-800">
                {data.kpi.new_users}
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
              <Users size={20} strokeWidth={2.5} />
            </div>
          </div>
        </div>
        <div
          className={`p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border hover:-translate-y-1 transition-transform ${data.alerts.payment_failed > 0 || data.alerts.open_tickets > 0 ? "bg-rose-50/50 border-rose-100" : "bg-white border-slate-100"}`}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-slate-500 text-[11px] font-bold mb-1 uppercase tracking-wider">
                Cần Xử Lý Ngay
              </div>
              <div className="text-2xl font-black text-rose-600">
                {data.alerts.payment_failed + data.alerts.open_tickets}
              </div>
            </div>
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${data.alerts.payment_failed > 0 ? "bg-rose-100 text-rose-600 animate-pulse" : "bg-slate-100 text-slate-400"}`}
            >
              <AlertOctagon size={20} strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 mt-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold">
              <ShieldAlert
                size={14}
                className={
                  data.alerts.payment_failed > 0
                    ? "text-rose-500"
                    : "text-slate-400"
                }
              />
              <span
                className={
                  data.alerts.payment_failed > 0
                    ? "text-rose-600"
                    : "text-slate-500"
                }
              >
                {data.alerts.payment_failed} Giao dịch nạp lỗi
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold">
              <Ticket
                size={14}
                className={
                  data.alerts.open_tickets > 0
                    ? "text-amber-500"
                    : "text-slate-400"
                }
              />
              <span
                className={
                  data.alerts.open_tickets > 0
                    ? "text-amber-600"
                    : "text-slate-500"
                }
              >
                {data.alerts.open_tickets} Ticket chờ phản hồi
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100">
              <h2 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-sm" /> Doanh Thu
                (VNĐ)
              </h2>
              <div className="h-50 w-full">
                <ResponsiveContainer>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorRev24"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
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
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="hour"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                      tickMargin={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#10b981", fontSize: 10, fontWeight: 600 }}
                      tickMargin={10}
                      tickFormatter={(val) =>
                        val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val
                      }
                    />
                    <RechartsTooltip
                      content={<CustomTooltip />}
                      cursor={{
                        stroke: "#cbd5e1",
                        strokeWidth: 1,
                        strokeDasharray: "4 4",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Doanh thu"
                      stroke="#10b981"
                      strokeWidth={3}
                      fill="url(#colorRev24)"
                      connectNulls={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100">
              <h2 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-sm" /> Lượt Xem
              </h2>
              <div className="h-50 w-full">
                <ResponsiveContainer>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorView24"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
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
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="hour"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                      tickMargin={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#3b82f6", fontSize: 10, fontWeight: 600 }}
                      tickMargin={10}
                      allowDecimals={false}
                    />
                    <RechartsTooltip
                      content={<CustomTooltip />}
                      cursor={{
                        stroke: "#cbd5e1",
                        strokeWidth: 1,
                        strokeDasharray: "4 4",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      name="Lượt xem"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#colorView24)"
                      connectNulls={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100">
              <h2 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-400 rounded-sm" /> Số Giao Dịch
              </h2>
              <div className="h-50 w-full">
                <ResponsiveContainer>
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="hour"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                      tickMargin={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#06b6d4", fontSize: 10, fontWeight: 600 }}
                      tickMargin={10}
                      allowDecimals={false}
                    />
                    <RechartsTooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "#f8fafc" }}
                    />
                    <Bar
                      dataKey="transactions"
                      name="Giao dịch"
                      fill="#22d3ee"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100">
              <h2 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-sm" /> Người Dùng
                Mới
              </h2>
              <div className="h-50 w-full">
                <ResponsiveContainer>
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="hour"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                      tickMargin={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6366f1", fontSize: 10, fontWeight: 600 }}
                      tickMargin={10}
                      allowDecimals={false}
                    />
                    <RechartsTooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "#f8fafc" }}
                    />
                    <Bar
                      dataKey="users"
                      name="Tài khoản mới"
                      fill="#6366f1"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100">
            <h2 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-500 rounded-sm" /> Tần Suất Cảnh
              Báo Lỗi & Hỗ Trợ
            </h2>
            <div className="h-50 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="hour"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                    tickMargin={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#f43f5e", fontSize: 10, fontWeight: 600 }}
                    tickMargin={10}
                    allowDecimals={false}
                  />
                  <RechartsTooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "#fff1f2" }}
                  />
                  <Bar
                    dataKey="alerts"
                    name="Phát sinh cảnh báo"
                    fill="#f43f5e"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 sticky top-6">
          <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col max-h-[calc(100vh-100px)]">
            <div className="flex justify-between items-center mb-5 border-b border-slate-50 pb-4">
              <h2 className="text-[16px] font-black text-slate-800 flex items-center gap-2">
                <Activity size={18} className="text-blue-500" /> Trending Hôm
                Nay
              </h2>
            </div>
            <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {data.top_movies.length === 0 ? (
                <div className="m-auto text-center text-slate-400 text-sm font-medium py-10">
                  Chưa có lượt xem nào hôm nay
                </div>
              ) : (
                data.top_movies.map((movie, i) => (
                  <div
                    key={movie.id}
                    className="group flex items-center gap-3.5 p-3 rounded-2xl hover:bg-blue-50/50 transition-all border border-transparent hover:border-blue-100 cursor-pointer"
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-[13px] shadow-sm ${i === 0 ? "bg-amber-100 text-amber-600" : i === 1 ? "bg-slate-200 text-slate-600" : i === 2 ? "bg-orange-100 text-orange-600" : "bg-slate-50 text-slate-400"}`}
                    >
                      #{i + 1}
                    </div>
                    <img
                      src={movie.poster_url}
                      alt={movie.name}
                      className="w-12 h-16 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13.5px] font-bold text-slate-700 truncate group-hover:text-blue-600 transition-colors">
                        {movie.name}
                      </h4>
                      <div className="flex items-center mt-1.5">
                        <span className="text-[11px] font-black text-blue-500 bg-blue-50 border border-blue-100/50 px-2.5 py-0.5 rounded-lg">
                          {movie.views} view
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
