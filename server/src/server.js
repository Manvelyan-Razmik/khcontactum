// server/src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

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

// ✅ Թույլատրած origin-ներ (comma-separated env → array)
const CLIENT_ORIGINS = (
  process.env.CLIENT_ORIGIN ||
  "http://localhost:5173,https://khcontactum.com,https://www.khcontactum.com"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// trust proxy flag (Render-ում TRUST_PROXY=1, development-ում՝ 0 կամ դատարկ)
const TRUST_PROXY_ENABLED = process.env.TRUST_PROXY === "1";

// __dirname setup (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../data");

// ✅ Check DB connection once on startup (doesn't stop server if fails)
(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL connected at:", res.rows[0].now);
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
  }
})();

// ✅ իրական client IP-ների համար (Nginx / Cloudflare / Render proxy)
app.set("trust proxy", TRUST_PROXY_ENABLED ? 1 : 0);

/* ✅ Helmet — թույլ ենք տալիս cross-origin resources (նկար, video)
   որ կարողանաս օգտագործել դրանք front-end-ում */
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // dev-ում անջատված; production-ում կարող ես խստացնել
  })
);

// ✅ CORS config — բազմակի origin + preflight support
const corsOptions = {
  origin(origin, cb) {
    // Postman / curl / health-check-եր origin չեն ուղարկում
    if (!origin) return cb(null, true);

    if (CLIENT_ORIGINS.includes(origin)) {
      return cb(null, true);
    }

    console.warn("❌ Blocked by CORS:", origin);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

// ⬇️ Գլոբալ CORS middleware (preflight-երը արդեն ինքը կսպասարկի)
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// mini logger
app.use((req, _res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );
  next();
});

// 👉 ROOT route
app.get("/", (_req, res) => {
  res
    .status(200)
    .send("✅ KHContactum backend is running. Try /api/health for JSON.");
});

// health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// debug ping
app.get("/api/ping", (_req, res) =>
  res.json({ ok: true, via: "server" })
);

/* ===== ROUTES (ORDER MATTERS) ===== */
app.use("/api/public", publicRoutes);
app.use("/api/superadmin", superadminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", passwordRoutes); // ինչպես ունեիր
app.use("/api/upload", uploadRoutes);

// static jsons (public data)
app.use("/public-data", express.static(path.join(DATA_DIR, "public")));

// serve uploaded files: /file/<name>
app.use(
  "/file",
  (req, res, next) => {
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Cache-Control", "public, max-age=604800, immutable");
    next();
  },
  express.static(path.join(process.cwd(), "uploads"))
);

// API 404
app.use("/api", (_req, res) =>
  res.status(404).json({ error: "Not Found" })
);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log("✅ Allowed CORS origins:", CLIENT_ORIGINS);
  console.log(
    `🔧 trust proxy: ${TRUST_PROXY_ENABLED ? "enabled (1)" : "disabled (0)"}`
  );
});
