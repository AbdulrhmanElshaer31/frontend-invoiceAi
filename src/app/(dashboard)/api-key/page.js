"use client";

import { useEffect, useState } from "react";
import {
  getAllApiKeys,
  createApiKey,
  editApiKey,
  deletApiKey,
  restoreApiKey,
} from "@/actions/api-key";
import { Key, Plus, Edit2, Trash2, RotateCcw, Copy, X, Check } from "lucide-react";

export default function ApiKeyPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentKey, setCurrentKey] = useState(null);
  const [showDeletedKeys, setShowDeletedKeys] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    key: "",
    isRevoked: false,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch API Keys
  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      const result = await getAllApiKeys();
      if (result.isSuccess) {
        setApiKeys(result.data || []);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Auto-hide error message after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Open modal for creating
  const handleCreate = () => {
    setModalMode("create");
    setFormData({ key: "", isRevoked: false });
    setCurrentKey(null);
    setFormError("");
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (apiKey) => {
    setModalMode("edit");
    setFormData({
      key: apiKey.key,
      isRevoked: apiKey.isRevoked,
    });
    setCurrentKey(apiKey);
    setFormError("");
    setShowModal(true);
  };

  // Submit form (create or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      let result;
      if (modalMode === "create") {
        result = await createApiKey(formData.key);
      } else {
        result = await editApiKey(
          currentKey.id,
          formData.key,
          formData.isRevoked
        );
      }

      if (result.isSuccess) {
        setSuccessMessage(result.message);
        setShowModal(false);
        fetchApiKeys();
      } else {
        setFormError(result.message);
      }
    } catch (err) {
      setFormError("An error occurred");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete API Key
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this API key?")) return;

    setLoading(true);
    const result = await deletApiKey(id);
    if (result.isSuccess) {
      setSuccessMessage(result.message);
      fetchApiKeys();
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  // Restore API Key
  const handleRestore = async (id) => {
    setLoading(true);
    const result = await restoreApiKey(id);
    if (result.isSuccess) {
      setSuccessMessage(result.message);
      fetchApiKeys();
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  // Copy to clipboard
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter keys based on deleted status
  const filteredKeys = apiKeys.filter((key) =>
    showDeletedKeys ? key.isDeleted : !key.isDeleted
  );

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && apiKeys.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading API Keys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">API Keys</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your API keys for external integrations
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm"
            >
              <Plus size={18} strokeWidth={2.5} />
              Create New Key
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
            <button
              onClick={() => setSuccessMessage("")}
              className="text-emerald-400 hover:text-emerald-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Error Message */}
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
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Toggle Deleted Keys */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setShowDeletedKeys(!showDeletedKeys)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showDeletedKeys
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {showDeletedKeys ? "Show Active Keys" : "Show Deleted Keys"}
          </button>
          <span className="text-sm text-gray-500 font-medium">
            {filteredKeys.length} {filteredKeys.length === 1 ? "key" : "keys"}
          </span>
        </div>

        {/* API Keys Grid */}
        {filteredKeys.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
              <Key className="w-8 h-8 text-gray-400" strokeWidth={2} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              No API Keys Found
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {showDeletedKeys
                ? "No deleted API keys"
                : "Create your first API key to get started"}
            </p>
            {!showDeletedKeys && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Plus size={16} strokeWidth={2.5} />
                Create API Key
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-2 break-all">
                      {apiKey.key}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-md font-semibold ${
                          apiKey.isRevoked
                            ? "bg-red-50 text-red-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {apiKey.isRevoked ? "Revoked" : "Active"}
                      </span>
                      {apiKey.isDeleted && (
                        <span className="text-xs px-2 py-1 rounded-md font-semibold bg-gray-100 text-gray-600">
                          Deleted
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Key ID */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Key ID</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-900 font-mono truncate">
                      {apiKey.id}
                    </p>
                    <button
                      onClick={() => copyToClipboard(apiKey.id, apiKey.id)}
                      className="text-gray-400 hover:text-gray-900 transition-colors shrink-0"
                      title="Copy Key ID"
                    >
                      {copiedId === apiKey.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Created {formatDate(apiKey.createdDate)}</span>
                  </div>
                  {apiKey.modifiedDate && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span>Modified {formatDate(apiKey.modifiedDate)}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  {!apiKey.isDeleted ? (
                    <>
                      <button
                        onClick={() => handleEdit(apiKey)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                      >
                        <Edit2 size={14} strokeWidth={2.5} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(apiKey.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={14} strokeWidth={2.5} />
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleRestore(apiKey.id)}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                    >
                      <RotateCcw size={14} strokeWidth={2.5} />
                      Restore
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === "create" ? "Create New API Key" : "Edit API Key"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.key}
                  onChange={(e) =>
                    setFormData({ ...formData, key: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                  placeholder="Enter key name"
                />
              </div>

              {modalMode === "edit" && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="isRevoked"
                    checked={formData.isRevoked}
                    onChange={(e) =>
                      setFormData({ ...formData, isRevoked: e.target.checked })
                    }
                    className="w-4 h-4 text-gray-900 bg-white border-gray-300 rounded focus:ring-gray-900 focus:ring-2"
                  />
                  <label
                    htmlFor="isRevoked"
                    className="text-sm font-medium text-gray-900"
                  >
                    Revoke this API key
                  </label>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-900 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-gray-900 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading
                    ? "Saving..."
                    : modalMode === "create"
                    ? "Create"
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}