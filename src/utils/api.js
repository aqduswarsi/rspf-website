// v2 - admin + user routes

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://rspf-backend.onrender.com";

// ==================== ADMIN AUTH ====================

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

// ==================== BIO DATA (ADMIN) ====================

export async function createBioData(data) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.message || "Failed to submit.");
  return result;
}

export async function getAllUsers() {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || "Failed to load users.");
  return data;
}

export async function getUnverifiedUsers() {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/users/unverified`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || "Failed to load users.");
  return data;
}

export async function getVerifiedUsers() {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/users/verified`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || "Failed to load users.");
  return data;
}

export async function getUserById(id) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to load user.");
  return data;
}

export async function updateUser(id, updates) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to update.");
  return data;
}

export async function acceptUser(id) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/users/${id}/accept`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to accept.");
  return data;
}

export async function blockUser(id) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/users/${id}/block`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to block.");
  return data;
}

export async function deleteUser(id) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to delete.");
  return data;
}

export async function getStats() {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to load stats.");
  return data;
}

// ==================== USER AUTH ====================

export async function userLogin(phone, password) {
  const response = await fetch(`${API_BASE_URL}/api/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }
  return data;
}

// ==================== USER PROFILE ====================

export async function getUserProfile() {
  const token = localStorage.getItem("rpsf_user_token");
  const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to load profile");
  return data;
}

export async function updateUserProfile(updates) {
  const token = localStorage.getItem("rpsf_user_token");
  const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to update profile");
  return data;
}

export async function changeUserPassword(oldPassword, newPassword) {
  const token = localStorage.getItem("rpsf_user_token");
  const res = await fetch(`${API_BASE_URL}/api/user/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to change password");
  return data;
}

// ==================== EVENTS ====================

export async function createEvent(data) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.message || "Failed to create event");
  return result;
}

export async function getAllEvents() {
  const res = await fetch(`${API_BASE_URL}/api/events`);
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || "Failed to load events");
  return data;
}

export async function updateEvent(id, updates) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to update event");
  return data;
}

export async function deleteEvent(id) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to delete");
  return data;
}

// ==================== NEWS ====================

export async function createNews(data) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/news`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.message || "Failed to create news");
  return result;
}

export async function getAllNews() {
  const res = await fetch(`${API_BASE_URL}/api/news`);
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || "Failed to load news");
  return data;
}

export async function updateNews(id, updates) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/news/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to update news");
  return data;
}

export async function deleteNews(id) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/news/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to delete");
  return data;
}

// ==================== GALLERY ====================

export async function createGalleryImage(data) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/gallery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.message || "Failed to add image");
  return result;
}

export async function getAllGalleryImages() {
  const res = await fetch(`${API_BASE_URL}/api/gallery`);
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || "Failed to load gallery");
  return data;
}

export async function deleteGalleryImage(id) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to delete");
  return data;
}
