// Retrieve base API URL with fallback
export const getBaseApiUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

// Build standard prefixed API endpoints
export const getApiUrl = (path: string): string => {
  const base = getBaseApiUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api${cleanPath}`;
};

// API Endpoint constants/helpers for useSWR or direct fetch calls
export const API_ENDPOINTS = {
  products: () => getApiUrl("products"),
  services: () => getApiUrl("services"),
  serviceDetail: (id: string) => getApiUrl(`services/${id}`),
  authSession: () => getApiUrl("auth/session"),
  authSignout: () => getApiUrl("auth/signout"),
  bookings: () => getApiUrl("bookings"),
};
