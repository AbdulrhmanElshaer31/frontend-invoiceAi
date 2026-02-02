"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Download, Save, Eye, X } from "lucide-react";

export default function InvoiceGeneratorPage() {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    clientName: "",
    clientAddress: "",
    clientEmail: "",
    clientPhone: "",
    items: [{ description: "", quantity: 1, price: 0 }],
    notes: "",
    taxRate: 0,
  });

  const [savedInvoices, setSavedInvoices] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("wize_invoices");
    if (saved) {
      setSavedInvoices(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: "", quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index][field] = field === "description" ? value : Number(value);
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * invoiceData.taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const saveToLocalStorage = () => {
    const invoice = {
      ...invoiceData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
    };

    const updated = [...savedInvoices, invoice];
    localStorage.setItem("wize_invoices", JSON.stringify(updated));
    setSavedInvoices(updated);
    setSuccessMessage("Invoice saved successfully!");
  };

  const generatePDF = async () => {
    try {
      // Dynamically import jsPDF and autoTable
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Title
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", 20, 20);

      // Invoice Details
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice #: ${invoiceData.invoiceNumber || "Draft"}`, 20, 35);
      doc.text(`Date: ${invoiceData.invoiceDate}`, 20, 42);
      doc.text(`Due Date: ${invoiceData.dueDate || "N/A"}`, 20, 49);

      // Company Info (Right aligned)
      doc.setFont("helvetica", "bold");
      doc.text(invoiceData.companyName || "", pageWidth - 20, 35, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.text(invoiceData.companyAddress || "", pageWidth - 20, 42, { align: "right" });
      doc.text(invoiceData.companyEmail || "", pageWidth - 20, 49, { align: "right" });
      doc.text(invoiceData.companyPhone || "", pageWidth - 20, 56, { align: "right" });

      // Bill To
      doc.setFont("helvetica", "bold");
      doc.text("Bill To:", 20, 70);
      doc.setFont("helvetica", "normal");
      doc.text(invoiceData.clientName || "", 20, 77);
      doc.text(invoiceData.clientAddress || "", 20, 84);
      doc.text(invoiceData.clientEmail || "", 20, 91);
      doc.text(invoiceData.clientPhone || "", 20, 98);

      // Items Table
      const tableData = invoiceData.items.map((item) => [
        item.description,
        item.quantity.toString(),
        `$${item.price.toFixed(2)}`,
        `$${(item.quantity * item.price).toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: 110,
        head: [["Description", "Quantity", "Price", "Amount"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [31, 41, 55],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 10,
        },
        columnStyles: {
          1: { halign: "center" },
          2: { halign: "right" },
          3: { halign: "right" },
        },
      });

      // Totals
      const finalY = doc.lastAutoTable.finalY + 10;
      const totalsX = pageWidth - 70;

      doc.text("Subtotal:", totalsX, finalY);
      doc.text(`$${calculateSubtotal().toFixed(2)}`, pageWidth - 20, finalY, { align: "right" });

      doc.text(`Tax (${invoiceData.taxRate}%):`, totalsX, finalY + 7);
      doc.text(`$${calculateTax().toFixed(2)}`, pageWidth - 20, finalY + 7, { align: "right" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Total:", totalsX, finalY + 17);
      doc.text(`$${calculateTotal().toFixed(2)}`, pageWidth - 20, finalY + 17, { align: "right" });

      // Notes
      if (invoiceData.notes) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Notes:", 20, finalY + 35);
        const splitNotes = doc.splitTextToSize(invoiceData.notes, pageWidth - 40);
        doc.text(splitNotes, 20, finalY + 42);
      }

      // Save PDF
      const fileName = `invoice_${invoiceData.invoiceNumber || "draft"}_${invoiceData.invoiceDate}.pdf`;
      doc.save(fileName);

      setSuccessMessage("Invoice PDF downloaded successfully!");
      saveToLocalStorage();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const loadInvoice = (invoice) => {
    setInvoiceData({
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      companyName: invoice.companyName,
      companyAddress: invoice.companyAddress,
      companyEmail: invoice.companyEmail,
      companyPhone: invoice.companyPhone,
      clientName: invoice.clientName,
      clientAddress: invoice.clientAddress,
      clientEmail: invoice.clientEmail,
      clientPhone: invoice.clientPhone,
      items: invoice.items,
      notes: invoice.notes,
      taxRate: invoice.taxRate,
    });
    setSuccessMessage("Invoice loaded!");
  };

  const deleteInvoice = (id) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    const updated = savedInvoices.filter((inv) => inv.id !== id);
    localStorage.setItem("wize_invoices", JSON.stringify(updated));
    setSavedInvoices(updated);
    setSuccessMessage("Invoice deleted!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Invoice Generator</h1>
              <p className="text-sm text-gray-500 mt-1">Create professional invoices instantly</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                <Eye size={18} />
                Preview
              </button>
              <button
                onClick={saveToLocalStorage}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                <Save size={18} />
                Save
              </button>
              <button
                onClick={generatePDF}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all shadow-sm"
              >
                <Download size={18} strokeWidth={2.5} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage("")} className="text-emerald-400 hover:text-emerald-600">
              <X size={18} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Invoice Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                    placeholder="INV-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Invoice Date</label>
                  <input
                    type="date"
                    value={invoiceData.invoiceDate}
                    onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">From (Your Company)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={invoiceData.companyName}
                    onChange={(e) => setInvoiceData({ ...invoiceData, companyName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    value={invoiceData.companyEmail}
                    onChange={(e) => setInvoiceData({ ...invoiceData, companyEmail: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                    placeholder="company@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Address</label>
                  <input
                    type="text"
                    value={invoiceData.companyAddress}
                    onChange={(e) => setInvoiceData({ ...invoiceData, companyAddress: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                    placeholder="123 Street, City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={invoiceData.companyPhone}
                    onChange={(e) => setInvoiceData({ ...invoiceData, companyPhone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Bill To (Client)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Client Name</label>
                  <input
                    type="text"
                    value={invoiceData.clientName}
                    onChange={(e) => setInvoiceData({ ...invoiceData, clientName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                    placeholder="Client Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    value={invoiceData.clientEmail}
                    onChange={(e) => setInvoiceData({ ...invoiceData, clientEmail: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                    placeholder="client@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Address</label>
                  <input
                    type="text"
                    value={invoiceData.clientAddress}
                    onChange={(e) => setInvoiceData({ ...invoiceData, clientAddress: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                    placeholder="456 Avenue, City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={invoiceData.clientPhone}
                    onChange={(e) => setInvoiceData({ ...invoiceData, clientPhone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Items</h2>
                <button
                  onClick={addItem}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>

              <div className="space-y-3">
                {invoiceData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-start">
                    <div className="col-span-6">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                        min="1"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(index, "price", e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <button
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={invoiceData.items.length === 1}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-4 mb-3">
                  <label className="text-sm font-semibold text-gray-900">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={invoiceData.taxRate}
                    onChange={(e) => setInvoiceData({ ...invoiceData, taxRate: Number(e.target.value) })}
                    className="w-24 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="space-y-2 text-right">
                  <div className="flex justify-end gap-4">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="text-sm font-semibold text-gray-900 w-32">
                      ${calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-end gap-4">
                    <span className="text-sm text-gray-600">Tax ({invoiceData.taxRate}%):</span>
                    <span className="text-sm font-semibold text-gray-900 w-32">
                      ${calculateTax().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-end gap-4 pt-2 border-t border-gray-200">
                    <span className="text-base font-bold text-gray-900">Total:</span>
                    <span className="text-base font-bold text-gray-900 w-32">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Notes</h2>
              <textarea
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 resize-none"
                rows="4"
                placeholder="Additional notes or payment terms..."
              />
            </div>
          </div>

          {/* Saved Invoices Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Saved Invoices</h2>

              {savedInvoices.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No saved invoices yet</p>
              ) : (
                <div className="space-y-3 max-h-150 overflow-y-auto">
                  {savedInvoices.slice().reverse().map((invoice) => (
                    <div
                      key={invoice.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">
                            {invoice.invoiceNumber || "Draft"}
                          </p>
                          <p className="text-xs text-gray-500">{invoice.invoiceDate}</p>
                        </div>
                        <button
                          onClick={() => deleteInvoice(invoice.id)}
                          className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-600">{invoice.clientName}</span>
                        <span className="text-sm font-semibold text-gray-900">
                          ${invoice.total.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => loadInvoice(invoice)}
                        className="w-full px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition-all"
                      >
                        Load Invoice
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Invoice Preview</h2>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-900">
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">INVOICE</h1>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Invoice #: {invoiceData.invoiceNumber || "Draft"}
                    </p>
                    <p className="text-sm text-gray-600">Date: {invoiceData.invoiceDate}</p>
                    <p className="text-sm text-gray-600">Due: {invoiceData.dueDate || "N/A"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{invoiceData.companyName || "Your Company"}</p>
                    <p className="text-sm text-gray-600">{invoiceData.companyAddress}</p>
                    <p className="text-sm text-gray-600">{invoiceData.companyEmail}</p>
                    <p className="text-sm text-gray-600">{invoiceData.companyPhone}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="font-semibold text-gray-900 mb-2">Bill To:</p>
                  <p className="font-bold text-gray-900">{invoiceData.clientName || "Client Name"}</p>
                  <p className="text-sm text-gray-600">{invoiceData.clientAddress}</p>
                  <p className="text-sm text-gray-600">{invoiceData.clientEmail}</p>
                  <p className="text-sm text-gray-600">{invoiceData.clientPhone}</p>
                </div>

                <table className="w-full mb-8">
                  <thead>
                    <tr className="bg-gray-900 text-white">
                      <th className="text-left p-3">Description</th>
                      <th className="text-center p-3">Qty</th>
                      <th className="text-right p-3">Price</th>
                      <th className="text-right p-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="p-3 text-gray-900">{item.description || "-"}</td>
                        <td className="p-3 text-center text-gray-600">{item.quantity}</td>
                        <td className="p-3 text-right text-gray-600">${item.price.toFixed(2)}</td>
                        <td className="p-3 text-right text-gray-900 font-semibold">
                          ${(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold text-gray-900">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Tax ({invoiceData.taxRate}%):</span>
                      <span className="font-semibold text-gray-900">${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t-2 border-gray-900">
                      <span className="font-bold text-gray-900">Total:</span>
                      <span className="font-bold text-gray-900">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {invoiceData.notes && (
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Notes:</p>
                    <p className="text-sm text-gray-600">{invoiceData.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}