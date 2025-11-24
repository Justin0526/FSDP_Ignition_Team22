// Helper to call backend from frontend

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if(!BASE_URL){
    console.warn("Backend url is not set");
}

let CURRENT_SESSION_ID = null;
export function setApiSessionId(sessionId){
    CURRENT_SESSION_ID = sessionId;
}

// Generic Get helper
export async function getJson(path){
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "GET",
        headers: {
            "x-session-id": CURRENT_SESSION_ID ?? ""
        }
    })

    const data = await res.json().catch(() => ({}));

    if(!res.ok || data.success === false){
        const message = data?.error || `Request failed: ${res.status}`;
        throw new Error(message);
    }

    return data;
}

// Generic Post helper
export async function postJson(path, body){
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "x-session-id" : CURRENT_SESSION_ID ?? ""
        },
        body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.success === false){
        const message = data?.error || `Request failed: ${res.status}`;
        throw new Error(message);
    }

    return data;
}