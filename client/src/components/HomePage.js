// client/src/components/HomePage.js
import React from "react";
import { getPublicInfoByCardId, API } from "../api.js";
import "./Responcive.css";

import IconsPage     from "./IconsPage.js";
import BrandsPage    from "./BrandsPage.js";
import BrandInfoPage from "./BrandInfoPage.js";
import SharePage     from "./SharePage.js";

const h = React.createElement;

/* ------------ utils ------------ */
function absSrc(u = "") {
  if (!u) return "";
  // եթե արդեն լիարժեք URL է կամ data/blob է՝ 그대로 թողնում ենք
  if (/^(data:|https?:\/\/|blob:)/i.test(u)) return u;

  const path = u.startsWith("/") ? u : "/" + u;

  // 1) փորձում ենք API-ի միջոցով (Render / backend base)
  if (API) {
    try {
      const apiUrl = new URL(API);      // напр. https://khcontactum.onrender.com
      return apiUrl.origin + path;      // https://khcontactum.onrender.com/file/...
    } catch (e) {
      // եթե API-ն սխալ է, անցնում ենք fallback-ին
      console.warn("absSrc: bad API, falling back to window.origin", API, e);
    }
  }

  // 2) եթե window կա՝ օգտագործում ենք հենց այն domain-ը, որով բացված է կայքը (օր. https://khcontactum.com)
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin + path;
  }

  // 3) վերջին fallback — վերադարձնում ենք ուղղակի հարաբերական path
  return path;
}


function isVideo(u = "") {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(u);
}

function softHyphenate(text, step = 6) {
  if (!text) return "";
  return text.replace(/([\p{L}\p{M}]{7,})/gu, (word) =>
    word.replace(new RegExp("(.{" + step + "})", "g"), "$1\u00AD")
  );
}

function idealColsForLang(lang) {
  switch (lang) {
    case "am":
      return [30, 34];
    case "ru":
      return [32, 38];
    case "en":
      return [36, 42];
    case "ar":
      return [30, 34];
    case "fr":
      return [36, 42];
    default:
      return [34, 40];
  }
}

/* Լեզվի dropdown */
function LangDropdown({ value, onChange, langs = ["am", "ru", "en"] }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onDoc = (e) => {
      if (!e.target.closest?.(".lang-dd")) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return h(
    "div",
    {
      className: "lang-dd",
      style: { position: "absolute", right: 10, top: 10, zIndex: 2 },
    },
    h(
      "button",
      {
        className: "chip active",
        onClick: () => setOpen((v) => !v),
        style: { minWidth: 48 },
      },
      (value || "am").toUpperCase()
    ),

    open &&
      h(
        "div",
        {
          className: "card",
          style: {
            position: "absolute",
            right: 0,
            top: "calc(100% + 6px)",
            padding: 6,
            display: "grid",
            gap: 6,
            zIndex: 3,
          },
        },
        ...langs.map((code) =>
          h(
            "button",
            {
              key: code,
              className: "chip" + (code === value ? " active" : ""),
              onClick: () => {
                localStorage.setItem("lang", code);
                onChange(code);
                setOpen(false);
              },
            },
            code.toUpperCase()
          )
        )
      )
  );
}

/* rgba object -> css rgba() */
function rgbaToCss(obj) {
  if (!obj || typeof obj !== "object") return "";
  const { r = 0, g = 0, b = 0, a = 1 } = obj;
  return (
    "rgba(" +
    ((+r | 0) +
      ", " +
      (+g | 0) +
      ", " +
      (+b | 0) +
      ", " +
      (isFinite(+a) ? +a : 1)) +
    ")"
  );
}

/* i18n pick */
function pickLang(v, lang, fallbacks = ["am", "en", "ru", "ar", "fr"]) {
  if (!v) return "";
  if (typeof v === "string") return v;
  const order = [lang].concat(
    fallbacks.filter(function (x) {
      return x !== lang;
    })
  );
  for (let i = 0; i < order.length; i++) {
    const k = order[i];
    const s = v && v[k];
    if (s && String(s).trim()) return String(s).trim();
  }
  return "";
}

/* ---- common video loop helper ---- */
function VideoLoop({ src, style }) {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;

    const safePlay = () => {
      if (!v) return;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    };

    const onCanPlay = () => safePlay();

    const onEnded = () => {
      if (!v) return;
      v.currentTime = 0;
      safePlay();
    };

    const onPause = () => {
      if (!v) return;
      if (document.visibilityState === "visible") {
        safePlay();
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        safePlay();
      }
    };

    safePlay();

    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("ended", onEnded);
    v.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [src]);

  if (!src) return null;

  return h("video", {
    ref: videoRef,
    src,
    muted: true,
    playsInline: true,
    autoPlay: true,
    preload: "auto",
    disableRemotePlayback: true,
    style,
  });
}

