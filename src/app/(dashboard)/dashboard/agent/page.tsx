"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Bot,
  User,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

interface TimelineStep {
  stage: string;
  title: string;
  detail: string;
  timestamp: string;
  status: "success" | "pending" | "waiting" | "failed";
}

interface Message {
  id: string;
  sender: "USER" | "ASSISTANT";
  content: string;
  steps?: TimelineStep[];
  approvalRequired?: boolean;
  approvalRequest?: any;
  checkoutUrl?: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  "Create a $500 invoice for John for website development and prepare a PayPal payment link.",
  "Did John pay?",
  "Show all customers who haven't paid.",
  "How much revenue did I receive this month?",
  "Find payments that don't have matching invoices.",
  "Prepare a payment reminder for overdue customers.",
];

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-msg",
      sender: "ASSISTANT",
      content:
        "Welcome to **FlowPilot AI**. I am your autonomous financial operations agent.\n\nI can execute payment workflows, manage invoices, create verified PayPal orders, reconcile ledger records, and follow up with overdue clients.\n\nTry issuing a natural language command below.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (commandToSend?: string) => {
    const text = (commandToSend || input).trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "USER",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!commandToSend) setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error("Failed to process instruction.");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: data.messageId || `asst-${Date.now()}`,
        sender: "ASSISTANT",
        content: data.content,
        steps: data.steps,
        approvalRequired: data.approvalRequired,
        approvalRequest: data.approvalRequest,
        checkoutUrl: data.toolResult?.checkoutUrl,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "ASSISTANT",
          content: `❌ **Operation Error**: ${err.message || "An unexpected error occurred while executing tool."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (approvalId: string) => {
    try {
      const res = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalId, action: "APPROVE" }),
      });
      if (res.ok) {
        alert("Operation authorized and executed through PayPal Sandbox!");
        handleSend("Show my pending payments");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between p-4 rounded-xl glass-panel border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#10B981] to-[#00F59B] p-0.5 flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-[#080D1A]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Autonomous Financial Agent
              <span className="text-[10px] bg-emerald-950 text-[#00F59B] border border-[#00F59B]/40 px-2 py-0.5 rounded-full font-mono font-semibold">
                PAYPAL ACTIVE
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Deterministic tool execution with real database grounding and human-in-the-loop authorization.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-[#00F59B]" />
          <span>Zero Hallucinations Guarantee</span>
        </div>
      </div>

      {/* Suggested Command Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
          Quick Ops:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="text-xs font-medium text-slate-300 bg-[#0D1629] hover:bg-slate-800 hover:text-[#00F59B] border border-slate-800 hover:border-[#00F59B]/40 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-5 p-4 rounded-2xl glass-panel border border-slate-800/80">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 text-xs ${msg.sender === "USER" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "ASSISTANT" && (
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-[#00F59B]" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 space-y-3 ${
                msg.sender === "USER"
                  ? "bg-gradient-to-r from-emerald-600 to-[#10B981] text-white font-medium"
                  : "bg-[#0D1629] border border-slate-800 text-slate-200"
              }`}
            >
              {/* Message Content */}
              <div className="whitespace-pre-wrap leading-relaxed text-[13px]">
                {msg.content}
              </div>

              {/* Render Visible Execution Timeline Stages */}
              {msg.steps && msg.steps.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Agent Execution Timeline
                  </span>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    {msg.steps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        {step.status === "success" && <CheckCircle2 className="w-3.5 h-3.5 text-[#00F59B] shrink-0 mt-0.5" />}
                        {step.status === "waiting" && <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />}
                        {step.status === "failed" && <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />}
                        <div>
                          <span className="text-white font-semibold">{step.title}</span>
                          <p className="text-slate-400 font-sans text-[11px]">{step.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approval Card for High-Risk Actions */}
              {msg.approvalRequired && msg.approvalRequest && (
                <div className="mt-3 p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Authorization Required (High-Risk Operation)</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    {msg.approvalRequest.summary}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleApprove(msg.approvalRequest.id)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition-colors text-xs"
                    >
                      Authorize & Execute
                    </button>
                    <span className="text-[11px] text-slate-400">or review in Approvals Inbox</span>
                  </div>
                </div>
              )}

              {/* Verified PayPal Checkout Link Card */}
              {msg.checkoutUrl && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00F59B]" />
                      PayPal Sandbox Checkout Ready
                    </span>
                    <p className="text-[11px] text-slate-400 truncate max-w-sm">
                      {msg.checkoutUrl}
                    </p>
                  </div>
                  <a
                    href={msg.checkoutUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-[#00F59B] hover:bg-[#10E79D] text-[#080D1A] font-bold px-3 py-1.5 rounded-lg text-xs shrink-0 transition-colors"
                  >
                    Pay Now <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <span className="text-[10px] text-slate-500 block text-right">
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === "USER" && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 text-xs items-center text-slate-400">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#00F59B] animate-spin" />
            </div>
            <div className="flex items-center gap-2 bg-[#0D1629] border border-slate-800 px-4 py-2.5 rounded-2xl">
              <div className="w-2 h-2 rounded-full bg-[#00F59B] animate-ping" />
              <span className="font-mono text-xs text-slate-300">
                Orchestrating agent plan & querying database ledger...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <div className="p-2 rounded-2xl glass-panel border border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Instruct FlowPilot (e.g. 'Create a $500 invoice for John for website development')..."
            className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-[#00F59B] hover:bg-[#10E79D] disabled:opacity-40 disabled:cursor-not-allowed text-[#080D1A] font-bold p-3 rounded-xl transition-all shadow-glow flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

