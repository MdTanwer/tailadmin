interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Makes an authenticated API request with automatic token inclusion
 */
export const apiRequest = async (
  url: string,
  options: ApiRequestOptions = {}
): Promise<Response> => {
  const { requireAuth = true, headers = {}, ...restOptions } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  // Add authentication token if required and available
  if (requireAuth) {
    const token = localStorage.getItem("authToken");
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders,
  });

  // If we get a 401 and we're trying to use auth, the token might be expired
  if (response.status === 401 && requireAuth) {
    // Clear invalid token
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/signin";
    }
  }

  return response;
};

/**
 * Makes an authenticated GET request
 */
export const apiGet = async (
  url: string,
  requireAuth: boolean = true
): Promise<Response> => {
  return apiRequest(url, { method: "GET", requireAuth });
};

/**
 * Makes an authenticated POST request
 */
export const apiPost = async (
  url: string,
  data: unknown,
  requireAuth: boolean = true
): Promise<Response> => {
  return apiRequest(url, {
    method: "POST",
    body: JSON.stringify(data),
    requireAuth,
  });
};

/**
 * Makes an authenticated PUT request
 */
export const apiPut = async (
  url: string,
  data: unknown,
  requireAuth: boolean = true
): Promise<Response> => {
  return apiRequest(url, {
    method: "PUT",
    body: JSON.stringify(data),
    requireAuth,
  });
};

/**
 * Makes an authenticated DELETE request
 */
export const apiDelete = async (
  url: string,
  requireAuth: boolean = true
): Promise<Response> => {
  return apiRequest(url, { method: "DELETE", requireAuth });
};
