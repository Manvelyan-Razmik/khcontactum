// server/src/routes/admin.js
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const r = Router();

/* ---------- helpers for exporting public card json ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const DATA_DIR   = path.join(__dirname, "../data");
const CARDS_DIR  = path.join(DATA_DIR, "public", "cards");

async function ensureDirs() {
  await fs.promises.mkdir(CARDS_DIR, { recursive: true });
}
function cardJsonPath(cardId) {
  return path.join(CARDS_DIR, `${cardId}.json`);
}
async function writeCardJson(cardId, payload) {
  await ensureDirs();
  const p = cardJsonPath(cardId);
  await fs.promises.writeFile(p, JSON.stringify(payload, null, 2), "utf8");
  return p;
}

/* ============================================================
   LOGIN PROTECTION — 3 րոպեում 7 սխալ → 30 րոպե lock մեկ IP-ի համար
   ============================================================ */

const MAX_FAILS       = 7;
const WINDOW_MINUTES  = 3;
const LOCK_MINUTES    = 30;
const loginAttempts   = new Map(); // key: ip => { fails, first, lockUntil }

function getClientIp(req) {
  const xfwd = req.headers["x-forwarded-for"];
  if (typeof xfwd === "string" && xfwd.length > 0) {
    return xfwd.split(",")[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || "unknown";
}

function getRecord(ip) {
  const now = Date.now();
  let rec = loginAttempts.get(ip);
  if (!rec) {
    rec = { fails: 0, first: now, lockUntil: 0 };
    loginAttempts.set(ip, rec);
    return rec;
  }
  // reset window
  if (now - rec.first > WINDOW_MINUTES * 60 * 1000) {
    rec.fails = 0;
    rec.first = now;
    rec.lockUntil = 0;
  }
  return rec;
}

function isLocked(rec) {
  return rec.lockUntil && rec.lockUntil > Date.now();
}

/* ============================================================
   AUTH: /login
   ============================================================ */

r.post("/login", async (req, res) => {
  const ip  = getClientIp(req);
  const rec = getRecord(ip);

  if (isLocked(rec)) {
    const leftMin = Math.ceil((rec.lockUntil - Date.now()) / 60000);
    return res.status(429).json({
      error: `Շատ սխալ մուտքի փորձեր այս IP-ից։ Փորձիր ${leftMin} րոպե հետո։`,
    });
  }

  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "username+password required" });
  }

  try {
    const { rows } = await pool.query(
      "SELECT id, username, password_hash, is_active FROM admins WHERE username=$1",
      [username]
    );
    const a = rows[0];

    if (!a || !a.is_active) {
      rec.fails++;
    } else {
      const ok = await bcrypt.compare(password, a.password_hash || "");
      if (!ok) {
        rec.fails++;
      } else {
        // ✅ հաջող login → զրոյացնում ենք fail counter-ը
        rec.fails = 0;
        rec.lockUntil = 0;

        const token = jwt.sign(
          { role: "admin", admin_id: a.id },
          process.env.JWT_SECRET,
          { expiresIn: "2d" } // թողնում եմ քո նախնական արժեքը
        );

        loginAttempts.set(ip, rec);
        return res.json({
          token,
          admin: { id: a.id, username: a.username },
        });
      }
    }

    // եթե արդեն 7 կամ ավելի սխալ է 3 րոպեի window-ի մեջ → 30 րոպե lock
    if (rec.fails >= MAX_FAILS) {
      rec.lockUntil = Date.now() + LOCK_MINUTES * 60 * 1000;
    }
    loginAttempts.set(ip, rec);

    return res.status(401).json({ error: "Bad creds" });
  } catch (e) {
    console.error("Admin login error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

/* ============================================================
   /me  (admin profile, items, info)
   ============================================================ */

r.get("/me", auth("admin"), async (req, res) => {
  const adminId = req.user.admin_id;

  // admins table
  const { rows: arows } = await pool.query(
    "SELECT id, username, card_id, is_active FROM admins WHERE id=$1",
    [adminId]
  );
  const admin = arows[0];

  // admin_profiles table
  const { rows: prows } = await pool.query(
    `SELECT display_name, headline, bio, contacts, updated_at
     FROM admin_profiles
     WHERE admin_id=$1`,
    [adminId]
  );
  const profile =
    prows[0] || {
      display_name: "",
      headline    : "",
      bio         : "",
      contacts    : {},
      updated_at  : null
    };

  // admin_items table
  const { rows: irows } = await pool.query(
    `SELECT id, title, body, link_url, created_at, updated_at
     FROM admin_items
     WHERE admin_id=$1
     ORDER BY id DESC`,
    [adminId]
  );

  // admin_info table
  const { rows: jrows } = await pool.query(
    `SELECT information, created_at, updated_at
     FROM admin_info
     WHERE admin_id=$1`,
    [adminId]
  );
  const info = jrows[0]?.information || {};

  res.json({
    admin,
    profile,
    items: irows,
    info
  });
});

/* ============================================================
   ITEMS CRUD
   ============================================================ */

r.post("/items", auth("admin"), async (req, res) => {
  const adminId = req.user.admin_id;
  const { title = "", body = "", link_url = null } = req.body || {};

  const { rows } = await pool.query(
    `INSERT INTO admin_items (admin_id, title, body, link_url)
     VALUES ($1,$2,$3,$4)
     RETURNING id, title, body, link_url, created_at, updated_at`,
    [adminId, title, body, link_url]
  );

  res.status(201).json(rows[0]);
});

r.patch("/items/:id", auth("admin"), async (req, res) => {
  const adminId = req.user.admin_id;
  const id = Number(req.params.id);
  const { title, body, link_url } = req.body || {};

  const { rows } = await pool.query(
    `UPDATE admin_items
     SET title=COALESCE($1,title),
         body=COALESCE($2,body),
         link_url=$3,
         updated_at=now()
     WHERE id=$4 AND admin_id=$5
     RETURNING id, title, body, link_url, created_at, updated_at`,
    [title ?? null, body ?? null, link_url ?? null, id, adminId]
  );

  if (!rows[0]) {
    return res.status(404).json({ error: "Not found" });
  }
  res.json(rows[0]);
});

r.delete("/items/:id", auth("admin"), async (req, res) => {
  const adminId = req.user.admin_id;
  const id = Number(req.params.id);

  await pool.query(
    "DELETE FROM admin_items WHERE id=$1 AND admin_id=$2",
    [id, adminId]
  );

  res.json({ ok: true });
});

/* ============================================================
   INFO JSON (admin_info.information)
   ============================================================ */

r.get("/info", auth("admin"), async (req, res) => {
  const adminId = req.user.admin_id;

  const { rows } = await pool.query(
    `SELECT information, created_at, updated_at
     FROM admin_info
     WHERE admin_id=$1`,
    [adminId]
  );
  const information = rows[0]?.information || {};

  const { rows: arows } = await pool.query(
    "SELECT card_id FROM admins WHERE id=$1",
    [adminId]
  );
  const card_id = arows[0]?.card_id || null;

  res.json({
    card_id,
    information
  });
});

r.put("/info", auth("admin"), async (req, res) => {
  const adminId  = req.user.admin_id;
  const incoming = req.body || {};

  try {
    const curRow = await pool.query(
      "SELECT information FROM admin_info WHERE admin_id=$1",
      [adminId]
    );
    const current = curRow.rows?.[0]?.information || {};

    const next = {
      ...current,
      ...incoming
    };

    const upsert = `
      INSERT INTO admin_info (admin_id, information)
      VALUES ($1, $2::jsonb)
      ON CONFLICT (admin_id) DO UPDATE
      SET information = EXCLUDED.information,
          updated_at  = NOW()
      RETURNING information, created_at, updated_at
    `;
    const { rows: irows } = await pool.query(upsert, [
      adminId,
      JSON.stringify(next)
    ]);
    const information = irows[0]?.information || next;

    const { rows: arows } = await pool.query(
      "SELECT card_id FROM admins WHERE id=$1",
      [adminId]
    );
    const card_id = arows[0]?.card_id;
    if (!card_id) {
      return res
        .status(400)
        .json({ error: "card_id not set for this admin" });
    }

    const filePayload = {
      card_id,
      updated_at: new Date().toISOString(),
      information
    };
    const filePath = await writeCardJson(card_id, filePayload);

    res.json({
      ok: true,
      card_id,
      information,
      json_file: {
        path: filePath,
        public_url: `/public-data/cards/${card_id}.json`
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default r;
