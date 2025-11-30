import { getJson } from '@/lib/apiClient';

export async function fetchEnquiryHistoryBySubcategory(subcategoryId) {
  const query = `?subcategoryId=${encodeURIComponent(subcategoryId)}`;
  const data = await getJson(`/api/enquiries/history${query}`);
  return data.history ?? [];
}
