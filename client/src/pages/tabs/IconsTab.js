// client/src/pages/tabs/IconsTab.js
import React from "react";
import { RgbaColorPicker } from "react-colorful";
import { adminGetInfo, adminSaveInfo } from "../../api.js";
import "../icons.layout.css";
const h = React.createElement;

/* ---------------- constants & helpers ---------------- */
const LANGS = ["am", "ru", "en", "ar", "fr"]; // ամբողջ հավաքածուն
const rtlProps = (code) =>
  code === "ar" ? { dir: "rtl", style: { textAlign: "right" } } : {};

/* ---------- UI TEXT (multi-lang) ---------- */
const ICONS_UI_TEXT = {
  am: {
    styleLabel: "Ոճ",
    // style options
    styleOption1: "Ձև 1",
    styleOption2: "Ձև 2",
    styleOption3: "Ձև 3",
    styleOption4: "Ձև 4 (շրջան)",

    colsLabel: "Սյունակներ",
    labelColor: "Իկոնների անունների գույնը",
    iconBg: "Իկոնների հետնաֆոնը",
    rowCardBg: "Տողային իկոնների հետնաֆոն (Սյունակ 1)",
    addButton: "Ավելացնել",
    deleteButton: "Ջնջել",
    saveButton: "Պահպանել",
    savingButton: "Պահպանում…",
    loading: "Բեռնվում է…",
    urlPlaceholder: "Հղում (URL)",
    presetButton: "Ընտրել",
    presetSearchPlaceholder: "Փնտրել…",
    validateLabelsMissing: "Լրացրեք անվան դաշտերը",
    validateAmMissing: "Լրացրեք AM անվան դաշտը",
    validateHrefMissing: "Լրացրեք Հղում (URL) դաշտը",
    rowsAttention: "Ուշադրություն․ լրացրու կարմիրով նշված տողերը",
    savedOk: "Պահվեց ✅",
    loadFailed: "Ներբեռնելը ձախողվեց",
    saveFailed: "Պահպանելը ձախողվեց",
  },

  ru: {
    styleLabel: "Стиль",
    styleOption1: "Стиль 1",
    styleOption2: "Стиль 2",
    styleOption3: "Стиль 3",
    styleOption4: "Стиль 4 (круг)",

    colsLabel: "Колонки",
    labelColor: "Цвет названий иконок",
    iconBg: "Фон иконок",
    rowCardBg: "Фон строковых иконок (1 колонка)",
    addButton: "Добавить",
    deleteButton: "Удалить",
    saveButton: "Сохранить",
    savingButton: "Сохранение…",
    loading: "Загрузка…",
    urlPlaceholder: "Ссылка (URL)",
    presetButton: "Выбрать",
    presetSearchPlaceholder: "Поиск…",
    validateLabelsMissing: "Заполните поля названий",
    validateAmMissing: "Заполните поле названия (AM)",
    validateHrefMissing: "Заполните поле «Ссылка (URL)»",
    rowsAttention: "Внимание: заполните строки, отмеченные красным",
    savedOk: "Сохранено ✅",
    loadFailed: "Не удалось загрузить",
    saveFailed: "Не удалось сохранить",
  },

  en: {
    styleLabel: "Style",
    styleOption1: "Style 1",
    styleOption2: "Style 2",
    styleOption3: "Style 3",
    styleOption4: "Style 4 (circle)",

    colsLabel: "Columns",
    labelColor: "Icon name color",
    iconBg: "Icon background",
    rowCardBg: "Row icons background (column 1)",
    addButton: "Add",
    deleteButton: "Delete",
    saveButton: "Save",
    savingButton: "Saving…",
    loading: "Loading…",
    urlPlaceholder: "Link (URL)",
    presetButton: "Select",
    presetSearchPlaceholder: "Search…",
    validateLabelsMissing: "Fill in the name fields",
    validateAmMissing: "Fill in the AM name field",
    validateHrefMissing: "Fill in the Link (URL) field",
    rowsAttention: "Attention: fill in the rows marked in red",
    savedOk: "Saved ✅",
    loadFailed: "Loading failed",
    saveFailed: "Saving failed",
  },

  ar: {
    styleLabel: "النمط",
    styleOption1: "نمط 1",
    styleOption2: "نمط 2",
    styleOption3: "نمط 3",
    styleOption4: "نمط 4 (دائري)",

    colsLabel: "الأعمدة",
    labelColor: "لون أسماء الأيقونات",
    iconBg: "خلفية الأيقونات",
    rowCardBg: "خلفية الأيقونات في الصف (عمود واحد)",
    addButton: "إضافة",
    deleteButton: "حذف",
    saveButton: "حفظ",
    savingButton: "جارٍ الحفظ…",
    loading: "جارٍ التحميل…",
    urlPlaceholder: "الرابط (URL)",
    presetButton: "اختيار",
    presetSearchPlaceholder: "بحث…",
    validateLabelsMissing: "يرجى تعبئة حقول الاسم",
    validateAmMissing: "يرجى تعبئة حقل الاسم (AM)",
    validateHrefMissing: "يرجى تعبئة حقل الرابط (URL)",
    rowsAttention: "تنبيه: يرجى تعبئة الصفوف المعلَّمة بالأحمر",
    savedOk: "تم الحفظ ✅",
    loadFailed: "فشل في التحميل",
    saveFailed: "فشل في الحفظ",
  },

  fr: {
    styleLabel: "Style",
    styleOption1: "Style 1",
    styleOption2: "Style 2",
    styleOption3: "Style 3",
    styleOption4: "Style 4 (cercle)",

    colsLabel: "Colonnes",
    labelColor: "Couleur des noms d’icônes",
    iconBg: "Arrière-plan des icônes",
    rowCardBg: "Arrière-plan des icônes en ligne (1 colonne)",
    addButton: "Ajouter",
    deleteButton: "Supprimer",
    saveButton: "Enregistrer",
    savingButton: "Enregistrement…",
    loading: "Chargement…",
    urlPlaceholder: "Lien (URL)",
    presetButton: "Choisir",
    presetSearchPlaceholder: "Rechercher…",
    validateLabelsMissing: "Veuillez remplir les champs du nom",
    validateAmMissing: "Veuillez remplir le champ du nom (AM)",
    validateHrefMissing: "Veuillez remplir le champ Lien (URL)",
    rowsAttention: "Attention : remplissez les lignes marquées en rouge",
    savedOk: "Enregistré ✅",
    loadFailed: "Échec du chargement",
    saveFailed: "Échec de l’enregistrement",
  },
};

