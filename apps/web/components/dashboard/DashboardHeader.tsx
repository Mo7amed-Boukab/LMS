"use client";

interface DashboardHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function DashboardHeader({
  title,
  description,
  action,
}: DashboardHeaderProps) {
  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-gray-100 flex-shrink-0 z-10">
      {/* Page Title */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {/* Optional Action Button */}
      {action && <div>{action}</div>}
    </header>
  );
}
