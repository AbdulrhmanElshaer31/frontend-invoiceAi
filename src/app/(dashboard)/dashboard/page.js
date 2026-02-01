"use client";

import { useEffect, useState } from "react";
import Dashboard from "@/actions/dashboard";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, FileText, Building2, Calculator } from "lucide-react";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await Dashboard();
        if (result.isSuccess) {
          setDashboardData(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Auto-hide error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state (when no data loaded)
  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-xl max-w-md shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  const stats = dashboardData?.InvoiceStatistics;
  const expenseTrend = dashboardData?.ExpenseTrend || [];
  const costCenterDist = dashboardData?.CostCenterDistribution || [];
  const expenseTypes = dashboardData?.SpendingByExpenseType || [];
  const recentExpenses = dashboardData?.RecentLargeExpenses || [];

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Format percentage
  const formatPercent = (value) => {
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  // Colors for charts - neutral and premium
  const CHART_COLORS = [
    "#1f2937",
    "#374151",
    "#4b5563",
    "#6b7280",
    "#9ca3af",
    "#d1d5db",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                {stats?.PeriodDescription || "Overview of your financial data"}
              </p>
            </div>
            <div className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-xs text-gray-500 font-medium">Period</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{stats?.PeriodDays || 0} Days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message with auto-hide */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Total Expenses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-gray-900 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${
                stats?.TotalExpensesChangePercent >= 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}>
                {stats?.TotalExpensesChangePercent >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {formatPercent(stats?.TotalExpensesChangePercent || 0)}
              </div>
            </div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Total Expenses
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats?.TotalExpenses || 0)}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Previous: {formatCurrency(stats?.PreviousPeriodExpenses || 0)}
            </p>
          </div>

          {/* Total Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-gray-900 rounded-lg">
                <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${
                stats?.TotalTransactionsChangePercent >= 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}>
                {stats?.TotalTransactionsChangePercent >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {formatPercent(stats?.TotalTransactionsChangePercent || 0)}
              </div>
            </div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Total Transactions
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.TotalTransactions || 0}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Previous: {stats?.PreviousPeriodTransactions || 0}
            </p>
          </div>

          {/* Active Cost Centers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-gray-900 rounded-lg">
                <Building2 className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${
                stats?.ActiveCostCentersChangePercent >= 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}>
                {stats?.ActiveCostCentersChangePercent >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {formatPercent(stats?.ActiveCostCentersChangePercent || 0)}
              </div>
            </div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Active Cost Centers
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.ActiveCostCenters || 0}
            </p>
            <p className="text-xs text-gray-400 mt-2">Centers in use</p>
          </div>

          {/* Average Per Transaction */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-gray-900 rounded-lg">
                <Calculator className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${
                stats?.AvgPerTransactionChangePercent >= 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}>
                {stats?.AvgPerTransactionChangePercent >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {formatPercent(stats?.AvgPerTransactionChangePercent || 0)}
              </div>
            </div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Avg Per Transaction
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats?.AveragePerTransaction || 0)}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Previous: {formatCurrency(stats?.PreviousPeriodAvgTransaction || 0)}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Expense Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-base font-bold text-gray-900 mb-5">
              Expense Trend
            </h3>
            {expenseTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={expenseTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis
                    dataKey="PeriodLabel"
                    stroke="#9ca3af"
                    style={{ fontSize: "11px", fontWeight: 500 }}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    style={{ fontSize: "11px", fontWeight: 500 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: "12px", fontWeight: 500 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="TotalExpenses"
                    stroke="#1f2937"
                    strokeWidth={2.5}
                    dot={{ fill: "#1f2937", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Total Expenses"
                  />
                  <Line
                    type="monotone"
                    dataKey="TransactionCount"
                    stroke="#9ca3af"
                    strokeWidth={2.5}
                    dot={{ fill: "#9ca3af", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Transactions"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-75 flex items-center justify-center text-gray-400">
                No expense data available
              </div>
            )}
          </div>

          {/* Cost Center Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-base font-bold text-gray-900 mb-5">
              Cost Center Distribution
            </h3>
            {costCenterDist.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costCenterDist}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => entry.name}
                    labelLine={false}
                  >
                    {costCenterDist.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: "12px", fontWeight: 500 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-75 flex items-center justify-center text-gray-400">
                No cost center data available
              </div>
            )}
          </div>
        </div>

        {/* Spending by Expense Type */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-base font-bold text-gray-900 mb-5">
            Spending by Expense Type
          </h3>
          {expenseTypes.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expenseTypes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="type"
                  stroke="#9ca3af"
                  style={{ fontSize: "11px", fontWeight: 500 }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  style={{ fontSize: "11px", fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: "12px", fontWeight: 500 }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#1f2937" 
                  name="Amount" 
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-75 flex items-center justify-center text-gray-400">
              No expense type data available
            </div>
          )}
        </div>

        {/* Recent Large Expenses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-base font-bold text-gray-900 mb-5">
            Recent Large Expenses
          </h3>
          {recentExpenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Cost Center
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentExpenses.map((expense, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {expense.date}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                        {expense.description}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {expense.costCenter}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right font-semibold">
                        {formatCurrency(expense.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400">
              No recent large expenses
            </div>
          )}
        </div>
      </div>
    </div>
  );
}