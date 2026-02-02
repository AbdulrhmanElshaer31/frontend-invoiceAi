"use client";

import { useEffect, useState } from "react";
import {
  getAllCostCenter
} from "@/actions/cost-center";
import {
  getAllExpenseTypes,
  createExpenseType,
  updateExpenseType,
  deleteExpenseType,
} from "@/actions/expense-type";
import { DollarSign, Plus, Edit2, Trash2, X, Check, Building2 } from "lucide-react";

export default function ExpenseTypePage() {
  const [costCenters, setCostCenters] = useState([]);
  const [selectedCostCenter, setSelectedCostCenter] = useState("");
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentExpenseType, setCurrentExpenseType] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch Cost Centers
  const fetchCostCenters = async () => {
    try {
      const result = await getAllCostCenter(true, 1, 100);
      if (result.isSuccess) {
        const activeCenters = result.data.filter(c => !c.isDeleted);
        setCostCenters(activeCenters);
        if (activeCenters.length > 0) {
          setSelectedCostCenter(activeCenters[0].Id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Expense Types
  const fetchExpenseTypes = async (costCenterId) => {
    if (!costCenterId) return;
    setLoading(true);
    try {
      const result = await getAllExpenseTypes(true, 1, 100, costCenterId);
      if (result.isSuccess) {
        setExpenseTypes(result.data || []);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to load expense types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCostCenters();
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

  const handleCreate = () => {
    setModalMode("create");
    setFormData({ name: "" });
    setCurrentExpenseType(null);
    setFormError("");
    setShowModal(true);
  };

  const handleEdit = (expenseType) => {
    setModalMode("edit");
    setFormData({ name: expenseType.Name });
    setCurrentExpenseType(expenseType);
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      let result;
      if (modalMode === "create") {
        result = await createExpenseType(selectedCostCenter, formData.name);
      } else {
        result = await updateExpenseType(
          selectedCostCenter,
          currentExpenseType.Id,
          formData.name
        );
      }

      if (result.isSuccess) {
        setSuccessMessage(result.message);
        setShowModal(false);
        fetchExpenseTypes(selectedCostCenter);
      } else {
        setFormError(result.message);
      }
    } catch (err) {
      setFormError("An error occurred");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this expense type?")) return;
    setLoading(true);
    const result = await deleteExpenseType(selectedCostCenter, id);
    if (result.isSuccess) {
      setSuccessMessage(result.message);
      fetchExpenseTypes(selectedCostCenter);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const filteredExpenseTypes = expenseTypes.filter((type) => !type.isDeleted);

  if (costCenters.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Cost Centers Available</h3>
          <p className="text-sm text-gray-500">Create a cost center first before adding expense types.</p>
        </div>
      </div>
    );
  }

  if (loading && expenseTypes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
          <p className="mt-4 text-gray-600 font-medium">Loading Expense Types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Expense Types</h1>
              <p className="text-sm text-gray-500 mt-1">Manage expense types for cost centers</p>
            </div>
            <button
              onClick={handleCreate}
              disabled={!selectedCostCenter}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} strokeWidth={2.5} />
              Create Expense Type
            </button>
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

        {/* Cost Center Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Select Cost Center</label>
          <select
            value={selectedCostCenter}
            onChange={(e) => setSelectedCostCenter(e.target.value)}
            className="w-full max-w-md px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
          >
            {costCenters.map((center) => (
              <option key={center.Id} value={center.Id}>
                {center.Name}
              </option>
            ))}
          </select>
        </div>

        {/* Expense Types Grid */}
        {filteredExpenseTypes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
              <DollarSign className="w-8 h-8 text-gray-400" strokeWidth={2} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">No Expense Types</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first expense type</p>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all"
            >
              <Plus size={16} strokeWidth={2.5} />
              Create Expense Type
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExpenseTypes.map((expenseType) => (
              <div
                key={expenseType.Id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-2">{expenseType.Name}</h3>
                  </div>
                  <DollarSign className="w-5 h-5 text-gray-400" strokeWidth={2} />
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium">ID: {expenseType.Id.slice(0, 13)}...</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(expenseType)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all"
                  >
                    <Edit2 size={14} strokeWidth={2.5} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expenseType.Id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={14} strokeWidth={2.5} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === "create" ? "Create Expense Type" : "Edit Expense Type"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                  placeholder="Enter name"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-900 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-gray-900 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                  {formLoading ? "Saving..." : modalMode === "create" ? "Create" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
