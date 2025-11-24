// Validate mobile number
export function validatePhone(phone){
    if(!phone) 
        return "Please enter your phone number.";

     if (!/^[89]\d{7}$/.test(phone)) 
        return "Please enter a valid SG mobile number (8 digits, e.g. 91234567).";

    return null;
}

// Validate NRIC last 4
export function validateNric(nricLast4){
    if(!nricLast4)
        return "Please enter the last 4 of your NRIC.";

    if (!/^[A-Za-z0-9]{4}$/.test(nricLast4))
        return "NRIC last 4 must be 4 letters/numbers.";

    return null;
}

// Validate OTP
export function validateOtp(otp){
    if(!otp)
        return "Please enter the 6-digit OTP.";

    if (!/^\d{6}$/.test(otp))
        return "OTP must be a 6-digit number.";

    return null;
}