const ICON_MAP = {
  phone: "fa-solid fa-phone",
  sms: "fa-solid fa-comment-dots",
  whatsapp: "fa-brands fa-whatsapp",
  telegram: "fa-brands fa-telegram",
  viber: "fa-brands fa-viber",
  instagram: "fa-brands fa-instagram",
  facebook: "fa-brands fa-facebook-f",
  messenger: "fa-brands fa-facebook-messenger",
  email: "fa-solid fa-envelope",
  linkedin: "fa-brands fa-linkedin-in",
  globe: "fa-solid fa-globe",
  location: "fa-solid fa-location-dot",
  tiktok: "fa-brands fa-tiktok",
  skype: "fa-brands fa-skype",
  twitter: "fa-brands fa-twitter",
  x: "fa-brands fa-x-twitter",
  youtube: "fa-brands fa-youtube",
  snapchat: "fa-brands fa-snapchat",
  pinterest: "fa-brands fa-pinterest",
  reddit: "fa-brands fa-reddit-alien",
  discord: "fa-brands fa-discord",
  github: "fa-brands fa-github",
  spotify: "fa-brands fa-spotify",
  behance: "fa-brands fa-behance",
  dribbble: "fa-brands fa-dribbble",
  medium: "fa-brands fa-medium",
  vimeo: "fa-brands fa-vimeo-v",
  vk: "fa-brands fa-vk",
  ok: "fa-brands fa-odnoklassniki",
  wechat: "fa-brands fa-weixin",
  line: "fa-brands fa-line",
  signal: "fa-brands fa-signal-messenger",
  zoom: "fa-solid fa-video",
  wikipedia: "fa-brands fa-wikipedia-w",
  threads: "fa-brands fa-threads",
};

