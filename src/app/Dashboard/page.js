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

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAEFEF] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#141C22]"></div>
          <p className="mt-4 text-[#141C22] font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#EAEFEF] flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg max-w-md">
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

  // Colors for charts
  const CHART_COLORS = [
    "#141C22",
    "#2c3e50",
    "#34495e",
    "#5d6d7e",
    "#7f8c8d",
    "#95a5a6",
  ];

  return (
    <div className="min-h-screen bg-[#EAEFEF]">
      {/* Header */}
      <div className="bg-linear-to-brrom-[#141C22] via-[#1a2730] to-[#0f161c] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-gray-300">
                {stats?.PeriodDescription || "Overview"}
              </p>
            </div>
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-3">
              <p className="text-sm text-gray-300">Period</p>
              <p className="text-xl font-bold">{stats?.PeriodDays || 0} Days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Expenses */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#141C22] rounded-xl">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span
                className={`text-sm font-semibold px-2 py-1 rounded-lg ${
                  stats?.TotalExpensesChangePercent >= 0
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {formatPercent(stats?.TotalExpensesChangePercent || 0)}
              </span>
            </div>
            <h3 className="text-[#BFC9D1] text-sm font-medium mb-1">
              Total Expenses
            </h3>
            <p className="text-2xl font-bold text-[#141C22]">
              {formatCurrency(stats?.TotalExpenses || 0)}
            </p>
            <p className="text-xs text-[#BFC9D1] mt-2">
              Previous: {formatCurrency(stats?.PreviousPeriodExpenses || 0)}
            </p>
          </div>

          {/* Total Transactions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#141C22] rounded-xl">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <span
                className={`text-sm font-semibold px-2 py-1 rounded-lg ${
                  stats?.TotalTransactionsChangePercent >= 0
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {formatPercent(stats?.TotalTransactionsChangePercent || 0)}
              </span>
            </div>
            <h3 className="text-[#BFC9D1] text-sm font-medium mb-1">
              Total Transactions
            </h3>
            <p className="text-2xl font-bold text-[#141C22]">
              {stats?.TotalTransactions || 0}
            </p>
            <p className="text-xs text-[#BFC9D1] mt-2">
              Previous: {stats?.PreviousPeriodTransactions || 0}
            </p>
          </div>

          {/* Active Cost Centers */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#141C22] rounded-xl">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <span
                className={`text-sm font-semibold px-2 py-1 rounded-lg ${
                  stats?.ActiveCostCentersChangePercent >= 0
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {formatPercent(stats?.ActiveCostCentersChangePercent || 0)}
              </span>
            </div>
            <h3 className="text-[#BFC9D1] text-sm font-medium mb-1">
              Active Cost Centers
            </h3>
            <p className="text-2xl font-bold text-[#141C22]">
              {stats?.ActiveCostCenters || 0}
            </p>
            <p className="text-xs text-[#BFC9D1] mt-2">Centers in use</p>
          </div>

          {/* Average Per Transaction */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#141C22] rounded-xl">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span
                className={`text-sm font-semibold px-2 py-1 rounded-lg ${
                  stats?.AvgPerTransactionChangePercent >= 0
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {formatPercent(stats?.AvgPerTransactionChangePercent || 0)}
              </span>
            </div>
            <h3 className="text-[#BFC9D1] text-sm font-medium mb-1">
              Avg Per Transaction
            </h3>
            <p className="text-2xl font-bold text-[#141C22]">
              {formatCurrency(stats?.AveragePerTransaction || 0)}
            </p>
            <p className="text-xs text-[#BFC9D1] mt-2">
              Previous: {formatCurrency(stats?.PreviousPeriodAvgTransaction || 0)}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Expense Trend Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-[#141C22] mb-4">
              Expense Trend
            </h3>
            {expenseTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={expenseTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#BFC9D1" />
                  <XAxis
                    dataKey="PeriodLabel"
                    stroke="#BFC9D1"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#BFC9D1" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #BFC9D1",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="TotalExpenses"
                    stroke="#141C22"
                    strokeWidth={2}
                    dot={{ fill: "#141C22" }}
                    name="Total Expenses"
                  />
                  <Line
                    type="monotone"
                    dataKey="TransactionCount"
                    stroke="#BFC9D1"
                    strokeWidth={2}
                    dot={{ fill: "#BFC9D1" }}
                    name="Transactions"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-75 flex items-center justify-center text-[#BFC9D1]">
                No expense data available
              </div>
            )}
          </div>

          {/* Cost Center Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-[#141C22] mb-4">
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
                    label
                  >
                    {costCenterDist.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-75 flex items-center justify-center text-[#BFC9D1]">
                No cost center data available
              </div>
            )}
          </div>
        </div>

        {/* Spending by Expense Type */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-bold text-[#141C22] mb-4">
            Spending by Expense Type
          </h3>
          {expenseTypes.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expenseTypes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#BFC9D1" />
                <XAxis
                  dataKey="type"
                  stroke="#BFC9D1"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#BFC9D1" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #BFC9D1",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="amount" fill="#141C22" name="Amount" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-75 flex items-center justify-center text-[#BFC9D1]">
              No expense type data available
            </div>
          )}
        </div>

        {/* Recent Large Expenses */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-[#141C22] mb-4">
            Recent Large Expenses
          </h3>
          {recentExpenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#141C22]">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#141C22]">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#141C22]">
                      Cost Center
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[#141C22]">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentExpenses.map((expense, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-[#EAEFEF] transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-[#BFC9D1]">
                        {expense.date}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#141C22]">
                        {expense.description}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#BFC9D1]">
                        {expense.costCenter}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#141C22] text-right font-semibold">
                        {formatCurrency(expense.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-[#BFC9D1]">
              No recent large expenses
            </div>
          )}
        </div>
      </div>
    </div>
  );
}