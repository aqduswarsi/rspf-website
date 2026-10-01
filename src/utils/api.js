// v2 - admin + user routes

export const API_BASE_URL =
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

export async function changeUserPassword(newPassword, confirmPassword) {
  const token = localStorage.getItem("rpsf_user_token");
  const res = await fetch(`${API_BASE_URL}/api/user/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPassword, confirmPassword }),
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

// ==================== PUBLIC REGISTRATION ====================

export async function publicRegister(data) {
  const res = await fetch(`${API_BASE_URL}/api/public/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.message || "Registration failed");
  return result;
}

// ==================== COURSES ====================

export async function createCourse(name) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to create course");
  return data;
}

export async function getAllCourses() {
  const res = await fetch(`${API_BASE_URL}/api/education/courses`);
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || "Failed to load courses");
  return data;
}

export async function updateCourse(id, name) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/courses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to update course");
  return data;
}

export async function deleteCourse(id) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/courses/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to delete");
  return data;
}

// ==================== SUBJECTS ====================

export async function createSubject(name, courseId) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/subjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, courseId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to create subject");
  return data;
}

export async function getAllSubjects(courseId) {
  const url = courseId
    ? `${API_BASE_URL}/api/education/subjects?courseId=${courseId}`
    : `${API_BASE_URL}/api/education/subjects`;
  const res = await fetch(url);
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || "Failed to load subjects");
  return data;
}

export async function updateSubject(id, name, courseId) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/subjects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, courseId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to update subject");
  return data;
}

export async function deleteSubject(id) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/subjects/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to delete");
  return data;
}

// ==================== LESSONS ====================

export async function createLesson(title, content, courseId, subjectId) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/lessons`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title, content, courseId, subjectId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to create lesson");
  return data;
}

export async function getAllLessons(courseId, subjectId) {
  let url = `${API_BASE_URL}/api/education/lessons`;
  const params = [];
  if (courseId) params.push(`courseId=${courseId}`);
  if (subjectId) params.push(`subjectId=${subjectId}`);
  if (params.length) url += `?${params.join("&")}`;

  const res = await fetch(url);
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || "Failed to load lessons");
  return data;
}

export async function updateLesson(id, updates) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/lessons/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(updates),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to update lesson");
  return data;
}

export async function deleteLesson(id) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/lessons/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to delete");
  return data;
}

// ==================== EXAM QUESTIONS ====================

export async function createQuestion(data) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/exam/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.message || "Failed to create question");
  return result;
}

export async function getAllQuestions(filters = {}) {
  let url = `${API_BASE_URL}/api/education/exam/questions`;
  const params = [];
  if (filters.courseId) params.push(`courseId=${filters.courseId}`);
  if (filters.subjectId) params.push(`subjectId=${filters.subjectId}`);
  if (filters.type) params.push(`type=${filters.type}`);
  if (params.length) url += `?${params.join("&")}`;

  const res = await fetch(url);
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || "Failed to load questions");
  return data;
}

export async function updateQuestion(id, updates) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/exam/questions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(updates),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to update question");
  return data;
}

export async function deleteQuestion(id) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/exam/questions/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to delete");
  return data;
}

// ==================== EXAM RESULTS ====================

export async function submitExam(data) {
  const token = localStorage.getItem("rpsf_login_token") || localStorage.getItem("rpsf_user_token");
  const res = await fetch(`${API_BASE_URL}/api/education/exam/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.message || "Failed to submit exam");
  return result;
}

export async function getAllResults(filters = {}) {
  const token = localStorage.getItem("rpsf_login_token");
  let url = `${API_BASE_URL}/api/education/exam/results`;
  const params = [];
  if (filters.userId) params.push(`userId=${filters.userId}`);
  if (filters.courseId) params.push(`courseId=${filters.courseId}`);
  if (filters.status) params.push(`status=${filters.status}`);
  if (filters.isPrinted !== undefined) params.push(`isPrinted=${filters.isPrinted}`);
  if (params.length) url += `?${params.join("&")}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || "Failed to load results");
  return data;
}

export async function getResultById(id) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/exam/results/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to load result");
  return data;
}

export async function updateResult(id, updates) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/exam/results/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(updates),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to update result");
  return data;
}

export async function deleteResult(id) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/exam/results/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to delete");
  return data;
}

// ==================== SUPPORT TICKETS ====================

export async function createTicket(userId, question) {
  const token = localStorage.getItem("rpsf_login_token") || localStorage.getItem("rpsf_user_token");
  const res = await fetch(`${API_BASE_URL}/api/support/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ userId, question }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to create ticket");
  return data;
}

