// client/src/api.js

// Base API URL — backend Render սերվերի հասցեն
const API =
  (import.meta.env.VITE_API_BASE || "http://localhost:5050").replace(/\/$/, "");

/* ---------- helpers ---------- */
function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function jsonOrThrow(r, fallbackMsg = "Request failed") {
  const data = await (async () => {
    try {
      return await r.json();
    } catch {
      return null;
    }
  })();

  if (!r.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      `${fallbackMsg} (HTTP ${r.status})`;
    throw new Error(msg);
  }
  return data;
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/* ================= Admin ================= */

export async function adminLogin(username, password) {
  const r = await fetch(`${API}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return jsonOrThrow(r, "Login failed"); // { token, admin:{...} }
}

export async function adminMe(token) {
  const r = await fetch(`${API}/api/admin/me`, {
    headers: { ...authHeader(token) },
  });
  return jsonOrThrow(r, "Load failed"); // { admin, profile, items }
}

/* ---- Info JSON (Home tab) ---- */
export async function adminGetInfo(token) {
  const r = await fetch(`${API}/api/admin/info`, {
    headers: { ...authHeader(token) },
  });
  return jsonOrThrow(r, "Fetch failed");
}

export async function adminSaveInfo(token, payload) {
  const r = await fetch(`${API}/api/admin/info`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify(payload),
  });
  return jsonOrThrow(r, "Save failed");
}

/* Aliases for HomeTab.js compatibility */
export const adminInfoFetch = adminGetInfo;
export const adminInfoSave = adminSaveInfo;

/* ---- Profile ---- */
export async function adminSaveProfile(token, payload) {
  const r = await fetch(`${API}/api/admin/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify(payload),
  });
  return jsonOrThrow(r, "Save failed");
}

/* ---- Items CRUD ---- */
export async function adminAddItem(token, payload) {
  const r = await fetch(`${API}/api/admin/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify(payload),
  });
  return jsonOrThrow(r, "Create failed");
}

export async function adminUpdateItem(token, id, payload) {
  const r = await fetch(`${API}/api/admin/items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify(payload),
  });
  return jsonOrThrow(r, "Update failed");
}

export async function adminDeleteItem(token, id) {
  const r = await fetch(`${API}/api/admin/items/${id}`, {
    method: "DELETE",
    headers: { ...authHeader(token) },
  });
  return jsonOrThrow(r, "Delete failed");
}

/* ---- Change Password (NEW) ---- */
export async function adminChangePassword(token, { old_password, new_password }) {
  const r = await fetch(`${API}/api/admin/password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify({ old_password, new_password }),
  });
  return jsonOrThrow(r, "Password change failed");
}

/* ================= Superadmin ================= */

// ---- Superadmin Login ----
export async function superLogin(username, password, otp) {
  const r = await fetch(`${API}/api/superadmin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, otp }), // ✅ otp-ն էլ ուղարկում ենք
  });
  return jsonOrThrow(r, "Login failed"); // սպասում ենք { token }
}

export async function listAdmins(token) {
  const r = await fetch(`${API}/api/superadmin/admins`, {
    headers: { ...authHeader(token) },
  });
  return jsonOrThrow(r, "Fetch failed");
}

export async function createAdmin(token, payload) {
  const r = await fetch(`${API}/api/superadmin/admins`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify(payload),
  });
  return jsonOrThrow(r, "Create failed");
}

export async function updateAdmin(token, id, payload) {
  const r = await fetch(`${API}/api/superadmin/admins/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify(payload),
  });
  return jsonOrThrow(r, "Update failed");
}

export async function deleteAdmin(token, id) {
  const r = await fetch(`${API}/api/superadmin/admins/${id}`, {
    method: "DELETE",
    headers: { ...authHeader(token) },
  });
  return jsonOrThrow(r, "Delete failed");
}

/* ================= Public ================= */

export async function getPublicInfoByCardId(cardId) {
  const r = await fetch(
    `${API}/api/public/card/${encodeURIComponent(cardId)}`,
    {
      credentials: "include",
    }
  );
  const j = await safeJson(r);
  if (!r.ok) throw new Error(j?.error || `HTTP ${r.status}`);
  // սերվերը տալիս է { ok:true, data:{...} }, բայց հին build-երի համար normalize անենք
  if (j && j.ok && j.data) return j;
  return { ok: true, data: j?.information ? j : { information: j } };
}
export const fetchPublicCardByCardId = getPublicInfoByCardId;

/* ================= Upload ================= */

export async function uploadFile(token, file, field) {
  const fd = new FormData();
  fd.append("file", file);
  if (field) fd.append("field", field);
  const r = await fetch(`${API}/api/upload`, {
    method: "POST",
    headers: { ...authHeader(token) },
    body: fd,
  });
  return jsonOrThrow(r, "Upload failed");
}
export const adminUploadFile = uploadFile;

/* ================ Exports ================ */
export { API };

export async function getPublicLegacyByCardId(cardId) {
  return getPublicInfoByCardId(cardId);
}
