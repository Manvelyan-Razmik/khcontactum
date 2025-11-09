// server/src/routes/password.js
import { Router } from "express";
import bcrypt from "bcryptjs";
import { auth } from "../middleware/auth.js";
import { pool } from "../db.js";

const r = Router();

/* quick ping to verify mount */
r.get("/password/ping", (_req, res) => res.json({ ok: true }));

r.use((req, _res, next) => {
  if (req.path.startsWith("/password")) {
    console.log("📍 password router:", req.method, req.path);
  }
  next();
});

function validatePassword(p = "") {
  return {
    len: p.length >= 8,
    low: /[a-z\u0561-\u0587]/.test(p),
    up:  /[A-Z\u0531-\u0556]/.test(p),
    num: /\d/.test(p),
    sym: /[^A-Za-z0-9\u0531-\u0556\u0561-\u0587]/.test(p),
  };
}

/**
 * PATCH /api/admin/password
 * Body: { old_password, new_password }
 * Auth: Bearer (admin)
 */
r.patch("/password", auth("admin"), async (req, res) => {
  try {
    const { old_password, new_password } = req.body || {};
    if (!old_password || !new_password) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    // ✅ JWT payload-ից admin_id
    const adminId = req.user?.admin_id;
    if (!adminId) return res.status(401).json({ error: "Unauthorized" });

    const meRes = await pool.query(
      "SELECT id, card_id, password_hash FROM admins WHERE id = $1",
      [adminId]
    );
    const me = meRes.rows[0];
    if (!me) return res.status(404).json({ error: "Not Found" });

    const okOld =
      me.password_hash && (await bcrypt.compare(old_password, me.password_hash));
    if (!okOld) return res.status(401).json({ error: "Հին գաղտնաբառը սխալ է" });

    const v = validatePassword(new_password);
    if (!(v.len && v.low && v.up && v.num && v.sym)) {
      return res
        .status(400)
        .json({ error: "Գաղտնաբառը չի բավարարում պահանջներին" });
    }
    if (old_password === new_password) {
      return res
        .status(400)
        .json({ error: "Նոր գաղտնաբառը պետք է տարբերվի հնից" });
    }

    const others = await pool.query(
      "SELECT password_hash FROM admins WHERE card_id = $1 AND id <> $2 AND password_hash IS NOT NULL",
      [me.card_id, me.id]
    );
    for (const row of others.rows) {
      if (
        row.password_hash &&
        (await bcrypt.compare(new_password, row.password_hash))
      ) {
        return res
          .status(409)
          .json({ error: "Այս գաղտնաբառը արդեն օգտագործվում է մեկ այլ ադմինի կողմից" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(new_password, salt);
    await pool.query(
      "UPDATE admins SET password_hash = $1, updated_at = NOW() WHERE id = $2",
      [hash, me.id]
    );

    return res.json({ ok: true });
  } catch (e) {
    console.error("PATCH /api/admin/password:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

export default r;
