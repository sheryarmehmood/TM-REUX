const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const backendUrl = apiUrl.replace(/\/api\/?$/, "");

export class ApiError extends Error {
    constructor(message, status = 0, errors = {}) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.errors = errors;
    }
}

function csrfToken() {
    const cookie = document.cookie
        .split("; ")
        .find((value) => value.startsWith("XSRF-TOKEN="));

    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

async function parseResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        return null;
    }

    return response.json();
}

export async function request(path, options = {}) {
    const { body, params, headers = {}, ...fetchOptions } = options;
    const url = new URL(`${apiUrl}/${path.replace(/^\//, "")}`);

    Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, value);
        }
    });

    const requestHeaders = {
        Accept: "application/json",
        ...headers,
    };

    const token = csrfToken();
    if (token) {
        requestHeaders["X-XSRF-TOKEN"] = token;
    }

    if (body !== undefined) {
        requestHeaders["Content-Type"] = "application/json";
    }

    let response;
    try {
        response = await fetch(url, {
            credentials: "include",
            ...fetchOptions,
            headers: requestHeaders,
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    } catch {
        throw new ApiError("Unable to connect to the server.");
    }

    const payload = await parseResponse(response);
    if (!response.ok) {
        throw new ApiError(
            payload?.message || "The request could not be completed.",
            response.status,
            payload?.errors || {},
        );
    }

    return payload;
}

export function fetchCsrfCookie() {
    return fetch(`${backendUrl}/sanctum/csrf-cookie`, {
        credentials: "include",
        headers: { Accept: "application/json" },
    });
}

export { apiUrl };
