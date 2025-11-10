// client/src/components/BrandsPage.js
import React from "react";
import "./Responcive.css";
import { API } from "../api.js";

const h = React.createElement;

/* ---------- helpers ---------- */
function absLogo(u = "") {
  if (!u) return "";

  // Եթե data/blob URL է, 그대로 թողնում ենք
  if (/^(data:|blob:)/i.test(u)) return u;

  let s = String(u).trim();

  // հին "server/..." ուղիների support
  s = s.replace(/^server\//i, "");

  // Եթե արդեն absolute http/https URL է
  if (/^https?:\/\//i.test(s)) {
    try {
      const url = new URL(s);

      // Եթե http է, վերածում ենք https-ի, որ https էջում mixed content չլինի
      if (url.protocol === "http:") {
        url.protocol = "https:";
      }
      return url.toString();
    } catch {
      // եթե ինչ-որ պատճառներով URL-ը չի parseվում, 그대로 վերադարձնում ենք
      return s;
    }
  }

  // Հարակից path — դարձնում ենք "/..."
  if (!s.startsWith("/")) s = "/" + s;

  // 1) Փորձում ենք API-ից վերցնել origin-ը ( напр. https://khcontactum.onrender.com )
  if (API) {
    try {
      const apiUrl = new URL(API);
      return apiUrl.origin + s;
    } catch (e) {
      console.warn("absLogo: bad API, fallback to window.origin", API, e);
    }
  }

  // 2) fallback — նույն domain-ը, որով կայքը բացված է ( напр. https://khcontactum.com )
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin + s;
  }

  // 3) Վերջին fallback — վերադարձնում ենք հարաբերական path-ը
  return s;
}

function pickLang(v, lang, fallbacks = ["am", "en", "ru", "ar", "fr"]) {
  if (!v) return "";
  if (typeof v === "string") return v;
  const order = [lang, ...fallbacks.filter((x) => x !== lang)];
  for (const k of order) {
    const s = v?.[k];
    if (s && String(s).trim()) return String(s).trim();
  }
  return "";
}

/**
 * Props:
 * - brands: [{ name, href, logo, linkType, keyword }]
 * - brandsTitleColor
 * - brandsTitleText
 * - brandsNameColor
 * - brandsCols: 1 | 2 | 3
 * - brandsBgColor (for cols=1)
 * - lang
 * - onKeywordClick(keyword) – optional
 */
