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

const app = express();
const PORT = process.env.PORT || 5050;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const DATA_DIR   = path.join(__dirname, "../data");

// ✅ իրական client IP-ների համար (Nginx / Cloudflare-ի հետևում)
app.set("trust proxy", process.env.TRUST_PROXY ? 1 : 0);

/* ✅ Helmet — թույլ ենք տալիս cross-origin resources (նկար, video)
   որ կարողանաս օգտագործել դրանք localhost:5173 front-end-ում */
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // dev-ում անջատված; production-ում կարող ես խստացնել
  })
);

// ✅ CORS / body
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// mini logger
app.use((req, _res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );
  next();
});

// health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// debug ping
app.get("/api/ping", (_req, res) =>
  res.json({ ok: true, via: "server" })
);

/* ===== ROUTES (ORDER MATTERS) ===== */
app.use("/api/public",     publicRoutes);
app.use("/api/superadmin", superadminRoutes);
app.use("/api/admin",      adminRoutes);
app.use("/api/admin",      passwordRoutes); // թողնում եմ ինչպես ունեիր
app.use("/api/upload",     uploadRoutes);

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
  console.log(`Server on http://localhost:${PORT}`);
  console.log(`Allowed CORS origin: ${CLIENT_ORIGIN}`);
});
