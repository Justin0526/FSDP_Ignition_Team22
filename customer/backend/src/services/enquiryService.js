import supabase from "../config/supabase.js";
import AppError from "../utils/AppError.js";
import { getAndValidateActiveSession } from "./sessionService.js";

// Create new enquiry for the current customer
export async function createEnquiry(sessionId, {categoryId, subcategoryId, description}){
    if(!categoryId){
        throw new AppError("categoryId is required", 400);
    }

    const session = await getAndValidateActiveSession(sessionId);

    if(!session.customer_id){
        throw new AppError("No customer linked to this session", 400);
    }

    const { data, error } = await supabase
        .from("enquiries")
        .insert({
            session_id: session.session_id,
            customer_id: session.customer_id,
            category_id: categoryId,
            subcategory_id: subcategoryId,
            description: description || null,
        })
        .select("*")
        .single();

    if(error || !data){
        throw new AppError("Failed to create enquiry", 500);
    }

    return data;
}

/**
 * Save self-service feedback for an enquiry.
 *
 * This is called when the user interacts with the self-service tutorial:
 * - If the user clicks "Yes, this helped", we store resolution_helpful = true.
 * - If the user clicks "No", we store resolution_helpful = false.
 *
 * It also stores:
 * - which self-service guide was shown (resolution_guide_id)
 * - marks the enquiry as resolved using self-service (resolution_type = "self_service")
 * - the exact timestamp when the enquiry was resolved (resolved_at)
 *
 * This data is later used to show “previously helpful solutions”
 * when a user comes back with a similar enquiry.
 */
export async function saveSelfServiceFeedback(sessionId, enquiryId, { guideId, wasHelpful }) {

  // -----------------------------
  // 1. Validate required inputs
  // -----------------------------
  // We must know:
  // - which enquiry is being updated
  // - which self-service guide was used
  // If either is missing, the request is invalid.
  if (!enquiryId || !guideId) {
    throw new AppError("enquiryId and guideId are required", 400);
  }


  // ------------------------------------------------------
  // 2. Validate session and ensure user is authenticated
  // ------------------------------------------------------
  // This ensures:
  // - session exists
  // - OTP verification has been completed
  // - session is active
  // - session contains a valid customer_id
  //
  // Without customer_id, we cannot ensure the user owns the enquiry.
  const session = await getAndValidateActiveSession(sessionId);
  if (!session.customer_id) {
    throw new AppError("No customer linked to this session", 400);
  }


  // ------------------------------------------------------------------------------------
  // 3. Update the enquiry record with self-service resolution information
  // ------------------------------------------------------------------------------------
  // We store:
  // - resolution_type: tells the system this enquiry was resolved via self-service
  // - resolution_guide_id: which tutorial/video was shown
  // - resolution_helpful: true/false depending on user’s answer
  // - resolved_at: exact timestamp when user confirmed resolution
  //
  // Security check:
  // We ensure:
  // - the enquiry belongs to this customer
  //   (prevents users from modifying other people's enquiries)
  //
  // .select("*").single() returns the updated enquiry row.
  const { data, error } = await supabase
    .from("enquiries")
    .update({
      resolution_type: "self_service",         // this enquiry was solved using a self-service tutorial
      resolution_guide_id: guideId,           // the tutorial that was shown
      resolution_helpful: wasHelpful,         // did the user find it helpful?
      resolved_at: new Date().toISOString(),  // timestamp of resolution
    })
    .eq("enquiry_id", enquiryId)               // update ONLY this specific enquiry
    .eq("customer_id", session.customer_id)    // ensure the enquiry belongs to the authenticated customer
    .select("*")
    .single();


  // ----------------------------------------------------
  // 4. Handle database errors or unexpected situations
  // ----------------------------------------------------
  // If Supabase returns an error or no data is returned,
  // we throw an internal server error.
  if (error || !data) {
    console.error(error);
    throw new AppError("Failed to save self-service feedback", 500);
  }


  // ----------------------------------------------------
  // 5. Return the updated enquiry back to the controller
  // ----------------------------------------------------
  // The controller will send this JSON to the frontend,
  // so the chatbot can confirm the user’s feedback.
  return data;
}

export async function getHelpfulHistory(
  sessionId,
  { categoryId, subcategoryId, limit = 3 }
) {
  // 1. Validate session and ensure it's linked to a customer
  const session = await getAndValidateActiveSession(sessionId);
  if (!session.customer_id) {
    throw new AppError("No customer linked to this session", 400);
  }

  // 2. Base query: past helpful self-service enquiries for this customer
  let enquiryQuery = supabase
    .from("enquiries")
    .select(
      `
      enquiry_id,
      description,
      created_at,
      category_id,
      subcategory_id,
      resolution_type,
      resolution_helpful,
      resolution_guide_id
      `
    )
    .eq("customer_id", session.customer_id)
    .eq("resolution_type", "self_service")
    .eq("resolution_helpful", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  // 3. Filter by subcategory if given, else by category if given
  if (subcategoryId) {
    enquiryQuery = enquiryQuery.eq("subcategory_id", subcategoryId);
  } else if (categoryId) {
    enquiryQuery = enquiryQuery.eq("category_id", categoryId);
  }

  const { data: enquiries, error: enquiryError } = await enquiryQuery;

  if (enquiryError) {
    console.error("Error fetching enquiries for history:", enquiryError);
    throw new AppError("Failed to fetch enquiry history", 500);
  }

  if (!enquiries || enquiries.length === 0) {
    // No matching records → just return empty list
    return [];
  }

  // 4. Collect distinct, non-null guide IDs from these enquiries
  const guideIds = [
    ...new Set(
      enquiries
        .map((e) => e.resolution_guide_id)
        .filter((id) => !!id)
    ),
  ];

  if (guideIds.length === 0) {
    // Safety: return enquiries with no attached guide info
    return enquiries.map((e) => ({
      ...e,
      self_service_guide: null,
    }));
  }

  // 5. Fetch all referenced guides in one query
  const { data: guides, error: guideError } = await supabase
    .from("self_service_guides")
    .select("guide_id, title, description, video_url, steps_text")
    .in("guide_id", guideIds);

  if (guideError) {
    console.error("Error fetching self service guides:", guideError);
    throw new AppError("Failed to fetch enquiry history", 500);
  }

  // 6. Build a map for quick lookup: guide_id -> guide object
  const guideMap = {};
  for (const guide of guides || []) {
    guideMap[guide.guide_id] = guide;
  }

  // 7. Attach guide details to each enquiry under self_service_guide
  return enquiries.map((e) => ({
    ...e,
    self_service_guide: e.resolution_guide_id
      ? guideMap[e.resolution_guide_id] || null
      : null,
  }));
}
