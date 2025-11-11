// Tiny templating helper to reuse variables inside bot messages
export function t(str, ctx) {
  return str
    .replace(/\{\{name\}\}/g, ctx.name ?? "")
    .replace(/\{\{accountMasked\}\}/g, ctx.accountMasked ?? "");
}
