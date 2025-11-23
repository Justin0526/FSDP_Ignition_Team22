// Helper to call backend from frontend

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if(!BASE_URL){
    console.warn("Backend url is not set");
}

// Generic Get helper
export async function getJson(path){
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "GET",
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
            "Content-Type" : "application/json"
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