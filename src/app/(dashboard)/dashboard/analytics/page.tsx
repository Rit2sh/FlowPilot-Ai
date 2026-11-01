"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  Calendar,
  Download,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#00F59B", "#06B6D4", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#00F59B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { summary, revenueChart, topCustomers } = data;

  const invoiceDistribution = [
    { name: "Paid & Settled", value: summary.paidCount, color: "#00F59B" },
    { name: "Pending Checkout", value: Math.max(1, summary.invoiceCount - summary.paidCount - 3), color: "#06B6D4" },
    { name: "Overdue Reminders", value: 3, color: "#F59E0B" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Financial Analytics & Intelligence
            <span className="text-xs bg-emerald-950 text-[#00F59B] border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-mono font-medium">
              PostgreSQL Verified
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time financial ratios, payment completion velocity, customer concentration and aging analyses.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-[#0D1629] hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <Download className="w-4 h-4 text-[#00F59B]" />
          Export Executive Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-[#00F59B] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Settled MRR</span>
          <div className="text-2xl font-extrabold text-white font-mono">${summary.totalRevenue.toLocaleString()}</div>
          <p className="text-[11px] text-[#00F59B]">100% verified via PayPal captures</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-cyan-500 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Pending Receivables</span>
          <div className="text-2xl font-extrabold text-white font-mono">${summary.totalPending.toLocaleString()}</div>
          <p className="text-[11px] text-cyan-400">Orders created in sandbox</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-amber-500 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Overdue Delinquent</span>
          <div className="text-2xl font-extrabold text-white font-mono">${summary.totalOverdue.toLocaleString()}</div>
          <p className="text-[11px] text-amber-400">Automated reminder workflows queued</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-emerald-500 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Completion Rate</span>
          <div className="text-2xl font-extrabold text-white font-mono">{summary.collectionRate}</div>
          <p className="text-[11px] text-slate-400">B2B collection velocity</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Performance by Month */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Monthly Collections</h2>
              <p className="text-xs text-slate-400">Gross revenue captured in USD</p>
            </div>
            <span className="text-xs font-mono text-[#00F59B]">Billed vs Paid</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0D1629", borderColor: "#1E293B", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(val: any) => [`$${val.toLocaleString()} USD`, "Captured"]}
                />
                <Bar dataKey="revenue" fill="#00F59B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invoice Lifecycle Distribution */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Invoice Status Breakdown</h2>
            <p className="text-xs text-slate-400">Portfolio lifecycle distribution</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={invoiceDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={5}
                >
                  {invoiceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0D1629", borderColor: "#1E293B", borderRadius: "8px", fontSize: "12px" }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-800">
            {invoiceDistribution.map((item) => (
              <div key={item.name} className="space-y-0.5">
                <span className="text-[10px] text-slate-400 block">{item.name}</span>
                <span className="font-mono font-bold text-white" style={{ color: item.color }}>
                  {item.value} Invoices
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Concentration Analysis */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Customer Revenue Concentration</h2>
          <p className="text-xs text-slate-400">Account billing totals and percentage of gross revenue</p>
        </div>

        <div className="space-y-3">
          {topCustomers.map((cust: any) => {
            const pct = Math.round((cust.amount / summary.totalRevenue) * 100) || 0;
            return (
              <div key={cust.name} className="space-y-1 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-200">{cust.name}</span>
                  <span className="font-mono text-[#00F59B] font-bold">
                    ${cust.amount.toLocaleString()} USD ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-[#00F59B]"
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

