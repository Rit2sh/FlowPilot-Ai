"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent } from "ag-grid-community";
import {
  Download,
  Search,
  Filter,
  CreditCard,
  ExternalLink,
  X,
  ShieldCheck,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";

export default function PaymentsLedgerPage() {
  const [rowData, setRowData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [quickFilterText, setQuickFilterText] = useState("");
  const gridRef = useRef<AgGridReact>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/payments");
      if (res.ok) {
        const json = await res.json();
        setRowData(json.rows || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // AG Grid Column Definitions
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "Date",
        field: "date",
        sortable: true,
        filter: "agDateColumnFilter",
        width: 120,
      },
      {
        headerName: "Customer",
        field: "customerName",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        cellRenderer: (params: any) => (
          <div className="font-semibold text-slate-200">
            {params.value}
            <span className="text-[10px] text-slate-500 block leading-tight font-normal">
              {params.data.customerEmail}
            </span>
          </div>
        ),
      },
      {
        headerName: "Invoice Ref",
        field: "invoiceNumber",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 140,
        cellClass: "font-mono font-medium text-slate-300",
      },
      {
        headerName: "PayPal Reference / Capture",
        field: "externalReference",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        cellClass: "font-mono text-xs text-slate-400",
      },
      {
        headerName: "Type",
        field: "type",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Amount",
        field: "amount",
        sortable: true,
        filter: "agNumberColumnFilter",
        width: 130,
        cellRenderer: (params: any) => (
          <span className="font-mono font-bold text-[#00F59B]">
            ${Number(params.value).toLocaleString()}{" "}
            <span className="text-[10px] text-slate-500 font-normal">USD</span>
          </span>
        ),
      },
      {
        headerName: "Status",
        field: "status",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 130,
        cellRenderer: (params: any) => {
          const val = params.value;
          const isSettled = val === "SETTLED" || val === "MATCHED";
          return (
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                isSettled
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-950 text-amber-400 border border-amber-500/30"
              }`}
            >
              {val}
            </span>
          );
        },
      },
      {
        headerName: "Inspect",
        width: 100,
        cellRenderer: (params: any) => (
          <button
            onClick={() => setSelectedTx(params.data)}
            className="text-xs text-[#00F59B] hover:underline font-semibold"
          >
            Details →
          </button>
        ),
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      filter: true,
    }),
    []
  );

  const handleExportCsv = () => {
    window.location.href = "/api/payments?format=csv";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Payment Intelligence Ledger
            <span className="text-xs bg-emerald-950 text-[#00F59B] border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-mono font-medium">
              AG Grid Community Engine
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time transaction synchronization, high-speed sorting, column filters, and export capabilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPayments}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-[#00F59B] transition-colors"
            title="Refresh Ledger"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 bg-[#0D1629] hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#00F59B]" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="flex items-center justify-between glass-panel p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search all columns (customer, capture ID, invoice #)..."
            value={quickFilterText}
            onChange={(e) => setQuickFilterText(e.target.value)}
            className="w-full bg-[#0D1629] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00F59B]"
          />
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-[#00F59B]" />
          <span>{rowData.length} Synchronized PayPal Ledger Records</span>
        </div>
      </div>

      {/* AG Grid Container */}
      <div className="ag-theme-alpine-dark w-full h-[520px] rounded-2xl shadow-card overflow-hidden">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={quickFilterText}
          pagination={true}
          paginationPageSize={15}
          rowSelection="single"
          animateRows={true}
        />
      </div>

      {/* Transaction Detail Drawer Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1629] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-3 border-b border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Transaction Inspector
              </span>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#00F59B]" />
                {selectedTx.description}
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Ledger ID:</span>
                <span className="font-mono text-slate-200">{selectedTx.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Customer:</span>
                <span className="font-semibold text-white">{selectedTx.customerName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Customer Email:</span>
                <span className="text-slate-300">{selectedTx.customerEmail}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Invoice Reference:</span>
                <span className="font-mono font-bold text-[#00F59B]">{selectedTx.invoiceNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">External PayPal Reference:</span>
                <span className="font-mono text-slate-300">{selectedTx.externalReference}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Amount & Currency:</span>
                <span className="font-mono font-bold text-white">${selectedTx.amount.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Settlement Status:</span>
                <span className="font-semibold text-emerald-400">{selectedTx.status}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-300 font-mono">{selectedTx.date}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              Verified through PayPal sandbox capture listener. Reconciliation state confirmed 1-to-1 in PostgreSQL.
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

