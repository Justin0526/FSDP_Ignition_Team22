// src/components/ViewEnquiryHistoryButton.jsx
"use client";

import { useState } from "react";
import EnquiryHistoryPopup from "./EnquiryHistoryPopup";

export default function ViewEnquiryHistoryButton({ customerId }) {
  const [open, setOpen] = useState(false);

  const disabled = !customerId;

  return (
    <>
      <button
        onClick={() => !disabled && setOpen(true)}
        disabled={disabled}
        className={`w-full rounded-full border border-black px-4 py-2 font-medium ${
          disabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-100 text-black"
        }`}
      >
        View enquiry history
      </button>

      {/* Only render popup if we have a customer to show history for */}
      {customerId && (
        <EnquiryHistoryPopup
          isOpen={open}
          onClose={() => setOpen(false)}
          customerId={customerId}
        />
      )}
    </>
  );
}
