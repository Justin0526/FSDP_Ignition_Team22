import * as svc from "../services/enquiryService.js";
import AppError from "../utils/AppError.js";

export async function handleCreateEnquiry(req, res, next){
    try{
        const sessionId = req.headers["x-session-id"];
        const { categoryId, subcategoryId, description } = req.body;

        if(!categoryId){
            throw new AppError("categoryId, is required", 400);
        }

        const enquiry = await svc.createEnquiry(sessionId, { categoryId, subcategoryId, description});

        res.json({
            success: true,
            enquiry,
        });
    }catch(err){
        next(err);
    }
}

/**
 * Controller: handleSelfServiceFeedback
 *
 * This controller handles the POST request:
 *   POST /api/enquiries/:enquiryId/self-service-feedback
 *
 * Purpose:
 * --------
 * When the chatbot shows a self-service tutorial (steps + video),
 * the system must record whether the user found it helpful.
 *
 * The frontend will send:
 * - enquiryId     → which enquiry the feedback is for
 * - guideId       → which self-service tutorial was shown
 * - wasHelpful    → true/false (did the user click "Yes"?)
 *
 * This controller:
 * 1. Extracts request data
 * 2. Validates the session (through service layer)
 * 3. Calls the service function to update the enquiry record
 * 4. Returns the updated enquiry back to the client
 * 5. Handles any errors using Express middleware
 */
export async function handleSelfServiceFeedback(req, res, next) {
  try {
    // -------------------------------------------------------------
    // 1. Extract the session ID from request headers
    // -------------------------------------------------------------
    // The frontend must pass the current session ID in "x-session-id".
    // This is required to ensure the user is authenticated and verified.
    const sessionId = req.headers["x-session-id"];


    // -------------------------------------------------------------
    // 2. Extract the enquiryId from the URL parameters
    // -------------------------------------------------------------
    // Example route:
    //   POST /api/enquiries/12345/self-service-feedback
    //
    // Here, enquiryId = "12345"
    const { enquiryId } = req.params;


    // -------------------------------------------------------------
    // 3. Extract the feedback details from the request body
    // -------------------------------------------------------------
    // frontend sends:
    // {
    //    guideId: "some-guide-uuid",
    //    wasHelpful: true/false
    // }
    const { guideId, wasHelpful } = req.body;


    // -------------------------------------------------------------
    // 4. Call the service layer to process and save feedback
    // -------------------------------------------------------------
    // This function performs:
    // - session validation
    // - ownership check (customer must own the enquiry)
    // - updating enquiry row with:
    //      resolution_type = "self_service"
    //      resolution_guide_id = guideId
    //      resolution_helpful = wasHelpful
    //      resolved_at = timestamp
    //
    // and returns the updated enquiry.
    const enquiry = await svc.saveSelfServiceFeedback(sessionId, enquiryId, {
      guideId,
      wasHelpful,
    });


    // -------------------------------------------------------------
    // 5. Respond back to the client with success + updated enquiry
    // -------------------------------------------------------------
    // The frontend chatbot will use this data to confirm to the user
    // that their feedback has been recorded.
    res.json({
      success: true,
      enquiry,
    });

  } catch (err) {

    // -------------------------------------------------------------
    // 6. Error handling
    // -------------------------------------------------------------
    // If any error occurs in the service layer or controller logic,
    // pass the error to Express error middleware.
    //
    // This allows the centralised error handler to send a consistent
    // JSON error response.
    next(err);
  }
}

/**
 * Controller: handleGetHelpfulHistory
 *
 * This endpoint retrieves past enquiries where:
 *   - The enquiry belongs to the current verified user
 *   - The enquiry was resolved through a self-service guide
 *   - The user clicked "Yes, it helped"
 *   - The enquiry matches the same category/subcategory
 *
 * Frontend usage example:
 *   GET /api/enquiries/history?subcategoryId=<id>&limit=3
 *
 * Response includes:
 *   - past enquiry details
 *   - the exact self-service guide previously used
 *   - steps_text + video_url (for chatbot to display again)
 *
 * Purpose in application flow:
 * -------------------------------------------
 * When a user creates a new enquiry, the chatbot can check if
 * they have previously solved a similar issue successfully.
 *
 * If yes → show a helpful recommendation:
 *   "Last time you solved this using this tutorial ↓"
 */
export async function handleGetHelpfulHistory(req, res, next) {
  try {
    // -------------------------------------------------------------
    // 1. Extract session ID from request headers
    // -------------------------------------------------------------
    // Required to identify the customer (via session)
    const sessionId = req.headers["x-session-id"];


    // -------------------------------------------------------------
    // 2. Extract filtering options from query parameters
    // -------------------------------------------------------------
    // Query params supported:
    //   - categoryId      → broader match
    //   - subcategoryId   → more specific match
    //   - limit           → how many history items to return
    //
    // Example:
    //   GET /api/enquiries/history?subcategoryId=123
    //
    // Values are used to filter historical enquiries.
    const { categoryId, subcategoryId, limit } = req.query;


    // -------------------------------------------------------------
    // 3. Call the service layer to fetch helpful history
    // -------------------------------------------------------------
    // We pass:
    //   - sessionId
    //   - filters (category/subcategory)
    //   - limit (default: 3)
    //
    // The service handles all:
    //   - session validation
    //   - category/subcategory filtering
    //   - selecting only helpful self-service results
    //   - joining the self_service_guides table
    const history = await svc.getHelpfulHistory(sessionId, {
      categoryId: categoryId || null,
      subcategoryId: subcategoryId || null,
      limit: limit ? Number(limit) : 3,
    });


    // -------------------------------------------------------------
    // 4. Send success response with the retrieved history
    // -------------------------------------------------------------
    // The frontend will use this data to display:
    //   - tutorial title
    //   - steps
    //   - embedded YouTube video
    //   - past enquiry description
    res.json({
      success: true,
      history,
    });

  } catch (err) {

    // -------------------------------------------------------------
    // 5. Error handling
    // -------------------------------------------------------------
    // Pass any errors to Express error middleware,
    // which will send a structured JSON error response.
    next(err);
  }
}
