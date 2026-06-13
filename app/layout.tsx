import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Worth It?",
  description: "พื้นที่ช่วยคิดก่อนซื้อของแบบจริงจัง แต่ไม่เยิ่นเย้อ",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body className="bg-[var(--background)] font-sans text-[var(--foreground)] antialiased">{children}</body>
    </html>
  );
}
