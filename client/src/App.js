// client/src/App.js
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import SuperAdminLogin from "./pages/SuperAdminLogin.js";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.js";
import AdminLogin from "./pages/AdminLogin.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import PublicPage from "./pages/PublicPage.js";

const h = React.createElement;
const API = import.meta.env.VITE_API_BASE || "http://localhost:5050";

// match only "/{digits}" → return that card_id or null
function parseCardPath(path) {
  const m = path.match(/^\/(\d+)$/);
  return m ? m[1] : null;
}

export default function App() {
  const [superToken, setSuperToken] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [adminLang, setAdminLang] = useState("en");

  // ✅ Restore ONLY from sessionStorage (այսուհետ localStorage չենք օգտագործում)
  useEffect(() => {
    try {
      const at = sessionStorage.getItem("adminToken") || "";
      if (at) setAdminToken(at);

      const st = sessionStorage.getItem("superToken") || "";
      if (st) setSuperToken(st);

      const lang = sessionStorage.getItem("adminLang") || "";
      if (lang) setAdminLang(lang);
    } catch {}
  }, []);

  // ✅ Idle timeout — 30ր անգործության դեպքում ավտոմատ logout է անում
  useEffect(() => {
    const IDLE_MS = 30 * 60 * 1000; // 30 րոպե
    let timerId = null;

    const resetTimer = () => {
      if (timerId) clearTimeout(timerId);

      // եթե login չկա, ընդհանրապես չպահենք timer
      if (!adminToken && !superToken) return;

      timerId = setTimeout(() => {
        // ավտոմատ logout՝ և admin-ի, և superadmin-ի
        try {
          sessionStorage.removeItem("adminToken");
          sessionStorage.removeItem("superToken");
        } catch {}

        setAdminToken("");
        setSuperToken("");
      }, IDLE_MS);
    };

    const events = ["click", "keydown", "mousemove", "scroll", "touchstart"];

    events.forEach((ev) => window.addEventListener(ev, resetTimer));
    // սկսելու համար մեկ անգամ կանչենք
    resetTimer();

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
      if (timerId) clearTimeout(timerId);
    };
  }, [adminToken, superToken]);

  // for public card check
  const [cardCheck, setCardCheck] = useState({ id: null, ok: null }); // ok: true/false/null

  const path = location.pathname;
  const cardId = parseCardPath(path);

  // when on "/{card_id}" check existence in DB
  useEffect(() => {
    if (!cardId) {
      if (cardCheck.id !== null) setCardCheck({ id: null, ok: null });
      return;
    }
    let cancelled = false;
    setCardCheck({ id: cardId, ok: null });
    (async () => {
      try {
        const r = await fetch(
          `${API}/api/public/c/${encodeURIComponent(cardId)}`
        );
        if (!cancelled) setCardCheck({ id: cardId, ok: r.ok });
      } catch {
        if (!cancelled) setCardCheck({ id: cardId, ok: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cardId]);

  // ----- "/{card_id}" -> Public UI only if exists -----
  if (cardId) {
    if (cardCheck.id === cardId && cardCheck.ok === true) {
      return h(PublicPage, { cardId });
    }
    // not found or still checking -> show nothing
    return null;
  }

  // ----- "/SARS" -> Super Admin (մնում է noindex) -----
  if (path === "/SARS") {
    if (!superToken)
      return h(
        React.Fragment,
        null,
        h(
          Helmet,
          null,
          h("title", null, "MainSA | KHContactum"),
          h("meta", { name: "robots", content: "noindex,nofollow" })
        ),
        h(SuperAdminLogin, {
          onSuccess: (t) => {
            try {
              // ✅ պահում ենք միայն sessionStorage-ում
              sessionStorage.setItem("superToken", t);
            } catch {}
            setSuperToken(t);
          },
        })
      );

    return h(
      React.Fragment,
      null,
      h(
        Helmet,
        null,
        h("title", null, "MainSA | KHContactum"),
        h("meta", { name: "robots", content: "noindex,nofollow" })
      ),
      h(SuperAdminDashboard, {
        token: superToken,
        onLogout: () => {
          try {
            sessionStorage.removeItem("superToken");
          } catch {}
          setSuperToken("");
        },
      })
    );
  }

  // ----- "/" -> Admin area (Main | KHContactum, առանց noindex) -----
  if (path === "/") {
    if (!adminToken)
      return h(
        React.Fragment,
        null,
        h(
          Helmet,
          null,
          h("title", null, "Main | KHContactum")
        ),
        h(AdminLogin, {
          lang: adminLang,
          onLangChange: (code) => {
            setAdminLang(code);
            try {
              // ✅ լեզուն նույնպես միայն sessionStorage
              sessionStorage.setItem("adminLang", code);
            } catch {}
          },
          onSuccess: (t) => {
            try {
              sessionStorage.setItem("adminToken", t);
            } catch {}
            setAdminToken(t);
          },
        })
      );

    return h(
      React.Fragment,
      null,
      h(
        Helmet,
        null,
        h("title", null, "Main | KHContactum")
      ),
      h(AdminDashboard, {
        token: adminToken,
        uiLang: adminLang,
        onLogout: () => {
          try {
            sessionStorage.removeItem("adminToken");
          } catch {}
          setAdminToken("");
        },
      })
    );
  }

  // all other routes -> nothing
  return null;
}
