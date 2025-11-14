// src/chatbot/messages/SummaryCardMessage.jsx
"use client";
import React from "react";

export default function SummaryCardMessage({ payload, onAction, loading = false }) {
  const {
    customerName = "",
    accountMasked = "",
    categoryName = "",
    subcategoryName = "",
  } = payload || {};

  return (
    <div className="w-full max-w-sm rounded-xl bg-neutral-100 p-4 shadow-sm">
      {/* Name */}
      <div className="mb-3">
        <label className="block text-sm font-semibold text-neutral-700">Name</label>
        <input
          readOnly
          value={customerName}
          className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
        />
      </div>

      {/* Card Number */}
      <div className="mb-3">
        <label className="block text-sm font-semibold text-neutral-700">Card Number</label>
        <input
          readOnly
          value={accountMasked}
          className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
        />
      </div>

      {/* Category */}
      <div className="mb-3">
        <label className="block text-sm font-semibold text-neutral-700">Category</label>
        <input
          readOnly
          value={categoryName}
          className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
        />
      </div>

      {/* Subcategory */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-neutral-700">Subcategory</label>
        <input
          readOnly
          value={subcategoryName}
          className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
        />
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => onAction?.("confirm")}
          disabled={loading}
          className="w-full rounded-md bg-rose-300 px-4 py-2 text-sm font-semibold text-black shadow active:translate-y-px disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Confirm"}
        </button>
        <button
          type="button"
          onClick={() => onAction?.("cancel")}
          className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow active:translate-y-px"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
