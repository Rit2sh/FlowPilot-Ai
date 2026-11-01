"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Scale,
  Zap,
  BarChart3,
  Bot,
  CheckCircle2,
  Lock,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "How does FlowPilot AI execute payments?",
    a: "FlowPilot connects directly to the official PayPal v2/checkout/orders API and PayPal Sandbox. When you instruct the agent to bill a client, it generates a verified PayPal order, provides an official checkout URL, and monitors webhooks for settlement confirmation.",
  },
  {
    q: "Can the AI perform financial operations without my permission?",
    a: "No. FlowPilot enforces strict human-in-the-loop governance. Low-risk operations (e.g. querying revenue or searching invoices) execute autonomously, but high-impact actions like payment captures, refunds, and cancellations require explicit owner authorization via an approval inbox.",
  },
  {
    q: "Does the AI hallucinate financial figures?",
    a: "Never. All financial metrics, customer balances, and transaction summaries are computed directly from the PostgreSQL transaction ledger through strict Zod-validated tool calls. The AI synthesizes explanations of verified numbers only.",
  },
  {
    q: "How does the reconciliation engine work?",
    a: "The engine runs heuristic matching algorithms comparing external PayPal capture IDs, order references, timestamps, and decimal amounts against internal invoices. It flags discrepancies and unmatched deposits with explainable confidence scores.",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#080D1A] text-slate-100 selection:bg-[#00F59B]/20 selection:text-[#00F59B]">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 sticky top-0 z-50 bg-[#080D1A]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#10B981] to-[#00F59B] p-0.5 flex items-center justify-center shadow-glow">
              <span className="font-extrabold text-[#080D1A] text-base">F</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-[#00F59B] transition-colors">
              Flow<span className="text-[#00F59B]">Pilot AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-medium">
            <a href="#features" className="hover:text-[#00F59B] transition-colors">Capabilities</a>
            <a href="#agent" className="hover:text-[#00F59B] transition-colors">AI Agent</a>
            <a href="#paypal" className="hover:text-[#00F59B] transition-colors">PayPal Architecture</a>
            <a href="#reconciliation" className="hover:text-[#00F59B] transition-colors">Reconciliation</a>
            <a href="#faq" className="hover:text-[#00F59B] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="bg-[#00F59B] hover:bg-[#10E79D] text-[#080D1A] font-bold text-xs px-4 py-2 rounded-xl shadow-glow transition-all flex items-center gap-1.5"
            >
              Explore Demo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#00F59B]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#00F59B] shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Financial Operations for Global Businesses</span>
          </div>

          {/* Hero Copy (Per Section 8.A Requirements) */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Your Financial Operations. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F59B] via-[#10E79D] to-cyan-400 electric-glow">
              On Autopilot.
            </span>
          </h1>

          {/* Subheading (Per Section 8.A Requirements) */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Create invoices, manage payments, reconcile transactions and understand your business finances through one intelligent AI agent.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-[#00F59B] hover:bg-[#10E79D] text-[#080D1A] font-bold text-sm px-6 py-3.5 rounded-xl shadow-glow transition-all flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto glass-panel hover:bg-slate-800 text-slate-200 font-semibold text-sm px-6 py-3.5 rounded-xl border border-slate-800 transition-all"
            >
              Explore Live Demo
            </Link>
          </div>

          {/* Official Brand Banner Preview */}
          <div className="pt-10 max-w-4xl mx-auto">
            <div className="relative rounded-2xl border border-slate-800 p-2 glass-panel shadow-2xl overflow-hidden group">
              <Image
                src="/flowpilot-banner.jpg"
                alt="FlowPilot AI Banner"
                width={1200}
                height={400}
                className="rounded-xl w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080D1A] via-transparent to-transparent opacity-40 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Live AI Agent Interactive Demonstration Section */}
      <section id="agent" className="py-16 border-t border-slate-800/80 bg-[#060A14]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#00F59B] uppercase tracking-wider">Natural Language Execution</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Tell FlowPilot What Needs to Happen
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              The AI interprets instructions, queries actual database records, executes structured tools through PayPal, and verifies results.
            </p>
          </div>

          {/* Simulated Chat Interface */}
          <div className="max-w-3xl mx-auto glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00F59B] animate-pulse" />
                <span className="font-semibold text-white">FlowPilot Autonomous Agent</span>
              </div>
              <span className="font-mono text-slate-500 text-[11px]">PayPal Sandbox Active</span>
            </div>

            {/* Simulated Messages */}
            <div className="space-y-4 text-xs">
              <div className="flex justify-end">
                <div className="bg-[#10B981] text-white p-3.5 rounded-2xl max-w-md font-medium">
                  "Create a $500 invoice for John for website development and prepare a PayPal payment link."
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-[#0D1629] border border-slate-800 text-slate-200 p-4 rounded-2xl max-w-lg space-y-2.5">
                  <div className="flex items-center gap-2 text-[#00F59B] font-bold text-[11px] uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Plan Executed & Verified
                  </div>
                  <p className="leading-relaxed">
                    Created invoice <strong>INV-2026-021</strong> for <strong>John Doe</strong> ($500.00 USD). PayPal Sandbox order generated with checkout URL.
                  </p>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-400">PayPal Order: ORD-8819-V2</span>
                    <span className="text-[#00F59B] font-semibold">Checkout Ready</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-[#10B981] text-white p-3.5 rounded-2xl max-w-md font-medium">
                  "Did John pay?"
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-[#0D1629] border border-slate-800 text-slate-200 p-4 rounded-2xl max-w-lg space-y-2.5">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-[11px] uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Database Verified Status
                  </div>
                  <p className="leading-relaxed">
                    Invoice <strong>INV-2026-021</strong> is currently <strong>PENDING</strong>. PayPal order created; awaiting customer checkout return.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 text-center">
              <Link
                href="/dashboard/agent"
                className="text-xs text-[#00F59B] hover:underline font-semibold"
              >
                Launch interactive workspace to test instructions →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Product Differentiators Section */}
      <section id="features" className="py-20 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#00F59B] uppercase tracking-wider">Engineered for Fintech</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Five Architectural Capabilities
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Engineered beyond generic chatbot templates to provide real operational financial autonomy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 text-[#00F59B] border border-emerald-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Natural Language Financial Ops</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Issue instructions in plain English. The agent classifies intents, queries actual records, and invokes backend tools with strict validation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">PayPal Sandbox Checkout</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Official PayPal v2 Orders API and webhooks integration with cryptographic signature verification, idempotency, and automated status synchronization.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Reconciliation Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Autonomous 1-to-1 ledger matching between external PayPal deposits and local invoices, detecting amount mismatches and orphaned transactions.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Automated Payment Follow-ups</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Configurable follow-up workflows for delinquent accounts. Reminders are automatically cancelled the moment PayPal confirms payment capture.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Trustworthy Agentic Commerce</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Human-in-the-loop governance. High-risk operations (captures, refunds, cancellations) require explicit business owner confirmation.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">AG Grid Payment Intelligence</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-performance AG Grid Community ledger with column filters, rapid sorting, CSV exports, and deep transaction inspection drawers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-slate-800/80 bg-[#060A14]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#00F59B] uppercase tracking-wider">Architecture Details</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? "rotate-180 text-[#00F59B]" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-10 bg-[#050811] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#00F59B] flex items-center justify-center font-bold text-[#080D1A] text-xs">
              F
            </div>
            <span className="font-semibold text-slate-300">FlowPilot AI</span>
            <span>— Autonomous Financial Operations Agent</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-slate-300">Demo Login</Link>
            <Link href="/dashboard" className="hover:text-slate-300">Dashboard</Link>
            <Link href="/dashboard/agent" className="hover:text-slate-300">AI Copilot</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

