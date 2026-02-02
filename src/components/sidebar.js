"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logout } from "@/actions/auth";
import {
  Home,
  LayoutDashboard,
  Building2,
  DollarSign,
  Key,
  User,
  LogOut,
  Menu,
  X,
  FileChartColumnIncreasing,
  FileSpreadsheet
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Home", icon: Home, path: "/home" },
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Invoices", icon: FileChartColumnIncreasing, path: "/invoices" },
    {name : "Invoice Generator" , icon: FileSpreadsheet , path: "/invoice-generator"},
    { name: "Cost Center", icon: Building2, path: "/cost-center" },
    { name: "Expense Type", icon: DollarSign, path: "/expense-type" },
    { name: "Api Key", icon: Key, path: "/api-key" },
  ];

  const isActive = (path) => pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {isMobileMenuOpen ? (
          <X size={24} className="text-gray-900" />
        ) : (
          <Menu size={24} className="text-gray-900" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-40 transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-linear-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center shadow-sm">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-gray-900 font-bold text-base leading-tight tracking-tight">
                Wize-InvoiceAI
              </h1>
            </div>
          </div>
          <p className="text-gray-500 text-[11px] pl-12 leading-tight">
            Invoice management simplified
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`shrink-0 transition-transform duration-200 ${
                      active ? "scale-100" : "group-hover:scale-105"
                    }`}
                    size={18}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span
                    className={`font-medium text-sm ${
                      active ? "font-semibold" : ""
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
                {active && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-gray-100">
          {/* User Info */}
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-lg bg-gray-50">
            <div className="w-8 h-8 bg-linear-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <User size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-semibold text-xs truncate">
                Abdelrhman Elshaer
              </p>
              <p className="text-gray-500 text-[11px] truncate">Admin</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={async () => await Logout()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group">
            <LogOut
              size={18}
              className="shrink-0 group-hover:scale-105 transition-transform"
              strokeWidth={2}
            />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden lg:block w-64 shrink-0"></div>
    </>
  );
}