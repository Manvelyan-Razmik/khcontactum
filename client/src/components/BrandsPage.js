// client/src/components/BrandsPage.js
import React from "react";
import "./Responcive.css";
import { API } from "../api.js";

const h = React.createElement;

/* ---------- helpers ---------- */
function absLogo(u = "") {
  if (!u) return "";
  if (/^(data:|https?:\/\/|blob:)/i.test(u)) return u;
  let clean = String(u).trim().replace(/^server\//i, "");
  if (!clean.startsWith("/")) clean = "/" + clean;
  try {
    const apiUrl = new URL(API);
    return `${apiUrl.origin}${clean}`;
  } catch {
    return clean;
  }
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

/* Թույլ «զում», որ սպիտակ անկյունները դուրս մնան շրջանի կտրվածքից */
const CROP_ZOOM = 1.1; // 1.08–1.12 միջակայքը OK է

/**
 * Props:
 * - brands: [{ name, href, logo, linkType, keyword }]
 * - brandsTitleColor
 * - brandsTitleText
 * - brandsNameColor
 * - brandsCols: 1 | 2 | 3
 * - brandsBgColor (for cols=1 list row bg)
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
        { style: { display: "grid", gap: 10, maxWidth: 560, margin: "0 auto" } },
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
            if (linkType === "keyword" && keyword && onKeywordClick) onKeywordClick(keyword);
            else if (linkType === "url" && href) window.open(href, "_blank", "noopener,noreferrer");
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
                cursor: clickable ? "pointer" : "default",
              },
              onClick,
            },
            // ⬇️ Կոմպակտ շրջանաձև լոգո՝ crop-ով
            h(
              "div",
              {
                style: {
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  background: "#111", // խուսափում է բարակ լուսավոր եզրից
                },
              },
              b.logo
                ? h("img", {
                    src: absLogo(b.logo),
                    alt: name || "brand",
                    loading: "lazy",
                    style: {
                      width: `${CROP_ZOOM * 100}%`,
                      height: `${CROP_ZOOM * 100}%`,
                      objectFit: "cover",
                      objectPosition: "50% 50%",
                      display: "block",
                    },
                  })
                : h(
                    "span",
                    { style: { color: "#bbb", fontWeight: 700, fontSize: 16 } },
                    (name || "?").slice(0, 2).toUpperCase()
                  )
            ),
            h(
              "span",
              { style: { fontWeight: 700, fontSize: 15, color: brandsNameColor } },
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
              rel: isUrl ? "noopener noreferrer" : undefined,
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
            // ⬇️ Շրջանաձև container + crop zoom
            h(
              "div",
              {
                style: {
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "#111",
                  display: "grid",
                  placeItems: "center",
                },
              },
              b.logo
                ? h("img", {
                    src: absLogo(b.logo),
                    alt: name || "brand",
                    loading: "lazy",
                    style: {
                      width: `${CROP_ZOOM * 100}%`,
                      height: `${CROP_ZOOM * 100}%`,
                      objectFit: "cover",
                      objectPosition: "50% 50%",
                      display: "block",
                    },
                  })
                : h(
                    "span",
                    { style: { color: "#bbb", fontWeight: 700, fontSize: 18 } },
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
