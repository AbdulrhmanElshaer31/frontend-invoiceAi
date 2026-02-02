"use client";

import { useEffect, useState } from "react";
import { getAllInvoices, getAllFiles, uploadInvoice } from "@/actions/invoices";
import { getAllCostCenter } from "@/actions/cost-center";
import { getAllExpenseTypes } from "@/actions/expense-type";
import {
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  X,
  Check,
  Loader2,
} from "lucide-react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [files, setFiles] = useState([]);
  const [costCenters, setCostCenters] = useState([]);
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [selectedCostCenter, setSelectedCostCenter] = useState("");
  const [selectedExpenseType, setSelectedExpenseType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invoicesResult, filesResult, centersResult] = await Promise.all([
        getAllInvoices(),
        getAllFiles(),
        getAllCostCenter(true, 1, 100),
      ]);

      if (invoicesResult.isSuccess) setInvoices(invoicesResult.data || []);
      if (filesResult.isSuccess) setFiles(filesResult.data || []);
      if (centersResult.isSuccess) {
        const active = centersResult.data.filter((c) => !c.isDeleted);
        setCostCenters(active);
        if (active.length > 0) setSelectedCostCenter(active[0].Id);
      }
    } catch (err) {
      setError("Failed to load data");
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
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    if (!selectedCostCenter || !selectedExpenseType) {
      setError("Please select cost center and expense type");
      return;
    }

    setIsUploading(true);
    const progressData = selectedFiles.map((file) => ({
      name: file.name,
      status: "uploading",
      progress: 0,
    }));
    setUploadProgress(progressData);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      try {
        // Update progress
        setUploadProgress((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: "uploading", progress: 50 } : item
          )
        );

        const result = await uploadInvoice(
          file,
          false,
          selectedCostCenter,
          selectedExpenseType,
          true
        );

        if (result) {
          setUploadProgress((prev) =>
            prev.map((item, idx) =>
              idx === i ? { ...item, status: "success", progress: 100 } : item
            )
          );
        } else {
          setUploadProgress((prev) =>
            prev.map((item, idx) =>
              idx === i ? { ...item, status: "error", progress: 0 } : item
            )
          );
        }
      } catch (err) {
        setUploadProgress((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: "error", progress: 0 } : item
          )
        );
      }
    }

    setIsUploading(false);
    setSuccessMessage("Files uploaded successfully");
    fetchData();

    // Clear progress after 3 seconds
    setTimeout(() => setUploadProgress([]), 3000);
  };

  const getFileStatus = (status) => {
    const statuses = {
      0: { label: "Pending", color: "bg-gray-100 text-gray-700" },
      1: { label: "Processing", color: "bg-blue-100 text-blue-700" },
      2: { label: "Completed", color: "bg-emerald-100 text-emerald-700" },
      3: { label: "Failed", color: "bg-red-100 text-red-700" },
    };
    return statuses[status] || statuses[0];
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

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
          <p className="mt-4 text-gray-600 font-medium">Loading Invoices...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-sm text-gray-500 mt-1">Upload and manage your invoices</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              {successMessage}
            </div>
            <button onClick={() => setSuccessMessage("")} className="text-emerald-400 hover:text-emerald-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Invoices</h2>

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

          <label className="block w-full cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>

          {/* Upload Progress */}
          {uploadProgress.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadProgress.map((file, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          file.status === "success"
                            ? "bg-emerald-600"
                            : file.status === "error"
                            ? "bg-red-600"
                            : "bg-blue-600"
                        }`}
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  </div>
                  {file.status === "uploading" && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
                  {file.status === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {file.status === "error" && <XCircle className="w-5 h-5 text-red-600" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Files Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Uploaded Files</h2>
          {files.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-500">No files uploaded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">File Name</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">File ID</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => {
                    const status = getFileStatus(file.status);
                    return (
                      <tr key={file.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">{file.fileName}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-md font-semibold ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500 font-mono">{file.id.slice(0, 20)}...</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Processed Invoices</h2>
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-500">No processed invoices yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Company</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Subtotal</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Tax</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-500">{formatDate(invoice.invoiceDate)}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">{invoice.companyName}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{formatCurrency(invoice.subtotal)}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{formatCurrency(invoice.totalTax)}</td>
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
