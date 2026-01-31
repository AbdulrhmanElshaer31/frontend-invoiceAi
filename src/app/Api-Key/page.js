"use client";

import { useEffect, useState } from "react";
import {
  getAllApiKeys,
  createApiKey,
  editApiKey,
  deletApiKey,
  restoreApiKey,
} from "@/actions/apiKey";

export default function ApiKeyPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create or edit
  const [currentKey, setCurrentKey] = useState(null);
  const [showDeletedKeys, setShowDeletedKeys] = useState(false);

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
        setTimeout(() => setSuccessMessage(""), 3000);
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
      setTimeout(() => setSuccessMessage(""), 3000);
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
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccessMessage("API Key copied to clipboard!");
    setTimeout(() => setSuccessMessage(""), 2000);
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
      <div className="min-h-screen bg-[#EAEFEF] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#141C22]"></div>
          <p className="mt-4 text-[#141C22] font-medium">Loading API Keys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAEFEF]">
      {/* Header */}
      <div className="bbg-linear-to-br from-[#141C22] via-[#1a2730] to-[#0f161c] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">API Keys</h1>
              <p className="text-gray-300">
                Manage your API keys for external integrations
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl px-6 py-3 font-medium transition-all duration-200 flex items-center gap-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Key
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center gap-2">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Toggle Deleted Keys */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => setShowDeletedKeys(!showDeletedKeys)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              showDeletedKeys
                ? "bg-[#141C22] text-white"
                : "bg-white text-[#141C22] border border-gray-200"
            }`}
          >
            {showDeletedKeys ? "Show Active Keys" : "Show Deleted Keys"}
          </button>
          <span className="text-[#BFC9D1] text-sm">
            Total: {filteredKeys.length} keys
          </span>
        </div>

        {/* API Keys Grid */}
        {filteredKeys.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#EAEFEF] rounded-full mb-4">
              <svg
                className="w-8 h-8 text-[#BFC9D1]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#141C22] mb-2">
              No API Keys Found
            </h3>
            <p className="text-[#BFC9D1] mb-4">
              {showDeletedKeys
                ? "No deleted API keys"
                : "Create your first API key to get started"}
            </p>
            {!showDeletedKeys && (
              <button
                onClick={handleCreate}
                className="bg-[#141C22] text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200"
              >
                Create API Key
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#141C22] mb-1 break-all">
                      {apiKey.key}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          apiKey.isRevoked
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {apiKey.isRevoked ? "Revoked" : "Active"}
                      </span>
                      {apiKey.isDeleted && (
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-600">
                          Deleted
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Key ID */}
                <div className="mb-4 p-3 bg-[#EAEFEF] rounded-lg">
                  <p className="text-xs text-[#BFC9D1] mb-1">Key ID</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-[#141C22] font-mono truncate">
                      {apiKey.id}
                    </p>
                    <button
                      onClick={() => copyToClipboard(apiKey.id)}
                      className="text-[#141C22] hover:text-[#BFC9D1] transition-colors"
                      title="Copy Key ID"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-[#BFC9D1]">
                    <svg
                      className="w-4 h-4"
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
                    <span>Created: {formatDate(apiKey.createdDate)}</span>
                  </div>
                  {apiKey.modifiedDate && (
                    <div className="flex items-center gap-2 text-xs text-[#BFC9D1]">
                      <svg
                        className="w-4 h-4"
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
                      <span>Modified: {formatDate(apiKey.modifiedDate)}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  {!apiKey.isDeleted ? (
                    <>
                      <button
                        onClick={() => handleEdit(apiKey)}
                        className="flex-1 bg-[#141C22] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
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
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(apiKey.id)}
                        className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleRestore(apiKey.id)}
                      className="w-full bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#141C22]">
                {modalMode === "create" ? "Create New API Key" : "Edit API Key"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#BFC9D1] hover:text-[#141C22] transition-colors"
              >
                <svg
                  className="w-6 h-6"
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#141C22] mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.key}
                  onChange={(e) =>
                    setFormData({ ...formData, key: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#EAEFEF] border border-[#BFC9D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141C22] focus:border-transparent text-[#141C22]"
                  placeholder="Enter key name"
                />
              </div>

              {modalMode === "edit" && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isRevoked"
                    checked={formData.isRevoked}
                    onChange={(e) =>
                      setFormData({ ...formData, isRevoked: e.target.checked })
                    }
                    className="w-5 h-5 text-[#141C22] bg-[#EAEFEF] border-[#BFC9D1] rounded focus:ring-[#141C22] focus:ring-2"
                  />
                  <label
                    htmlFor="isRevoked"
                    className="text-sm font-medium text-[#141C22]"
                  >
                    Revoke this API key
                  </label>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-[#141C22] px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-[#141C22] text-white px-4 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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