// server/src/routes/upload.js
import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { auth } from "../middleware/auth.js";
import { pool } from "../db.js";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ==== storage ====
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safe = Date.now() + "-" + Math.random().toString(36).slice(2) + ext;
    cb(null, safe);
  }
});

/* ===== formats ===== */
const imageMimes = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/jpg"
  // SVG անջատած ենք թողնում անվտանգության համար
  // "image/svg+xml"
];

const videoMimes = [
  "video/mp4",
  "video/webm",
  "video/ogg"
];

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
  limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 }
});

/* small util to set nested path */
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

const r = Router();

/**
 * POST /api/upload
 * FormData: file=<blob>, field=<json.path>
 * Example fields: "logo_url", "background.imageUrl", "background.videoUrl", "avatar.imageUrl"
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

      const url = `/file/${req.file.filename}`;
      const field = (req.body.field || "").trim();

      let information = null;

      if (field) {
        const { rows } = await pool.query(
          "SELECT information FROM admin_info WHERE admin_id=$1",
          [req.user.admin_id]
        );
        const info = rows[0]?.information || {};

        // background.imageUrl, avatar.videoUrl և այլն
        setPath(info, field, url);

        await pool.query(
          `INSERT INTO admin_info (admin_id, information, updated_at)
           VALUES ($1, $2, now())
           ON CONFLICT (admin_id) DO UPDATE
           SET information = EXCLUDED.information,
               updated_at  = now()`,
          [req.user.admin_id, info]
        );
        information = info;
      }

      return res.json({
        ok: true,
        url,
        mime: req.file.mimetype,
        size: req.file.size,
        field: field || null,
        information
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message || "Upload failed" });
    }
  });
});

export default r;
