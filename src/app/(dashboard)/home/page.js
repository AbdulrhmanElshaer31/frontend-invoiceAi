"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllInvoices, uploadInvoice } from "@/actions/invoices";
import Dashboard from "@/actions/dashboard";
import { getAllCostCenter } from "@/actions/cost-center";
import { getAllExpenseTypes } from "@/actions/expense-type";
import {
  Upload,
  FileText,
  DollarSign,
  TrendingUp,
  Building2,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [costCenters, setCostCenters] = useState([]);
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [selectedCostCenter, setSelectedCostCenter] = useState("");
  const [selectedExpenseType, setSelectedExpenseType] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ show: false, status: "", message: "" });
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashResult, invoicesResult, centersResult] = await Promise.all([
        Dashboard(),
        getAllInvoices(),
        getAllCostCenter(true, 1, 100),
      ]);

      if (dashResult.isSuccess) {
        setStats(dashResult.data?.InvoiceStatistics);
      }

      if (invoicesResult.isSuccess) {
        const recent = (invoicesResult.data || [])
          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
          .slice(0, 5);
        setRecentInvoices(recent);
      }

      if (centersResult.isSuccess) {
        const active = centersResult.data.filter((c) => !c.isDeleted);
        setCostCenters(active);
        if (active.length > 0) {
          setSelectedCostCenter(active[0].Id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenseTypes = async (costCenterId) => {
    if (!costCenterId) return;
    try {
      const result = await getAllExpenseTypes(true, 1, 100, costCenterId);
      if (result.isSuccess) {
        const types = result.data || [];
        setExpenseTypes(types);
        if (types.length > 0) setSelectedExpenseType(types[0].Id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCostCenter) {
      fetchExpenseTypes(selectedCostCenter);
    }
  }, [selectedCostCenter]);

  useEffect(() => {
    if (uploadStatus.show) {
      const timer = setTimeout(() => setUploadStatus({ show: false, status: "", message: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadStatus.show]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFileUpload(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);
  };

  const handleFileUpload = async (files) => {
    if (files.length === 0) return;

    if (!selectedCostCenter || !selectedExpenseType) {
      setUploadStatus({
        show: true,
        status: "error",
        message: "Please select cost center and expense type",
      });
      return;
    }

    setIsUploading(true);

    for (const file of files) {
      try {
        const result = await uploadInvoice(
          file,
          false,
          selectedCostCenter,
          selectedExpenseType,
          true
        );

        if (result) {
          setUploadStatus({
            show: true,
            status: "success",
            message: `${file.name} uploaded successfully`,
          });
        } else {
          setUploadStatus({
            show: true,
            status: "error",
            message: `Failed to upload ${file.name}`,
          });
        }
      } catch (err) {
        setUploadStatus({
          show: true,
          status: "error",
          message: `Error uploading ${file.name}`,
        });
      }
    }

    setIsUploading(false);
    fetchData();
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
          <p className="mt-4 text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
            <p className="text-sm text-gray-500 mt-1">Here's what's happening with your invoices</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Status */}
        {uploadStatus.show && (
          <div
            className={`mb-6 px-4 py-3 rounded-xl flex items-center gap-2 shadow-sm ${
              uploadStatus.status === "success"
                ? "bg-emerald-50 border border-emerald-100 text-emerald-700"
                : "bg-red-50 border border-red-100 text-red-700"
            }`}
          >
            {uploadStatus.status === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            {uploadStatus.message}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-gray-900 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Total Expenses
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats?.TotalExpenses || 0)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-gray-900 rounded-lg">
                <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Total Invoices
            </h3>
            <p className="text-2xl font-bold text-gray-900">{stats?.TotalTransactions || 0}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-gray-900 rounded-lg">
                <Building2 className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Cost Centers
            </h3>
            <p className="text-2xl font-bold text-gray-900">{stats?.ActiveCostCenters || 0}</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Upload</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Cost Center</label>
              <select
                value={selectedCostCenter}
                onChange={(e) => setSelectedCostCenter(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
              >
                {costCenters.map((center) => (
                  <option key={center.Id} value={center.Id}>
                    {center.Name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Expense Type</label>
              <select
                value={selectedExpenseType}
                onChange={(e) => setSelectedExpenseType(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
              >
                {expenseTypes.map((type) => (
                  <option key={type.Id} value={type.Id}>
                    {type.Name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              isDragging
                ? "border-gray-900 bg-gray-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-gray-900 animate-spin mb-4" />
                <p className="text-sm font-medium text-gray-900">Uploading...</p>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Drag and drop files here
                </p>
                <p className="text-xs text-gray-500 mb-4">or</p>
                <label className="inline-block">
                  <span className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all cursor-pointer">
                    Browse Files
                  </span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-4">PDF, PNG, JPG up to 10MB</p>
              </>
            )}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Invoices</h2>
            <button
              onClick={() => router.push("/invoices")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              View All →
            </button>
          </div>

          {recentInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-500">No invoices yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Company</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-500">{formatDate(invoice.invoiceDate)}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">{invoice.companyName}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-semibold text-right">
                        {formatCurrency(invoice.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
