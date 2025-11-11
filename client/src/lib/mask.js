// Helper to mask account number for privacy
export function maskNumber(n){
    const s = String(n).replace(/\s+/g,""); // remove spaces
    if (s.length <= 4) return s;
    return s.slice(0,6) + "*".repeat(Math.max(0, s.length-10)) + s.slice(-4);
}