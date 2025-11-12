import * as repo from "@/core/repos/customer.repo";

// Utility helpers
const digitsOnly = (v) => String(v || "").replace(/\D+/g, "");
const maskLast4 = (last4) => `•••• •••• •••• ${String(last4).slice(-4)}`;

// Looser phone validation — allows 8–15 digits
const isLoosePhone = (v) => {
  const digits = digitsOnly(v);
  return digits.length >= 8 && digits.length <= 15;
};

export async function verifyCustomer(phone, last4) {
  // --- Normalize and validate inputs ---
  if (!isLoosePhone(phone)) throw new Error("PHONE_INVALID");
  if (!/^\d{4}$/.test(String(last4 || ""))) throw new Error("CARD_INVALID");

  // Clean up input
  let phoneDigits = digitsOnly(phone); // removes +, spaces, etc.

  // --- Add +65 if missing ---
  // Singapore numbers usually start with 8 or 9 and have 8 digits
  if (!phoneDigits.startsWith("65")) {
    phoneDigits = `65${phoneDigits}`;
  }

  // Convert to final query format: DB stores with +65 (and optional space)
  const formattedPhone = `+${phoneDigits}`; // "+6591234567"

  // --- Query database ---
  const row = await repo.findCustomerAndCards(formattedPhone, last4);
  if (!row) throw new Error("NOT_FOUND");

  // --- Construct response ---
  const customer = {
    customer_id: row.customer_id,
    full_name: row.full_name,
    phone_number: row.mobile_number, // from DB
  };

  const cards = (row.cards || []).map((c) => ({
    card_id: c.card_id,
    card_type: c.network, // change to match your schema
    status: c.status,
    card_number_masked: maskLast4(c.card_last4),
  }));

  return { customer, cards };
}