// preset list
const FA_PRESETS = [
  "fa-solid fa-phone",
  "fa-solid fa-comment-dots",
  "fa-brands fa-whatsapp",
  "fa-brands fa-telegram",
  "fa-brands fa-viber",
  "fa-solid fa-envelope",
  "fa-brands fa-instagram",
  "fa-solid fa-globe",
  "fa-solid fa-location-dot",
  "fa-brands fa-linkedin-in",
  "fa-brands fa-facebook-f",
  "fa-brands fa-facebook-messenger",
  "fa-solid fa-video",
  "fa-brands fa-odnoklassniki",
  "fa-brands fa-youtube",
  "fa-brands fa-tiktok",
  "fa-brands fa-skype",
  "fa-brands fa-twitter",
  "fa-brands fa-x-twitter",
  "fa-brands fa-snapchat",
  "fa-brands fa-pinterest",
  "fa-brands fa-reddit-alien",
  "fa-brands fa-discord",
  "fa-brands fa-github",
  "fa-brands fa-spotify",
  "fa-brands fa-behance",
  "fa-brands fa-dribbble",
  "fa-brands fa-medium",
  "fa-brands fa-vimeo-v",
  "fa-brands fa-vk",
  "fa-brands fa-weixin",
  "fa-brands fa-line",
  "fa-brands fa-signal-messenger",
  "fa-brands fa-wikipedia-w",
  "fa-brands fa-threads",
];

