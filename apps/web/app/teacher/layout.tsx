"use client";

import Sidebar from "@/components/dashboard/Sidebar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 text-gray-900 overflow-hidden h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
        {/* Scrollable Content - Header is now part of each page */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
