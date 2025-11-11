// server/src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";

import publicRoutes from "./routes/public.js";
import superadminRoutes from "./routes/superadmin.js";
import adminRoutes from "./routes/admin.js";
import passwordRoutes from "./routes/password.js";
import uploadRoutes from "./routes/upload.js";

import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db.js";

const app = express();
const PORT = process.env.PORT || 5050;

/* ================== CORS ORIGINS ================== */
/**
 * CLIENT_ORIGIN env-ը կարող է լինել
 * "https://khcontactum.com"
 * կամ comma-separated list:
 * "http://localhost:5173,https://khcontactum.com"
 */
const RAW_ORIGINS =
  process.env.CLIENT_ORIGIN ||
  "http://localhost:5173,https://khcontactum.com,https://www.khcontactum.com";

const ALLOWED_ORIGINS = RAW_ORIGINS.split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// trust proxy flag (Render-ում TRUST_PROXY=1, development-ում՝ 0 կամ դատարկ)
const TRUST_PROXY_ENABLED = process.env.TRUST_PROXY === "1";

/* ================== PATHS ================== */

// __dirname setup (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../data");
const CLIENT_DIST = path.join(__dirname, "../../client/dist");

// 👇 Նոր՝ upload-ների իրական ֆոլդերը (persistent disk-ի համար)
const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

/* ================== DB CHECK ================== */

// ✅ Check DB connection once on startup (doesn't stop server if fails)
(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL connected at:", res.rows[0].now);
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
  }
})();

/* ================== APP SETUP ================== */

// ✅ իրական client IP-ների համար (Nginx / Cloudflare / Render proxy)
app.set("trust proxy", TRUST_PROXY_ENABLED ? 1 : 0);

// gzip compression — փոքր response-ներ, արագ բեռնում
app.use(compression());

/* ✅ Helmet — թույլ ենք տալիս cross-origin resources (նկար, video),
   որ կարողանաս օգտագործել դրանք front-end-ում */
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // dev-ում անջատված; production-ում կարող ես խստացնել
  })
);

/* ================== CORS ================== */

const corsOptions = {
  origin(origin, cb) {
    // Postman / curl / Render health-check-եր origin չեն ուղարկում
    if (!origin) return cb(null, true);

    if (ALLOWED_ORIGINS.includes(origin)) {
      return cb(null, true);
    }

    // Debug-ի համար՝ log, բայց չենք կտրում request-ը
    console.warn("⚠️ CORS: non-whitelisted origin:", origin);
    return cb(null, true);
  },
  credentials: true,
};

// Գլոբալ CORS middleware (OPTIONS-ներն էլ կընդունի)
app.use(cors(corsOptions));

/* ================== BODY & COOKIES ================== */

app.use(express.json());
app.use(cookieParser());

/* ================== MINI LOGGER ================== */

app.use((req, _res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );
  next();
});

/* ================== BASIC ROUTES ================== */

// 👉 ROOT route (ավելի շատ health-check-ի համար)
app.get("/", (_req, res) => {
  res
    .status(200)
    .send("✅ KHContactum backend is running. Try /api/health for JSON.");
});

// health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// debug ping
app.get("/api/ping", (_req, res) => res.json({ ok: true, via: "server" }));

/* ================== API ROUTES ================== */
// (ORDER MATTERS)
app.use("/api/public", publicRoutes);
app.use("/api/superadmin", superadminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", passwordRoutes); // ինչպես ունեիր
app.use("/api/upload", uploadRoutes);

/* ================== STATIC FILES ================== */

// static jsons (public data)
app.use("/public-data", express.static(path.join(DATA_DIR, "public")));

// serve uploaded files: /file/<name>
app.use(
  "/file",
  (req, res, next) => {
    res.setHeader("Accept-Ranges", "bytes");
    // Cache 7 օր + immutable (յուրաքանչյուր նոր upload՝ նոր URL)
    res.setHeader("Cache-Control", "public, max-age=604800, immutable");
    next();
  },
  // 👇 Այստեղ արդեն նույն UPLOAD_DIR-ն ենք օգտագործում
  express.static(UPLOAD_DIR)
);

/* ================== API 404 ================== */

app.use("/api", (_req, res) => res.status(404).json({ error: "Not Found" }));

/* ================== REACT BUILD (PRODUCTION) ================== */

if (process.env.NODE_ENV === "production") {
  // Serve client build (Vite)՝ client/dist-ից
  app.use(express.static(CLIENT_DIST));

  // SPA fallback — բոլոր մնացած ուղիների համար (ոչ /api, ոչ /file),
  // այստեղ այլևս "*" չենք օգտագործում, որ path-to-regexp-ը error չտա
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(CLIENT_DIST, "index.html"));
  });
}

/* ================== START SERVER ================== */

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log("✅ Allowed CORS origins:", ALLOWED_ORIGINS);
  console.log(
    `🔧 trust proxy: ${TRUST_PROXY_ENABLED ? "enabled (1)" : "disabled (0)"}`
  );
  console.log(`💾 Upload dir: ${UPLOAD_DIR}`);
});
