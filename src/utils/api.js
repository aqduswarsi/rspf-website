// v2 - admin routes

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://rspf-backend.onrender.com";

export async function adminLogin(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Login failed. Please try again.");
  }

  return data;
}

export async function adminRegister(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/api/admin/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Registration failed.");
  }

  return data;
}

export async function getProfile() {
  const token = localStorage.getItem("rpsf_login_token");

  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch profile.");
  }

  return data;
}