export async function getAllTickets(filters = {}) {
  const token = localStorage.getItem("rpsf_login_token");
  let url = `${API_BASE_URL}/api/support/tickets`;
  const params = [];
  if (filters.status) params.push(`status=${filters.status}`);
  if (filters.userId) params.push(`userId=${filters.userId}`);
  if (params.length) url += `?${params.join("&")}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || "Failed to load tickets");
  return data;
}

export async function replyTicket(id, answer) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/support/tickets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ answer }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to reply");
  return data;
}

export async function deleteTicket(id) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/support/tickets/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to delete");
  return data;
}

// ==================== CONTACT DETAILS ====================

export async function getContactDetails() {
  const res = await fetch(`${API_BASE_URL}/api/contact/details`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to load contact");
  return data;
}

export async function updateContactDetails(data) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/contact/details`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.message || "Failed to save contact");
  return result;
}
// ==================== USER EXAMS ====================

export async function getUserExams() {
  const token = localStorage.getItem("rpsf_user_token");
  const res = await fetch(`${API_BASE_URL}/api/user/exams`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || "Failed to load exams");
  return data;
}

export async function getUserExamById(id) {
  const token = localStorage.getItem("rpsf_user_token");
  const res = await fetch(`${API_BASE_URL}/api/user/exams/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to load exam");
  return data;
}

export async function submitUserExam(id, answers) {
  const token = localStorage.getItem("rpsf_user_token");
  const res = await fetch(`${API_BASE_URL}/api/user/exams/${id}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answers }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to submit exam");
  return data;
}

// ==================== USER RESULTS ====================

export async function getMyResults() {
  const token = localStorage.getItem("rpsf_user_token");
  const res = await fetch(`${API_BASE_URL}/api/user/results`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || "Failed to load results");
  return data;
}

export async function getMyResultById(id) {
  const token = localStorage.getItem("rpsf_user_token");
  const res = await fetch(`${API_BASE_URL}/api/user/results/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to load result");
  return data;
}

// ==================== USER DASHBOARD ====================

export async function getUserDashboardStats() {
  const token = localStorage.getItem("rpsf_user_token");
  const res = await fetch(`${API_BASE_URL}/api/user/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to load stats");
  return data;
}

// ==================== USER TICKETS ====================

export async function getMyTickets() {
  const token = localStorage.getItem("rpsf_user_token");
  const res = await fetch(`${API_BASE_URL}/api/user/tickets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || "Failed to load tickets");
  return data;
}

export async function createUserTicket(question) {
  const token = localStorage.getItem("rpsf_user_token");
  const res = await fetch(`${API_BASE_URL}/api/user/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ question }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to create ticket");
  return data;
}


// ==================== ADMIN EXAMS ====================

export async function createExam(data) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/exams`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.message || "Failed to create exam");
  return result;
}

export async function getAdminExams(filters = {}) {
  const token = localStorage.getItem("rpsf_login_token");
  let url = `${API_BASE_URL}/api/education/exams`;
  const params = [];
  if (filters.courseId) params.push(`courseId=${filters.courseId}`);
  if (filters.subjectId) params.push(`subjectId=${filters.subjectId}`);
  if (params.length) url += `?${params.join("&")}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || "Failed to load exams");
  return data;
}

export async function getAdminExamById(id) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/exams/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to load exam");
  return data;
}

export async function updateExam(id, updates) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/exams/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(updates),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to update exam");
  return data;
}

export async function deleteExam(id) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/exams/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to delete exam");
  return data;
}

export async function attachQuestionsToExam(examId, questionIds) {
  const token = localStorage.getItem("rpsf_login_token");
  const res = await fetch(`${API_BASE_URL}/api/education/exams/${examId}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ questionIds }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to attach questions");
  return data;
}