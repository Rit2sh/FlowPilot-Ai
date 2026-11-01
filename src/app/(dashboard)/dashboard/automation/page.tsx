"use client";

import { useState, useEffect } from "react";
import {
  Zap,
  Clock,
  Mail,
  CheckCircle,
  Pause,
  Play,
  Plus,
  Calendar,
  AlertTriangle,
  Send,
  X,
} from "lucide-react";

export default function AutomationPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [ruleName, setRuleName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerEvent, setTriggerEvent] = useState("INVOICE_OVERDUE");

  const fetchAutomation = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/automation");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomation();
  }, []);

  const handleToggle = async (ruleId: string) => {
    try {
      await fetch("/api/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", ruleId }),
      });
      fetchAutomation();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: ruleName,
          description,
          triggerEvent,
          actionType: "PREPARE_DRAFT_REMINDER",
        }),
      });
      setShowCreateModal(false);
      setRuleName("");
      setDescription("");
      fetchAutomation();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#00F59B] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Loading payment automation engine...</p>
        </div>
      </div>
    );
  }

  const { rules, reminders } = data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Payment Follow-up Automation
            <span className="text-xs bg-emerald-950 text-[#00F59B] border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-mono font-medium">
              Event-Driven Workflows
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Autonomous overdue reminders, instant webhook reconciliation, and client payment chase workflows.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#00F59B] hover:bg-[#10E79D] text-[#080D1A] font-bold text-xs px-4 py-2.5 rounded-xl shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          New Automation Rule
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule: any) => (
          <div key={rule.id} className="glass-panel p-5 rounded-2xl space-y-4 border border-slate-800">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    rule.isEnabled
                      ? "bg-emerald-950 text-[#00F59B] border border-emerald-500/30"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{rule.name}</h3>
                  <span className="text-[11px] font-mono text-[#00F59B]">{rule.triggerEvent}</span>
                </div>
              </div>

              <button
                onClick={() => handleToggle(rule.id)}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  rule.isEnabled
                    ? "bg-emerald-950/60 text-emerald-400 hover:bg-rose-950/40 hover:text-rose-400"
                    : "bg-slate-800 text-slate-300 hover:bg-emerald-950/60 hover:text-emerald-400"
                }`}
              >
                {rule.isEnabled ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Enabled
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Paused
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{rule.description}</p>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> Action: {rule.actionType}
              </span>
              <span className="text-[11px] text-[#00F59B] font-mono">
                {rule.executions?.length || 1} Executions Logged
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Scheduled Follow-ups */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#00F59B]" />
            Queued Payment Reminders (Autonomous Follow-ups)
          </h2>
          <span className="text-xs text-slate-400">
            Automatically cancelled when PayPal payment is detected
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="p-4">Customer</th>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Scheduled For</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {reminders.map((rem: any) => (
                <tr key={rem.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 font-sans">
                    <span className="font-semibold text-white">{rem.customer?.name}</span>
                    <span className="text-[11px] text-slate-500 block">{rem.recipientEmail}</span>
                  </td>
                  <td className="p-4 font-bold text-[#00F59B]">{rem.invoice?.invoiceNumber}</td>
                  <td className="p-4 font-sans">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {rem.channel}
                    </span>
                  </td>
                  <td className="p-4 font-sans text-slate-300 truncate max-w-xs">{rem.subject}</td>
                  <td className="p-4 text-slate-400">
                    {new Date(rem.scheduledFor).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {rem.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Automation Rule */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1629] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00F59B]" />
                New Automation Rule
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Overdue 7-Day Gentle Reminder"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Trigger Event</label>
                <select
                  value={triggerEvent}
                  onChange={(e) => setTriggerEvent(e.target.value)}
                  className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
                >
                  <option value="INVOICE_OVERDUE">When Invoice Becomes Overdue</option>
                  <option value="PAYMENT_RECEIVED">When PayPal Payment Is Captured</option>
                  <option value="UPCOMING_DUE_DATE">3 Days Prior to Due Date</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe workflow condition and action..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#080D1A] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00F59B]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00F59B] hover:bg-[#10E79D] text-[#080D1A] font-bold px-4 py-2 rounded-lg transition-colors shadow-glow"
                >
                  Create Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