function uid() {
  return (
    globalThis.crypto?.randomUUID?.() ||
    `u-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );
}
function withUid(x) {
  return { ...x, uid: x.uid || uid() };
}

function normLabels(label) {
  // պահում ենք բոլոր 5 լեզուները, անկախ active langs-ից
  if (label && typeof label === "object") {
    const out = { am: "", ru: "", en: "", ar: "", fr: "", ...label };
    LANGS.forEach((k) => {
      out[k] = String(out[k] ?? "");
    });
    return out;
  }
  return { am: String(label || ""), ru: "", en: "", ar: "", fr: "" };
}

/* ---- color helpers ---- */
function clamp255(n) {
  return Math.max(0, Math.min(255, Math.round(+n || 0)));
}
function hexToRgb(hex) {
  let s = (hex || "").trim();
  if (s.startsWith("#")) s = s.slice(1);
  if (s.length === 3) s = s.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(s)) return { r: 0, g: 0, b: 0 };
  const int = parseInt(s, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}
function rgbToHex({ r, g, b }) {
  const to = (v) => clamp255(v).toString(16).padStart(2, "0");
  return "#" + to(r) + to(g) + to(b);
}

/* ---- derive FA class from field (no images allowed) ---- */
function faClass(raw) {
  const s = String(raw || "").trim();
  if (!s) return "";
  if (/\bfa-(solid|regular|brands)\b|\bfa-[a-z0-9-]+/i.test(s)) return s; // already class
  const m = ICON_MAP[s.toLowerCase()];
  return m || "";
}

/* =================== Custom Preset Dropdown =================== */
function PresetSelect({
  presets,
  onPick,
  buttonWidth = 170,
  menuWidth = 185,
  maxHeight = 220,
  label = "Preset",
  searchPlaceholder = "Search…",
}) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const containerRef = React.useRef(null);

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return presets;
    return presets.filter((p) => p.toLowerCase().includes(s));
  }, [q, presets]);

  // close on outside click / Esc
  React.useEffect(() => {
    const onDown = (e) => {
      const el = containerRef.current;
      if (el && !el.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return h(
    "div",
    {
      ref: containerRef,
      style: { position: "relative", width: "100%" },
    },
    h(
      "button",
      {
        type: "button",
        className: "input",
        onClick: () => setOpen((v) => !v),
        style: { width: buttonWidth, textAlign: "left", cursor: "pointer" },
      },
      label
    ),

    open &&
      h(
        "div",
        {
          style: {
            position: "absolute",
            top: "calc(100% + 6px)",
            width: menuWidth,
            maxHeight,
            overflow: "auto",
            background: "#fff",
            border: "1px solid rgba(0,0,0,.12)",
            borderRadius: 12,
            boxShadow:
              "0 14px 40px rgba(0,0,0,.18), 0 1px 0 rgba(0,0,0,.06)",
            zIndex: 50,
            padding: 8,
          },
        },
        h("input", {
          className: "input",
          placeholder: searchPlaceholder,
          value: q,
          onChange: (e) => setQ(e.target.value),
          style: { width: "100%", marginBottom: 8 },
        }),
        h(
          "div",
          { style: { display: "grid", gap: 6 } },
          ...filtered.map((cls) =>
            h(
              "button",
              {
                key: cls,
                type: "button",
                onClick: () => {
                  onPick(cls);
                  setOpen(false);
                  setQ("");
                },
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid #eee",
                  background: "#fff",
                  cursor: "pointer",
                },
              },
              h("i", { className: cls, style: { minWidth: 18 } }),
              h("span", null, cls)
            )
          )
        )
      )
  );
}

/* ---------------- one row ---------------- */
function IconRow({ it, onField, onLabel, onDelete, error, langs, T }) {
  const usedLangs = Array.isArray(langs) && langs.length ? langs : LANGS;

  const err = error
    ? h(
        "div",
        {
          style: {
            marginTop: 6,
            padding: "6px 10px",
            borderRadius: 8,
            background: "#fff4f4",
            border: "1px solid #ffdede",
            color: "#a40000",
            fontSize: 12,
          },
        },
        error
      )
    : null;

  const preview = h(
    "div",
    {
      style: {
        width: 48,
        height: 48,
        display: "grid",
        placeItems: "center",
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 12,
        boxShadow: "0 6px 18px rgba(0,0,0,.06)",
        overflow: "hidden",
      },
    },
    h("i", {
      className: faClass(it.icon) || "fa-solid fa-link",
      style: { fontSize: 20 },
    })
  );

  return h(
    React.Fragment,
    null,
    h(
      "div",
      {
        className: "icon-card",
        style: {
          display: "grid",
          gridTemplateColumns: "48px 1fr",
          gap: 12,
          alignItems: "start",
          padding: 12,
          borderRadius: 16,
          background: "#fff",
          border: "1px solid #eee",
          boxShadow: "0 6px 18px rgba(0,0,0,.06)",
        },
      },
      preview,
      h(
        "div",
        { style: { display: "grid", gap: 10 } },

        // labels
        h(
          "div",
          { className: "lang-stack" },
          ...usedLangs.map((code) =>
            h(
              "div",
              { key: code, className: "lang-item" },
              h("div", { className: "lang-chip" }, code.toUpperCase()),
              h("input", {
                className: "input big",
                value: it.label?.[code] || "",
                onChange: (e) => onLabel(it.uid, code, e.target.value),
                ...rtlProps(code),
              })
            )
          )
        ),

        // href + FA class (custom Preset dropdown)
        h(
          "div",
          {
            style: {
              display: "grid",
              gap: 8,
              gridTemplateColumns: "1fr 1fr",
            },
          },
          h("input", {
            className: "input",
            value: it.href || "",
            placeholder: T.urlPlaceholder,
            onChange: (e) => onField(it.uid, { href: e.target.value }),
          }),
          h(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 8,
                position: "relative",
              },
            },
            h(PresetSelect, {
              presets: FA_PRESETS,
              onPick: (v) => onField(it.uid, { icon: v }),
              label: T.presetButton,
              searchPlaceholder: T.presetSearchPlaceholder,
            })
          )
        ),

        h(
          "div",
          { style: { display: "flex", gap: 8, justifyContent: "flex-end" } },
          h(
            "button",
            {
              className: "btn btn-danger",
              onClick: () => onDelete(it.uid),
            },
            T.deleteButton
          )
        )
      )
    ),
    err
  );
}

/* ============================ TAB (Admin) ============================ */
export default function IconsTab({ langs, uiLang = "en" }) {
  const token =
    sessionStorage.getItem("adminToken") ||
    localStorage.getItem("adminToken") ||
    "";

  const T = ICONS_UI_TEXT[uiLang] || ICONS_UI_TEXT.en;

  const activeLangs =
    Array.isArray(langs) && langs.length ? langs : LANGS;

  const [baseInfo, setBaseInfo] = React.useState(null);

  // items: { uid, id?, label:{am,ru,en,ar,fr}, href, icon }
  const [items, setItems] = React.useState([]);
  const [style, setStyle] = React.useState({
    labelHEX: "#d9caa0",
    chipRGBA: { r: 47, g: 47, b: 47, a: 1 },
    layoutStyle: "dzev1",
    cols: 4,
    glowEnabled: false,
    glowColor: "#7dd3fc",
    rowCardRGBA: { r: 255, g: 255, b: 255, a: 1 },
  });

  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  // pickers
  const chipBtnRef = React.useRef(null);
  const [showChipPicker, setShowChipPicker] = React.useState(false);
  const rowBtnRef = React.useRef(null);
  const [showRowPicker, setShowRowPicker] = React.useState(false);

  React.useEffect(() => {
    const onDown = (e) => {
      const chipPop = document.getElementById("chip-popover");
      const rowPop = document.getElementById("row-popover");
      const insideChip =
        chipPop?.contains(e.target) || chipBtnRef.current?.contains(e.target);
      const insideRow =
        rowPop?.contains(e.target) || rowBtnRef.current?.contains(e.target);
      if (!insideChip) setShowChipPicker(false);
      if (!insideRow) setShowRowPicker(false);
    };
    const onEsc = (e) => {
      if (e.key === "Escape") {
        setShowChipPicker(false);
        setShowRowPicker(false);
      }
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, []);

  // derived CSS strings
  const labelRgbObj = React.useMemo(
    () => hexToRgb(style.labelHEX),
    [style.labelHEX]
  );
  const labelCss = React.useMemo(
    () => `rgb(${labelRgbObj.r}, ${labelRgbObj.g}, ${labelRgbObj.b})`,
    [labelRgbObj]
  );
  const chipCss = React.useMemo(
    () =>
      `rgba(${style.chipRGBA.r}, ${style.chipRGBA.g}, ${style.chipRGBA.b}, ${style.chipRGBA.a})`,
    [style.chipRGBA]
  );
  const rowCardCss = React.useMemo(
    () =>
      `rgba(${style.rowCardRGBA.r}, ${style.rowCardRGBA.g}, ${style.rowCardRGBA.b}, ${style.rowCardRGBA.a})`,
    [style.rowCardRGBA]
  );

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await adminGetInfo(token);
        const info = r?.information || {};
        setBaseInfo(info);

        const icons = info?.icons || {};
        const arr = Array.isArray(icons.links) ? icons.links : [];
        setItems(
          arr.map((x) => withUid({ ...x, label: normLabels(x.label) }))
        );

        setStyle({
          labelHEX: icons.styles?.labelHEX || "#d9caa0",
          chipRGBA: icons.styles?.chipRGBA || {
            r: 47,
            g: 47,
            b: 47,
            a: 1,
          },
          layoutStyle: icons.styles?.layoutStyle || "dzev1",
          cols: Number(icons.styles?.cols || 4),
          glowEnabled: !!icons.styles?.glowEnabled,
          glowColor: icons.styles?.glowColor || "#7dd3fc",
          rowCardRGBA:
            icons.styles?.rowCardRGBA || {
              r: 255,
              g: 255,
              b: 255,
              a: 1,
            },
        });
      } catch (e) {
        setMsg(e.message || T.loadFailed);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, T.loadFailed]);

  /* ------ CRUD in memory ------ */
  const validate = (it) => {
    const href = (it.href || "").trim();
    if (!it.label || typeof it.label !== "object")
      return { ok: false, msg: T.validateLabelsMissing };
    const nameAM = (it.label.am || "").trim();
    if (!nameAM) return { ok: false, msg: T.validateAmMissing };
    if (!href) return { ok: false, msg: T.validateHrefMissing };
    const fa = faClass(it.icon);
    return {
      ok: true,
      payload: {
        // պահում ենք ամբողջ LANGS-ը DB-ում
        label: LANGS.reduce(
          (o, k) => ((o[k] = (it.label[k] || "").trim()), o),
          {}
        ),
        href,
        icon: fa || "fa-solid fa-link",
      },
    };
  };

  const add = () =>
    setItems((list) => [
      ...list,
      {
        uid: uid(),
        label: normLabels(""),
        href: "",
        icon: "fa-solid fa-link",
      },
    ]);

  const onField = (uidKey, patch) => {
    setErrors((e) => {
      const cp = { ...e };
      delete cp[uidKey];
      return cp;
    });
    setItems((list) =>
      list.map((it) => (it.uid === uidKey ? { ...it, ...patch } : it))
    );
  };

  const onLabel = (uidKey, code, val) => {
    setErrors((e) => {
      const cp = { ...e };
      delete cp[uidKey];
      return cp;
    });
    setItems((list) =>
      list.map((it) => {
        if (it.uid !== uidKey) return it;
        const next = { ...(it.label || normLabels("")) };
        next[code] = val;
        return { ...it, label: next };
      })
    );
  };

  const onDelete = (uidKey) => {
    setErrors((e) => {
      const cp = { ...e };
      delete cp[uidKey];
      return cp;
    });
    setItems((list) => list.filter((x) => x.uid !== uidKey));
  };

  /* ------ SAVE to DB ------ */
  const save = async () => {
    setMsg("");
    setSaving(true);
    try {
      const nextErrors = {};
      const links = items
        .map((it) => {
          const v = validate(it);
          if (!v.ok) {
            nextErrors[it.uid] = v.msg;
            return null;
          }
          return { id: it.id, ...v.payload };
        })
        .filter(Boolean);

      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) {
        setMsg(T.rowsAttention);
        setSaving(false);
        return;
      }

      const info = { ...(baseInfo || {}) };
      info.icons = {
        links,
        styles: {
          labelHEX: style.labelHEX,
          chipRGBA: style.chipRGBA,
          layoutStyle: style.layoutStyle,
          cols: Number(style.cols || 4),
          glowEnabled: !!style.glowEnabled,
          glowColor: style.glowColor,
          labelCss,
          chipCss,
          rowCardRGBA: style.rowCardRGBA,
          rowCardCss,
        },
      };

      await adminSaveInfo(token, info);

      const fresh = await adminGetInfo(token);
      const back = fresh?.information?.icons?.links || links;
      setItems(
        back.map((x) => withUid({ ...x, label: normLabels(x.label) }))
      );
      setBaseInfo(fresh?.information || info);
      setMsg(T.savedOk);
    } catch (e) {
      setMsg(e.message || T.saveFailed);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 1500);
    }
  };

  /* ------ UI ------ */
  const sq = (bg) => ({
    width: 36,
    height: 22,
    borderRadius: 6,
    border: "1px solid #ccc",
    background: bg,
  });
  if (loading) return h("div", { className: "card" }, T.loading);

  return h(
    "div",
    { style: { minHeight: "100%", paddingBottom: 88, overflowX: "clip" } },
    h(
      "h2",
      { className: "company-title", style: { marginTop: 8 } },
      T.title
    ),

    /* style controls */
    h(
      "div",
      { className: "card", style: { display: "grid", gap: 12 } },
      h(
        "div",
        { style: { display: "flex", gap: 12, alignItems: "center" } },
        h("label", { style: { fontWeight: 700 } }, T.styleLabel),
        h(
          "select",
          {
            value: style.layoutStyle,
            onChange: (e) =>
              setStyle((s) => ({ ...s, layoutStyle: e.target.value })),
            style: { padding: "6px 10px", borderRadius: 8 },
          },
          h("option", { value: "dzev1" }, T.styleOption1),
          h("option", { value: "dzev2" }, T.styleOption2),
          h("option", { value: "dzev3" }, T.styleOption3),
          h("option", { value: "dzev4" }, T.styleOption4)
        )
      ),
      h(
        "div",
        { style: { display: "flex", gap: 12, alignItems: "center" } },
        h("label", { style: { fontWeight: 700 } }, T.colsLabel),
        h(
          "select",
          {
            value: String(style.cols),
            onChange: (e) =>
              setStyle((s) => ({
                ...s,
                cols: parseInt(e.target.value, 10) || 4,
              })),
            style: { padding: "6px 10px", borderRadius: 8 },
            disabled: style.layoutStyle === "dzev4", // շրջան_LAYOUT-ի մոտ cols-ը դեր չունի
          },
          h("option", { value: "1" }, "1"),
          h("option", { value: "2" }, "2"),
          h("option", { value: "3" }, "3"),
          h("option", { value: "4" }, "4")
        )
      ),
      h(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "auto 36px 140px",
            gap: 10,
            alignItems: "center",
          },
        },
        h("label", { style: { fontWeight: 700 } }, T.labelColor),
        h("input", {
          type: "color",
          value: rgbToHex(labelRgbObj),
          onChange: (e) =>
            setStyle((s) => ({ ...s, labelHEX: e.target.value })),
        }),
        h("input", {
          className: "input",
          
          value: style.labelHEX,
          onChange: (e) =>
            setStyle((s) => ({ ...s, labelHEX: e.target.value })),
          placeholder: "#000000",
          style: { maxWidth: 120, marginLeft: 20 },
        })
      ),
      h(
        "div",
        {
          style: {
            position: "relative",
            display: "grid",
            gridTemplateColumns: "auto 36px 1fr",
            gap: 10,
            alignItems: "center",
          },
        },
        h("label", { style: { fontWeight: 700 } }, T.iconBg),
        h("button", {
          ref: chipBtnRef,
          onClick: () => setShowChipPicker((v) => !v),
          style: { ...sq(chipCss), cursor: "pointer" },
          title: "Choose RGBA",
        }),
        h("input", {
          className: "input",
          value: chipCss,
          readOnly: true,
          style: { opacity: 0.75 },
        }),
        showChipPicker &&
          h(
            "div",
            {
              id: "chip-popover",
              style: {
                position: "absolute",
                zIndex: 50,
                top: "calc(100% + 8px)",
                left: 90,
                background: "#fff",
                borderRadius: 12,
                boxShadow:
                  "0 14px 40px rgba(0,0,0,.18), 0 1px 0 rgba(0,0,0,.06)",
                padding: 12,
              },
            },
            h(RgbaColorPicker, {
              color: style.chipRGBA,
              onChange: (c) =>
                setStyle((s) => ({ ...s, chipRGBA: c })),
            })
          )
      ),

      h(
        "div",
        {
          style: {
            position: "relative",
            display: "grid",
            gridTemplateColumns: "auto 36px 1fr",
            gap: 10,
            alignItems: "center",
          },
        },
        h("label", { style: { fontWeight: 700 } }, T.rowCardBg),
        h("button", {
          ref: rowBtnRef,
          onClick: () => setShowRowPicker((v) => !v),
          style: { ...sq(rowCardCss), cursor: "pointer" },
          title: "Choose RGBA for single-column cards",
          disabled: style.layoutStyle === "dzev4",
        }),
        h("input", {
          className: "input",
          value: rowCardCss,
          readOnly: true,
          style: { opacity: 0.75 },
        }),
        showRowPicker &&
          h(
            "div",
            {
              id: "row-popover",
              style: {
                position: "absolute",
                zIndex: 50,
                top: "calc(100% + 8px)",
                left: 150,
                background: "#fff",
                borderRadius: 12,
                boxShadow:
                  "0 14px 40px rgba(0,0,0,.18), 0 1px 0 rgba(0,0,0,.06)",
                padding: 12,
              },
            },
            h(RgbaColorPicker, {
              color: style.rowCardRGBA,
              onChange: (c) =>
                setStyle((s) => ({ ...s, rowCardRGBA: c })),
            })
          )
      )
    ),

    /* rows */
    h(
      "div",
      { style: { display: "grid", gap: 10, marginTop: 12 } },
      ...items.map((it) =>
        h(IconRow, {
          key: it.uid,
          it,
          onField,
          onLabel,
          onDelete,
          error: errors[it.uid],
          langs: activeLangs,
          T,
        })
      )
    ),

    /* footer actions — sticky toolbar */
    h(
      "div",
      {
        style: {
          position: "sticky",
          bottom: 0,
          zIndex: 20,
          display: "flex",
          gap: 8,
          marginTop: 12,
          background: "#f7f7f8",
          padding: "10px 12px",
          boxShadow: "0 -4px 18px rgba(0,0,0,.08)",
          borderTop: "1px solid rgba(0,0,0,.06)",
        },
      },
      h(
        "button",
        {
          className: "btn",
          onClick: add,
        },
        T.addButton
      ),
      h("div", { style: { flex: 1 } }),
      h(
        "button",
        {
          className: "btn",
          onClick: save,
          disabled: saving,
        },
        saving ? T.savingButton : T.saveButton
      ),
      msg && h("div", { className: "small" }, msg)
    ),

    /* local CSS for big language inputs */
    h(
      "style",
      null,
      `
      .lang-stack{ display:grid; gap:10px; }
      .lang-item{ display:grid; gap:6px; }
      .lang-chip{
        width:44px; height:44px; border-radius:50%;
        display:grid; place-items:center;
        font-weight:800; color:#111;
        background:linear-gradient(180deg,#fff 0%,#f1f4f7 100%);
        box-shadow:0 8px 16px rgba(0,0,0,.08), inset 0 0 0 1px rgba(0,0,0,.08);
      }
      .input.big{ padding:14px 14px; font-size:15px; border-radius:14px; }
      .btn-danger{ background:#b91c1c; color:#fff; border:1px solid #b91c1c; }
    `
    )
  );
}
