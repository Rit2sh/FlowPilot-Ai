import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowPilot AI — Autonomous Financial Operations Platform",
  description: "AI-Powered financial operations agent for automated invoicing, PayPal checkout, reconciliation and payment intelligence.",
  icons: {
    icon: "/flowpilot-banner.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080D1A] text-slate-100 antialiased font-sans selection:bg-[#00F59B]/20 selection:text-[#00F59B]">
        {children}
      </body>
    </html>
  );
}

