"use client";

import Link from "next/link";

interface SettingsSidebarProps {
  activePage: string;
}

export default function SettingsSidebar({ activePage }: SettingsSidebarProps) {
  const settingsLinks = [
    {
      id: "general",
      name: "General",
      href: "/dashboard/settings",
      icon: "⚙️",
    },
    {
      id: "security",
      name: "Security & Privacy",
      href: "/dashboard/settings/security",
      icon: "🔒",
    },
    {
      id: "notifications",
      name: "Notifications",
      href: "/dashboard/settings/notifications",
      icon: "🔔",
    },
    {
      id: "payment",
      name: "Payment Methods",
      href: "/dashboard/settings/payment",
      icon: "💳",
    },
    {
      id: "api",
      name: "API Access",
      href: "/dashboard/settings/api",
      icon: "⌨️",
    },
  ];
  
  return (
    <div className="neuro-card bg-dark-800 rounded-lg relative overflow-hidden">
      {/* Gradient accent line */}
      <div className="h-1 w-full bg-gradient-text absolute top-0 left-0"></div>
      
      <div className="p-4 relative z-10">
      <nav className="space-y-1">
        {settingsLinks.map((link) => {
          const isActive = activePage === link.id;
          return (
            <Link
              key={link.id}
              href={link.href}
                className={`flex items-center px-4 py-3 rounded-md transition-colors duration-300 ${
                isActive
                    ? "bg-gradient-to-r from-cyan-glow/20 to-magenta-glow/20 text-cyan-glow shadow-glow-blue neuro-button"
                    : "text-gray-300 hover:bg-dark-900/50 hover:text-white"
              }`}
            >
                <span className="text-xl mr-3">{link.icon}</span>
                <span className="text-sm font-medium">{link.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse"></span>
                )}
            </Link>
          );
        })}
      </nav>
      
        <div className="mt-8 pt-4 border-t border-dark-700">
        <Link
          href="/dashboard/profile"
            className="flex items-center px-4 py-3 rounded-md text-gray-300 hover:bg-dark-900/50 hover:text-cyan-glow transition-colors duration-300"
        >
            <span className="text-xl mr-3">👤</span>
            <span className="text-sm font-medium">Back to Profile</span>
        </Link>
        </div>
      </div>
    </div>
  );
} 