// server/src/routes/upload.js
import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { auth } from "../middleware/auth.js";
import { pool } from "../db.js";

const r = Router();

/* ================== UPLOAD DIR ================== */
/**
 * Կարևոր քայլ՝ որ ֆայլերը չկորչեն restart / deploy-ից հետո.
 * Render-ի վրա persistent disk ես mount արել
 *   /opt/render/project/src/server/uploads
 * և ENV-ում դնում ես՝
 *   UPLOAD_DIR=/opt/render/project/src/server/uploads
 *
 * Local dev-ում env չկա → կընկնի default `./uploads` պանակի վրա.
 */
const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/* ========= small helpers for nested paths / safe delete ======== */

// nested արժեքը վերցնելու համար (օր. "background.imageUrl")
function getPath(obj, pathStr) {
  if (!obj || typeof obj !== "object") return undefined;
  const keys = pathStr.split(".");
  let cur = obj;
  for (const k of keys) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = cur[k];
  }
  return cur;
}

// nested setter
function setPath(obj, pathStr, value) {
  const keys = pathStr.split(".");
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (typeof cur[keys[i]] !== "object" || cur[keys[i]] === null) {
      cur[keys[i]] = {};
    }
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  return obj;
}

// /file/<name> → full path դեպի UPLOAD_DIR, անվտանգ
function safeFilePathFromUrlPath(urlPath) {
  if (!urlPath || typeof urlPath !== "string") return null;
  if (!urlPath.startsWith("/file/")) return null;

  const filename = urlPath.slice("/file/".length);

  // չի կարելի "..", "/" կամ "\" ունենալ՝ որ uploads-ից դուրս չգնա
  if (
    !filename ||
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\")
  ) {
    return null;
  }

  return path.join(UPLOAD_DIR, filename);
}

/* ================== MULTER STORAGE ================== */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safe =
      Date.now() + "-" + Math.random().toString(36).slice(2) + ext;
    cb(null, safe);
  },
});

/* ===== formats ===== */
const imageMimes = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/jpg",
  // SVG անջատած ենք թողնում անվտանգության համար
  // "image/svg+xml"
];

const videoMimes = ["video/mp4", "video/webm", "video/ogg"];

// svg-ն էլ ենք հանում ext-երի list-ից
const allowedImageExts = ["png", "jpg", "jpeg", "webp", "gif"];
const allowedVideoExts = ["mp4", "webm", "ogg"];

const fileFilter = (_req, file, cb) => {
  const ext = path
    .extname(file.originalname || "")
    .toLowerCase()
    .replace(".", "");

  const okMime =
    imageMimes.includes(file.mimetype) || videoMimes.includes(file.mimetype);
  const okExt =
    allowedImageExts.includes(ext) || allowedVideoExts.includes(ext);

  if (okMime && okExt) return cb(null, true);

  return cb(
    new Error(
      "Unsupported file type. Allowed images: png,jpg,jpeg,webp,gif; videos: mp4,webm,ogg"
    )
  );
};

// ≤ MAX_UPLOAD_MB (default 20)
const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB || 20);
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 },
});

/* small util to build public origin (https://khcontactum.com կամ backend host) */
function getPublicOrigin(req) {
  // Եթե ունես PUBLIC_ORIGIN env (օր. https://khcontactum.onrender.com)
  // խորհուրդ է՝ backend host-ը դնես:
  if (process.env.PUBLIC_ORIGIN) {
    return process.env.PUBLIC_ORIGIN.replace(/\/+$/, "");
  }
  // fallback՝ ըստ request-ի
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "http";
  const host = req.get("host");
  return `${proto}://${host}`;
}

/**
 * POST /api/upload
 * FormData: file=<blob>, field=<json.path>
 * Example fields:
 *   "logo_url",
 *   "background.imageUrl",
 *   "background.videoUrl",
 *   "avatar.imageUrl"
 *
 * Տրամաբանություն.
 *  1) Մինչև նոր ֆայլ գրելը նայում ենք՝ նույն admin + field-ի համար կա՞ հին path
 *     եթե կա՝ ֆիզիկապես ջնջում ենք persistent disk-ից
 *  2) Նոր ֆայլը պահում ենք UPLOAD_DIR-ում
 *  3) urlPath = "/file/<filename>" գրանցում ենք DB-ում
 */
r.post("/", auth("admin"), (req, res) => {
  upload.single("file")(req, res, async (err) => {
    try {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(413)
            .json({ error: `Ֆայլը մեծ է։ Առավելագույնը ${MAX_UPLOAD_MB}MB է` });
        }
        return res
          .status(400)
          .json({ error: err.message || "Upload failed" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file" });
      }

      const field = (req.body.field || "").trim();
      if (!field) {
        return res.status(400).json({ error: "Missing 'field' parameter" });
      }

      // 1️⃣ նախ վերցնենք տվյալ admin-ի ընթացիկ info-ն
      const { rows } = await pool.query(
        "SELECT information FROM admin_info WHERE admin_id=$1",
        [req.user.admin_id]
      );
      const info = rows[0]?.information || {};

      // գտնենք՝ արդյոք այս field-ի տակ արդեն կա հին path
      const prevUrlPath = getPath(info, field);
      if (prevUrlPath) {
        const oldFilePath = safeFilePathFromUrlPath(prevUrlPath);
        if (oldFilePath && fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath); // 🚀 անմիջապես ջնջում ենք հինը
            console.log("🗑️ Removed old file:", oldFilePath);
          } catch (e) {
            console.warn(
              "⚠️ Couldn't delete old file:",
              oldFilePath,
              e.message
            );
          }
        }
      }

      // 2️⃣ նոր ֆայլը պահվում է persistent disk-ում
      const urlPath = `/file/${req.file.filename}`;
      const origin = getPublicOrigin(req);
      const fullUrl = `${origin}${urlPath}`;

      // 3️⃣ հիմա update ենք անում DB-ի JSONB field-ը նոր path-ով
      setPath(info, field, urlPath);
      await pool.query(
        `INSERT INTO admin_info (admin_id, information, updated_at)
         VALUES ($1, $2, now())
         ON CONFLICT (admin_id) DO UPDATE
         SET information = EXCLUDED.information,
             updated_at  = now()`,
        [req.user.admin_id, info]
      );

      return res.json({
        ok: true,
        url: fullUrl,    // preview-ի համար լիարժեք URL
        path: urlPath,   // DB-ում պահվող հարաբերական path
        field,
        mime: req.file.mimetype,
        size: req.file.size,
        information: info,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message || "Upload failed" });
    }
  });
});

export default r;
