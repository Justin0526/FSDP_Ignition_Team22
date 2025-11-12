// src/controller/customer.controller.js
import * as svc from "@/core/services/customer.service";

const ERROR_MAP = {
  PHONE_INVALID: {
    status: 400,
    field: "phone",
    message: "The phone number looks invalid. Please enter 8–15 digits (spaces/dashes are fine).",
    hint: "Examples: 91234567, +65 9123 4567",
  },
  CARD_INVALID: {
    status: 400,
    field: "last4",
    message: "Please enter exactly the last 4 digits of your card.",
    hint: "Example: 1234",
  },
  NOT_FOUND: {
    status: 404,
    field: "phone,last4",
    message: "We couldn’t verify those details. Please check your phone and card last 4 digits.",
    hint: "If you have multiple cards, try a different card’s last 4.",
  },
  DB_QUERY_FAILED: {
    status: 500,
    message: "We ran into an internal issue while verifying your details.",
    hint: "Please try again in a few minutes.",
  },
  DIGITOKEN_REQUIRED: {
    status: 401,
    message: "Digitoken approval is required before we can verify your details.",
    hint: "Approve the request in your OCBC app to continue.",
  },
};

export async function verifyCustomerController(body) {
  const { phone, last4, digitokenApproved } = body || {};

  try {
    if (!digitokenApproved) throw new Error("DIGITOKEN_REQUIRED");
    const data = await svc.verifyCustomer(phone, last4);
    return { ok: true, data, status: 200 };
  } catch (err) {
    const code = err?.message || "DB_QUERY_FAILED";
    const spec = ERROR_MAP[code] || ERROR_MAP.DB_QUERY_FAILED;
    return {
      ok: false,
      error: {
        code,
        message: spec.message,
        field: spec.field,
        hint: spec.hint,
      },
      status: spec.status,
    };
  }
}