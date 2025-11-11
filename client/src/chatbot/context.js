// Holds temporary conversation variables (not saved to DB until confirm)
export function createCtx() {
  return {
    name: null,
    accountRaw: null,      // never display this
    accountMasked: null,   // safe to display
    digitokenApproved: false,
    categoryId: null,
    categoryName: null,
    subcategoryId: null,
    subcategoryName: null,
  };
}