/* Avatar */
function AvatarMedia({ src, isVideo, initials }) {
  const commonStyle = {
    width: 150,
    height: 150,
    borderRadius: "50%",
    objectFit: "cover",
    margin: "0 auto 8px",
    display: "block",
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
  };

  if (!src) {
    return h(
      "div",
      {
        style: {
          ...commonStyle,
          background: "#f2f2f2",
          display: "grid",
          placeItems: "center",
          fontWeight: 700,
          color: "#999",
        },
      },
      (initials || "KH").slice(0, 2).toUpperCase()
    );
  }

  if (!isVideo) {
    return h("img", {
      src,
      alt: "avatar",
      style: commonStyle,
    });
  }

  return h(VideoLoop, {
    src,
    style: commonStyle,
  });
}

/* ------------ component ------------ */
export default function HomePage({ cardId = "101" }) {
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState("");
  const [info, setInfo] = React.useState(null);

  const [lang, setLang] = React.useState(
    (typeof window !== "undefined" ? localStorage.getItem("lang") : "am") ||
      "am"
  );

  const [activeBrandKeyword, setActiveBrandKeyword] = React.useState("");

  React.useEffect(() => {
    let killed = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        const resp = await getPublicInfoByCardId(cardId);
        const data = resp?.data ?? resp ?? {};
        const root = data?.information || data || {};

        if (!killed) {
          setInfo(root);

          if (!localStorage.getItem("lang")) {
            const def =
              root &&
              root.default_lang &&
              Array.isArray(root.available_langs)
                ? root.available_langs.includes(root.default_lang)
                  ? root.default_lang
                  : undefined
                : undefined;
            if (def) setLang(def);
          }
        }
      } catch (e) {
        if (!killed) setErr(e.message || "Error");
      } finally {
        if (!killed) setLoading(false);
      }
    })();
    return function cleanup() {
      killed = true;
    };
  }, [cardId]);

  if (loading) return h("div", { className: "pad" }, "Բեռնվում է…");
  if (err) return h("div", { className: "pad" }, "Սխալ: " + err);
  if (!info) return h("div", { className: "pad" }, "Տվյալ չկա");

  const serverLangs =
    Array.isArray(info?.available_langs) && info.available_langs.length
      ? info.available_langs.slice(0, 5)
      : ["am", "ru", "en", "ar", "fr"];

  const nameByLang = {
    am: info?.company?.name?.am || "",
    ru: info?.company?.name?.ru || "",
    en: info?.company?.name?.en || "",
    ar: info?.company?.name?.ar || "",
    fr: info?.company?.name?.fr || "",
  };

  const desc = info?.description || {};
  const about = info?.profile?.about || {};
  const textByLang = {
    am: (desc?.am ?? about?.am) || "",
    ru: (desc?.ru ?? about?.ru) || "",
    en: (desc?.en ?? about?.en) || "",
    ar: (desc?.ar ?? about?.ar) || "",
    fr: (desc?.fr ?? about?.fr) || "",
  };

  const nameColor =
    info?.company?.nameColor || "#111";
  const descColor =
    info?.description?.color || info?.profile?.aboutColor || "#666";

  /* ---------- avatar selection (type-aware) ---------- */
  let avatarUrl = "";
  let avatarType = "";
  const avTop = info?.avatar;

  if (avTop && typeof avTop === "object") {
    avatarType = avTop.type || "";
    if (avatarType === "image") {
      avatarUrl = avTop.imageUrl || avTop.videoUrl || "";
    } else if (avatarType === "video") {
      avatarUrl = avTop.videoUrl || avTop.imageUrl || "";
    } else {
      // fallback — հին տվյալների համար
      avatarUrl = avTop.videoUrl || avTop.imageUrl || "";
    }
  } else if (typeof avTop === "string") {
    avatarUrl = avTop;
  } else {
    const avProf = info?.profile?.avatar;
    avatarUrl =
      typeof avProf === "object"
        ? avProf.videoUrl || avProf.imageUrl || ""
        : avProf || info?.assets?.logo_url || info?.logo_url || "";
  }

  const avatarAbs = absSrc(avatarUrl);
  const avatarIsVideo =
    avatarType === "video"
      ? true
      : avatarType === "image"
      ? false
      : isVideo(avatarAbs);

  /* ---------- background ---------- */
  const bg =
    info?.background || {
      type: "color",
      color: "#ffffff",
      imageUrl: "",
      videoUrl: "",
    };

  const name =
    nameByLang[lang] || nameByLang.am || nameByLang.en || "—";
  const descriptionRaw = textByLang[lang] || "";
  const description = softHyphenate(descriptionRaw, 6);

  const colsInfo = idealColsForLang(lang);
  const minCh = colsInfo[0];
  const maxCh = colsInfo[1];

  const descStyle = {
    color: descColor,
    margin: "15px auto 0",
    lineHeight: 1.6,
    maxWidth: "clamp(" + minCh + "ch, 90%, " + maxCh + "ch)",
    textAlign: "justify",
    textJustify: "inter-word",
    overflowWrap: "break-word",
    hyphens: "auto",
    textWrap: "pretty",
    textAlignLast: "left",
  };

  const icons = info?.icons || {};
  const links = Array.isArray(icons.links) ? icons.links : [];
  const styles = icons?.styles || {};

  const labelColor = styles.labelCss || styles.labelHEX || "";
  const chipColor = styles.chipCss || rgbaToCss(styles.chipRGBA) || "";
  const rowCardColor =
    styles.rowCardCss || rgbaToCss(styles.rowCardRGBA) || "";
  const layoutStyle = styles.layoutStyle || "dzev1";
  const cols = Number(styles.cols || 4);
  const glowEnabled = !!styles.glowEnabled;
  const glowColor = styles.glowColor || "#7dd3fc";

  const brandsArray = Array.isArray(info?.brands) ? info.brands : [];
  const brandsCols = Number(info?.brandsCols || 3);
  const brandsTitleColor = info?.brandsTitleColor || "#000000";
  const brandsTitleText = info?.brandsTitleText || "ՄԵՐ ԲՐԵՆԴՆԵՐԸ";
  const brandsBgColor = info?.brandsBgColor || "#ffffff";
  const brandsNameColor = info?.brandsNameColor || "#000000"; // ✅ բերել է առաջին կոդից

  const brandInfos = Array.isArray(info?.brandInfos) ? info.brandInfos : [];
  const showBrandInfo = !!activeBrandKeyword;

  return h(
    "div",
    {
      className: "public-home",
      style: {
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "100%",
        overflow: "hidden",
      },
    },

    /* background layer */
    h(
      "div",
      {
        className: "public-bg-layer",
        style: {
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
          background:
            bg.type === "color"
              ? bg.color || "#ffffff"
              : bg.type === "image"
              ? `url(${absSrc(bg.imageUrl)}) center/cover no-repeat`
              : "transparent",
        },
      },
      bg.type === "video" && bg.videoUrl
        ? h("video", {
            src: absSrc(bg.videoUrl),
            muted: true,
            playsInline: true,
            loop: true,
            autoPlay: true,
            preload: "auto",
            disableRemotePlayback: true,
            style: {
              width: "100%",
              height: "100%",
              objectFit: "cover",
            },
          })
        : null
    ),

    /* scroll layer */
    h(
      "div",
      {
        className: "public-scroll-layer",
        id: "publicScroll",
        style: {
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          maxHeight: "100%",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          padding: "12px",
        },
      },

      h(LangDropdown, {
        value: lang,
        onChange: setLang,
        langs: serverLangs,
      }),

      showBrandInfo
        ? h(BrandInfoPage, {
            brandInfos,
            keyword: activeBrandKeyword,
            lang,
            onBack: () => setActiveBrandKeyword(""),
          })
        : h(
            "div",
            { style: { position: "relative" } },

            /* HERO CARD */
            h(
              "section",
              {
                className: "card",
                style: {
                  textAlign: "center",
                  paddingTop: 10,
                  paddingBottom: 18,
                },
              },
              h(AvatarMedia, {
                src: avatarAbs,
                isVideo: avatarIsVideo,
                initials: (name || "KH").slice(0, 2),
              }),

              h(
                "h1",
                {
                  className: "hero-title",
                  style: {
                    color: nameColor,
                    margin: "15px 0 4px",
                    fontSize: 35,
                    textShadow: "0 0 4px rgba(255,255,255,0.6)",
                  },
                },
                name
              ),

              h(
                "p",
                {
                  className: "hero-desc",
                  style: {
                    ...descStyle,
                    textShadow: "0 0 4px rgba(255,255,255,0.7)",
                  },
                  lang,
                  dir: lang === "ar" ? "rtl" : "ltr",
                },
                description
              )
            ),

            /* ICONS BLOCK */
            links.length
              ? h(IconsPage, {
                  links,
                  labelColor,
                  chipColor,
                  rowCardColor,
                  layoutStyle,
                  cols,
                  glowEnabled,
                  glowColor,
                  lang,
                })
              : null,

            /* BRANDS BLOCK */
            brandsArray.length
              ? h(BrandsPage, {
                  brands: brandsArray,
                  brandsTitleColor,
                  brandsTitleText,
                  brandsCols,
                  brandsBgColor,
                  brandsNameColor, // ✅ փոխանցում ենք BrandsPage-ին
                  lang,
                  onKeywordClick: (kw) => setActiveBrandKeyword(kw),
                })
              : null,

            /* SHARE / QR BLOCK */
            h(SharePage, { cardId, info, lang })
          )
    )
  );
}