export default function BrandsPage({
  brands = [],
  brandsTitleColor = "#000000",
  brandsTitleText = "ՄԵՐ ԲՐԵՆԴՆԵՐԸ",
  brandsNameColor = "#000000",
  brandsCols = 3,
  brandsBgColor = "#ffffff",
  lang = "am",
  onKeywordClick,
}) {
  if (!Array.isArray(brands) || !brands.length) return null;

  const cols = Math.max(1, Math.min(3, Number(brandsCols) || 3));
  const titleText = pickLang(brandsTitleText, lang) || "ՄԵՐ ԲՐԵՆԴՆԵՐԸ";

  /* === ONE COLUMN MODE === */
  if (cols === 1) {
    return h(
      "section",
      { className: "brands-public", style: { padding: "10px 12px" } },

      h(
        "h2",
        {
          className: "company-title",
          style: {
            margin: "6px 0 14px",
            color: brandsTitleColor,
            textAlign: "center",
            fontWeight: 700,
          },
        },
        titleText
      ),

      h(
        "div",
        {
          style: { display: "grid", gap: 10, maxWidth: 560, margin: "0 auto" },
        },
        ...brands.map((b, i) => {
          const name = pickLang(b?.name, lang);
          const href = (b?.href || "").trim();
          const keyword = (b?.keyword || "").trim();
          const linkType =
            b?.linkType || (keyword ? "keyword" : href ? "url" : "keyword");

          const clickable =
            (linkType === "keyword" && keyword && onKeywordClick) ||
            (linkType === "url" && href);

          const onClick = () => {
            if (linkType === "keyword" && keyword && onKeywordClick) {
              onKeywordClick(keyword);
            } else if (linkType === "url" && href) {
              window.open(href, "_blank", "noopener,noreferrer");
            }
          };

          return h(
            "div",
            {
              key: i,
              className: "brand-item",
              style: {
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "10px 12px",
                borderRadius: 14,
                background: brandsBgColor,
                boxShadow: "0 1px 4px rgba(0,0,0,.05)",
                cursor: clickable ? "pointer" : "default",
              },
              onClick,
            },
            h(
              "div",
              {
                style: {
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "#f4f4f4",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                },
              },
              b.logo
                ? h("img", {
                    src: absLogo(b.logo),
                    alt: name || "brand",
                    style: {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    },
                  })
                : h(
                    "span",
                    {
                      style: {
                        color: "#777",
                        fontWeight: 700,
                        fontSize: 16,
                      },
                    },
                    (name || "?").slice(0, 2).toUpperCase()
                  )
            ),
            h(
              "span",
              {
                style: {
                  fontWeight: 700,
                  fontSize: 15,
                  color: brandsNameColor,
                },
              },
              name || ""
            )
          );
        })
      ),

      h(
        "style",
        null,
        `.brand-item{transition:transform .15s ease}
         .brand-item:hover{transform:translateY(-1px);}`
      )
    );
  }

  /* === MULTI-COLUMN GRID === */
  return h(
    "section",
    { className: "brands-public", style: { padding: "10px 12px" } },

    h(
      "h2",
      {
        className: "company-title",
        style: {
          margin: "20px 0 40px",
          color: brandsTitleColor,
          textAlign: "center",
          fontWeight: 700,
          fontSize: 28,
        },
      },
      titleText
    ),

    h(
      "div",
      { style: { display: "flex", justifyContent: "center" } },
      h(
        "div",
        {
          className: "brands-grid",
          style: {
            display: "grid",
            gap: 16,
            justifyContent: "center",
            gridTemplateColumns:
              cols === 2 ? "repeat(2, 120px)" : "repeat(3, 110px)",
          },
        },
        ...brands.map((b, i) => {
          const name = pickLang(b?.name, lang);
          const href = (b?.href || "").trim();
          const keyword = (b?.keyword || "").trim();
          const linkType =
            b?.linkType || (keyword ? "keyword" : href ? "url" : "keyword");

          const isKeyword = linkType === "keyword" && keyword && onKeywordClick;
          const isUrl = linkType === "url" && href;

          const handleClick = (e) => {
            if (isKeyword) {
              e.preventDefault();
              onKeywordClick(keyword);
            }
          };

          return h(
            "a",
            {
              key: i,
              href: isUrl ? href : "#",
              target: isUrl ? "_blank" : undefined,
              rel: isUrl ? "noreferrer" : undefined,
              className: "brand-card",
              onClick: handleClick,
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                transition: "transform .18s ease",
                cursor: isKeyword || isUrl ? "pointer" : "default",
              },
            },
            h(
              "div",
              {
                style: {
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  background: "#f1f1f1",
                  display: "grid",
                  placeItems: "center",
                  overflow: "hidden",
                  boxShadow: "0 1px 6px rgba(0,0,0,.12)",
                },
              },
              b.logo
                ? h("img", {
                    src: absLogo(b.logo),
                    alt: name || "brand",
                    style: {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    },
                  })
                : h(
                    "span",
                    {
                      style: {
                        color: "#777",
                        fontWeight: 700,
                        fontSize: 18,
                      },
                    },
                    (name || "?").slice(0, 2).toUpperCase()
                  )
            ),
            h(
              "span",
              {
                style: {
                  marginTop: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: "center",
                  lineHeight: 1.25,
                  maxWidth: 160,
                  color: brandsNameColor,
                },
              },
              name || ""
            )
          );
        })
      )
    ),

    h(
      "style",
      null,
      `.brand-card:hover{transform:translateY(-2px)}
       @media(min-width:480px){.brands-grid{gap:18px}}`
    )
  );
}
