import * as repo from "@/core/repos/customer.repo";

// Utility helpers
const digitsOnly = (v) => String(v || "").replace(/\D+/g, "");
const maskLast4 = (last4) => `•••• •••• •••• ${String(last4).slice(-4)}`;

// Basic phone validation (accepts various formats)
const isLoosePhone = (v) => {
  const digits = digitsOnly(v);
  return digits.length >= 8;
};

export async function verifyCustomer(phone, last4) {
  // --- Validate inputs ---
  if (!isLoosePhone(phone)) throw new Error("PHONE_INVALID");
  if (!/^\d{4}$/.test(String(last4 || ""))) throw new Error("CARD_INVALID");

  // --- Normalize phone ---
  let phoneDigits = digitsOnly(phone);

  // If input starts with 65 / +65 or longer than 8 digits → trim to last 8
  if (phoneDigits.length > 8) {
    phoneDigits = phoneDigits.slice(-8);
  }

  // At this point, phoneDigits should be exactly 8 digits (local SG)
  if (phoneDigits.length !== 8) throw new Error("PHONE_INVALID");

  // --- Query database using local 8-digit number ---
  const row = await repo.findCustomerAndCards(phoneDigits, last4);
  if (!row) throw new Error("NOT_FOUND");

  // --- Construct response ---
  const customer = {
    customer_id: row.customer_id,
    full_name: row.full_name,
    phone_number: row.mobile_number, 
  };

  const cards = (row.cards || []).map((c) => ({
    card_id: c.card_id,
    card_type: c.network, 
    status: c.status,
    card_number_masked: maskLast4(c.card_last4),
  }));

  return { customer, cards };
}
