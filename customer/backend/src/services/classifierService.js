import openai from "../config/openai.js";
import AppError from "../utils/AppError.js";

const CLASSIFIER_PROMPT = `
You classify banking enquiries into a category + subcategory.
If category is unknown, then confidence is 0.
Return ONLY JSON.

Example structure:
{
  "category_code": "card_declined",
  "category_label": "Card Declined",
  "confidence": 0.85
}

Categories:
Categories (code - label):

cards_and_payments             - Cards & Payments
lost_or_stolen_card            - Lost or Stolen Card
card_block_freeze              - Freeze / Block Card
card_declined                  - Card Declined
replace_card                   - Replace Card
overseas_card_use              - Overseas Card Use / Activation
payment_dispute                - Payment / Card Transaction Dispute
card_limit_change              - Change Card Limit

accounts_and_savings           - Accounts & Savings
account_balance                - Check Balance
recent_transactions            - Recent Transactions
transfer_limits                - Change Transfer Limit
fees_charges                   - Fees & Charges
change_account_details         - Update Personal / Account Details

loans_and_mortgages            - Loans & Mortgages
home_loan_enquiry              - Home Loan Enquiry
car_loan_enquiry               - Car Loan Enquiry
personal_loan_enquiry          - Personal Loan Enquiry
loan_repayment_issue           - Loan Repayment Issue
loan_application_status        - Loan Application Status

digital_banking                - Digital Banking
login_issue                    - Login Issue
reset_password                 - Reset Password
update_mobile_number           - Update Mobile Number
device_change                  - Change / Reset Device
app_technical_issue            - App / Website Issue
otp_2fa_issue                  - OTP / 2FA Issue

security_and_fraud             - Security & Fraud
suspected_scam                 - Suspected Scam
suspicious_sms_email           - Suspicious SMS / Email
unauthorised_card_txn          - Unauthorised Card Transaction
unauthorised_account_access    - Unauthorised Account Access
freeze_card_account            - Freeze Card / Account

branch_and_atm                 - Branch & ATM Services
branch_opening_hours           - Branch Opening Hours
book_branch_appointment        - Book Branch Appointment
queue_status                   - Queue Status
find_nearby_branch_atm         - Find Nearby Branch / ATM
atm_error_or_card_retained     - ATM Error / Card Retained

product_info_and_rates         - Product Info & Rates
interest_rates_deposit         - Deposit Interest Rates
loan_interest_rates            - Loan Interest Rates
fx_rates                       - Foreign Exchange (FX) Rates
product_comparison             - Product Comparison
promotions_offers              - Promotions & Offers

feedback_and_others            - Feedback & Others
service_feedback               - Service Feedback
technical_feedback             - App / Website Feedback
complaint                      - Complaint
compliment                     - Compliment
other_enquiry                  - Other Enquiry

If none fits well, use:
unknown                        - Not sure / Other
`

export async function classifyMessage(userMessage){
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {role: "system", content: CLASSIFIER_PROMPT},
            {role: "user", content: userMessage},
        ],
        temperature: 0,
    });

    let raw = completion.choices[0].message.content.trim();

    try{
        return JSON.parse(raw);
    }catch{
        return {
            category_code: "unknown",
            category_label: "Other Enquiry",
            confidence: 0,
        };
    }
}