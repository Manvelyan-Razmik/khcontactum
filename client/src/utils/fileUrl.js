// client/src/utils/fileUrl.js
import { API } from "../api.js";

/**
 * fileUrl(u):
 * - Եթե u արդեն absolute է (https://, http://, data:, blob:), 그대로 վերադարձնում է
 * - Հակառակ դեպքում համարում ենք, որ u-ն "/file/..." կամ "file/..." path է
 *   ու կցում ենք backend API origin-ին (khcontactum.onrender.com)
 */
export function fileUrl(u = "") {
  if (!u) return "";

  // արդեն absolute կամ data/blob => 그대로
  if (/^(data:|https?:\/\/|blob:)/i.test(u)) {
    return u;
  }

  let path = String(u).trim().replace(/^server\//i, "");
  if (!path.startsWith("/")) path = "/" + path;

  try {
    const api = new URL(API);           // напр. https://khcontactum.onrender.com
    return `${api.origin}${path}`;      // https://khcontactum.onrender.com/file/...
  } catch {
    if (typeof window !== "undefined" && window.location?.origin) {
      return window.location.origin.replace(/\/$/, "") + path;
    }
    return path;
  }
}
