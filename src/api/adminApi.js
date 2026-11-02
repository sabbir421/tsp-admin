const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api" ||
  "https://api.truespaceproperty.com/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("tsp_admin_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

export const adminApi = {
  login: (credentials) =>
    request("/admin/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  getStats: () => request("/admin/stats"),
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/users${query ? `?${query}` : ""}`);
  },
  updateUserStatus: (role, id, data) =>
    request(`/admin/users/${role}/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteUser: (role, id) =>
    request(`/admin/users/${role}/${id}`, { method: "DELETE" }),

  getProperties: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/properties${query ? `?${query}` : ""}`);
  },
  verifyProperty: (id) =>
    request(`/admin/properties/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "verified" }),
    }),
  updatePropertyStatus: (id, status) =>
    request(`/admin/properties/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  deleteProperty: (id) =>
    request(`/admin/properties/${id}`, { method: "DELETE" }),

  getRequirements: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/requirements${query ? `?${query}` : ""}`);
  },
  deleteRequirement: (id) =>
    request(`/admin/requirements/${id}`, { method: "DELETE" }),

  getMatches: () => request("/admin/matches"),
  getOtpLogs: () => request("/admin/otp-logs"),

  getAdmins: () => request("/admin/admins"),
  createAdmin: (data) =>
    request("/admin/admins", { method: "POST", body: JSON.stringify(data) }),
  deleteAdmin: (id) => request(`/admin/admins/${id}`, { method: "DELETE" }),
};
