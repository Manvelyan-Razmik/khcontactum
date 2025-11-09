// client/src/pages/tabs/BrandsTab.js
import React from "react";
import { adminGetInfo, adminSaveInfo, uploadFile } from "../../api.js";

const h = React.createElement;
const LANGS = ["am", "ru", "en", "ar", "fr"];

/* ---------- UI TEXT ---------- */
const BRANDS_UI_TEXT = {
am: {
  titleColorLabel: "Վերնագրի գույն :",
  titleTextLabel: "Վերնագրի տեքստը:",
  colsLabel: "Սյունակների թիվը:",
  colsOption3: "3",
  colsOption2: "2",
  colsOption1: "1 (մեկ սյունակ)",
  rowBgLabel: `Մեկ սյունակով քարտերի ֆոն (Սյունակ 1)`,

  brandNameLabel: "Բրենդի անուն:",
  uploadButton: "Վերբեռնել",
  deleteButton: "Ջնջել",
  linkTypeLabel: "Լինքի տիպը:",
  linkTypeKeyword: "Keyword",
  linkTypeUrl: "URL",
  keywordPlaceholder: "օր. goodrealty",
  hrefPlaceholder: "https://example.com/...",

  addButton: "Ավելացնել",
  saveButton: "Պահել",
  savingButton: "Պահպանում…",
  loading: "Բեռնվում է…",

  fileTypeError: "Ընդունվում են միայն նկար ֆայլեր",
  uploadOk: "Լոգոն վերբեռնվեց ✔",
  uploadFailed: "Վերբեռնումը ձախողվեց",
  loadFailed: "Ներբեռնումը ձախողվեց",
  savedOk: "Պահվեց ✅",
  saveFailed: "Պահպանելը ձախողվեց",
},

en: {
  titleColorLabel: "Title color:",
  titleTextLabel: "Title text:",
  colsLabel: "Number of columns:",
  colsOption3: "3",
  colsOption2: "2",
  colsOption1: "1 (single column)",
  rowBgLabel: "Background for single-column cards (Column 1)",

  brandNameLabel: "Brand name:",
  uploadButton: "Upload",
  deleteButton: "Delete",
  linkTypeLabel: "Link type:",
  linkTypeKeyword: "Keyword",
  linkTypeUrl: "URL",
  keywordPlaceholder: "e.g. goodrealty",
  hrefPlaceholder: "https://example.com/...",

  addButton: "Add",
  saveButton: "Save",
  savingButton: "Saving…",
  loading: "Loading…",

  fileTypeError: "Only image files are accepted",
  uploadOk: "Logo uploaded ✔",
  uploadFailed: "Upload failed",
  loadFailed: "Loading failed",
  savedOk: "Saved ✅",
  saveFailed: "Save failed",
},

ru: {
  titleColorLabel: "Цвет заголовка:",
  titleTextLabel: "Текст заголовка:",
  colsLabel: "Количество столбцов:",
  colsOption3: "3",
  colsOption2: "2",
  colsOption1: "1 (один столбец)",
  rowBgLabel: "Фон карточек с одним столбцом (Столбец 1)",

  brandNameLabel: "Название бренда:",
  uploadButton: "Загрузить",
  deleteButton: "Удалить",
  linkTypeLabel: "Тип ссылки:",
  linkTypeKeyword: "Ключевое слово",
  linkTypeUrl: "URL",
  keywordPlaceholder: "например goodrealty",
  hrefPlaceholder: "https://example.com/...",

  addButton: "Добавить",
  saveButton: "Сохранить",
  savingButton: "Сохранение…",
  loading: "Загрузка…",

  fileTypeError: "Допускаются только файлы изображений",
  uploadOk: "Логотип загружен ✔",
  uploadFailed: "Ошибка загрузки",
  loadFailed: "Ошибка при загрузке",
  savedOk: "Сохранено ✅",
  saveFailed: "Ошибка сохранения",
},
ar: {
  titleColorLabel: "لون العنوان:",
  titleTextLabel: "نص العنوان:",
  colsLabel: "عدد الأعمدة:",
  colsOption3: "3",
  colsOption2: "2",
  colsOption1: "1 (عمود واحد)",
  rowBgLabel: "خلفية البطاقات ذات العمود الواحد (العمود 1):",

  brandNameLabel: "اسم العلامة التجارية:",
  uploadButton: "رفع",
  deleteButton: "حذف",
  linkTypeLabel: "نوع الرابط:",
  linkTypeKeyword: "كلمة مفتاحية",
  linkTypeUrl: "رابط URL",
  keywordPlaceholder: "مثلاً goodrealty",
  hrefPlaceholder: "https://example.com/...",

  addButton: "إضافة",
  saveButton: "حفظ",
  savingButton: "جاري الحفظ…",
  loading: "جاري التحميل…",

  fileTypeError: "يُقبل فقط ملفات الصور",
  uploadOk: "تم رفع الشعار ✔",
  uploadFailed: "فشل الرفع",
  loadFailed: "فشل التحميل",
  savedOk: "تم الحفظ ✅",
  saveFailed: "فشل الحفظ",
},

fr: {
  titleColorLabel: "Couleur du titre :",
  titleTextLabel: "Texte du titre :",
  colsLabel: "Nombre de colonnes :",
  colsOption3: "3",
  colsOption2: "2",
  colsOption1: "1 (une seule colonne)",
  rowBgLabel: "Fond des cartes à une colonne (Colonne 1)",

  brandNameLabel: "Nom de la marque :",
  uploadButton: "Téléverser",
  deleteButton: "Supprimer",
  linkTypeLabel: "Type de lien :",
  linkTypeKeyword: "Mot-clé",
  linkTypeUrl: "URL",
  keywordPlaceholder: "ex. goodrealty",
  hrefPlaceholder: "https://example.com/...",

  addButton: "Ajouter",
  saveButton: "Enregistrer",
  savingButton: "Enregistrement…",
  loading: "Chargement…",

  fileTypeError: "Seuls les fichiers image sont acceptés",
  uploadOk: "Logo téléversé ✔",
  uploadFailed: "Échec du téléversement",
  loadFailed: "Échec du chargement",
  savedOk: "Enregistré ✅",
  saveFailed: "Échec de l’enregistrement",
}
};

/* ---------- helpers ---------- */
function filesBase() {
  if (typeof window === "undefined") return "http://localhost:5050";
  const host = window.location.hostname || "localhost";
  return `http://${host}:5050`;
}
const isAbsLike = (u = "") => /^(data:|https?:\/\/|blob:)/i.test(u);
function absPreview(u = "") {
  if (!u) return "";
  if (isAbsLike(u)) return u;
  let s = String(u).trim();
  if (!s.startsWith("/")) s = "/" + s;
  return filesBase() + s;
}
function toI18nObj(v, fb = "") {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const out = {};
    for (const L of LANGS) out[L] = (v[L] ?? "").trim();
    return out;
  }
  const s = (v ?? fb ?? "").toString().trim();
  const out = {};
  for (const L of LANGS) out[L] = L === "am" ? s : "";
  return out;
}
function trimI18nObj(o) {
  const out = {};
  for (const L of LANGS) out[L] = (o?.[L] ?? "").toString().trim();
  return out;
}
function uid() {
  return (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

/* ---------- focus/ caret restore ---------- */
function focusAndRestoreCaret(fieldKey, pos) {
  if (!fieldKey) return;
  const el = document.querySelector('input[data-fieldkey="' + fieldKey + '"]');
  if (!el) return;
  try {
    el.focus();
    if (typeof pos?.start === "number" && typeof pos?.end === "number") {
      el.setSelectionRange(pos.start, pos.end);
    } else {
      const L = el.value.length;
      el.setSelectionRange(L, L);
    }
  } catch {}
}

/* ---------- FloatingMenu (fixed) ---------- */
function FloatingMenu({ anchorEl, open, children }) {
  const [pos, setPos] = React.useState({ top: 0, left: 0 });

  React.useLayoutEffect(() => {
    if (!open || !anchorEl) return;
    const r = anchorEl.getBoundingClientRect();
    const left = Math.min(r.left, window.innerWidth - 280);
    setPos({ top: r.bottom + 8, left });
  }, [open, anchorEl]);

  if (!open) return null;

  return h(
    "div",
    {
      className: "floating-menu",
      style: { position: "fixed", top: pos.top, left: pos.left, zIndex: 9999 },
      onWheel: (e) => e.stopPropagation(),
      onTouchMove: (e) => e.stopPropagation()
    },
    children
  );
}

/* ---------- I18nRow helper ---------- */
function I18nRow({ brandId, label, value, onChange, langs }) {
  const usedLangs =
    Array.isArray(langs) && langs.length ? langs : LANGS;

  return h(
    "div",
    { className: "i18n-row" },
    h("label", { className: "lbl" }, label),
    h(
      "div",
      { className: "i18n-vertical" },
      ...usedLangs.map((L) => {
        const fieldKey = brandId ? brandId + ":" + L + ":name" : "title:" + L;
        const rtlProps =
          L === "ar" ? { dir: "rtl", style: { textAlign: "right" } } : {};
        return h(
          "div",
          { key: L, className: "i18n-item" },
          h("div", { className: "tag" }, L.toUpperCase()),
          h(
            "input",
            Object.assign(
              {
                id: "languageInput",
                className: "input",
                "data-fieldkey": fieldKey,
                autoComplete: "off",
                spellCheck: false,
                value: value?.[L] ?? "",
                onChange: (e) => {
                  const pos = {
                    start: e.target.selectionStart,
                    end: e.target.selectionEnd
                  };
                  onChange && onChange(L, e.target.value, fieldKey, pos);
                }
              },
              rtlProps
            )
          )
        );
      })
    )
  );
}

/* ---------- component ---------- */
export default function BrandsTab({ langs, uiLang = "am" }) {
  const token =
    sessionStorage.getItem("adminToken") ||
    localStorage.getItem("adminToken") ||
    "";

  const T = BRANDS_UI_TEXT[uiLang] || BRANDS_UI_TEXT.en;

  const activeLangs =
    Array.isArray(langs) && langs.length ? langs : LANGS;

  const [baseInfo, setBaseInfo] = React.useState(null);

  // brands: [{ id, name:{..}, href, keyword, linkType, logo, _blob? }]
  const [brands, setBrands] = React.useState([]);

  const [titleColor, setTitleColor] = React.useState("#000000");
  const [titleTextI18n, setTitleText] = React.useState(
    toI18nObj("ՄԵՐ ԲՐԵՆԴՆԵՐԸ")
  );

  const [cols, setCols] = React.useState(3);
  const [rowBg, setRowBg] = React.useState("#fcfcfc");

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  // caret info
  const lastFocusRef = React.useRef({ key: null, pos: null });

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await adminGetInfo(token);
        const info = r?.information || {};
        setBaseInfo(info);

        const br = Array.isArray(info.brands) ? info.brands : [];
        setBrands(
          br.map((x) => {
            const keyword = (x?.keyword || "").trim();
            const href = (x?.href || "").trim();
            const linkType =
              x?.linkType ||
              (keyword ? "keyword" : href ? "url" : "keyword");

            return {
              id: x.id || uid(),
              name: toI18nObj(x?.name ?? x?.title ?? ""),
              href,
              logo: (x?.logo || "").trim(),
              linkType,
              keyword
            };
          })
        );

        setTitleColor(info.brandsTitleColor || "#000000");
        setTitleText(toI18nObj(info.brandsTitleText || "ՄԵՐ ԲՐԵՆԴՆԵՐԸ"));
        setCols(Number(info.brandsCols || 3));
        setRowBg(info.brandsBgColor || "#fcfcfc");
      } catch (e) {
        setMsg(e?.message || T.loadFailed);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, T.loadFailed]);

  React.useEffect(() => {
    const { key, pos } = lastFocusRef.current || {};
    if (key) {
      requestAnimationFrame(() => focusAndRestoreCaret(key, pos));
    }
  });

  /* ------ local CRUD ------ */
  const onBrandField = (id, key, val, fieldKey, pos) => {
    if (fieldKey) lastFocusRef.current = { key: fieldKey, pos };
    setBrands((list) => list.map((b) => (b.id === id ? { ...b, [key]: val } : b)));
  };

  const onBrandNameLang = (id, lang, val, fieldKey, pos) => {
    lastFocusRef.current = { key: fieldKey, pos };
    setBrands((list) =>
      list.map((b) =>
        b.id === id ? { ...b, name: { ...b.name, [lang]: val } } : b
      )
    );
  };

  const addBrand = () =>
    setBrands((list) => [
      ...list,
      {
        id: uid(),
        name: toI18nObj(""),
        href: "",
        keyword: "",
        linkType: "keyword",
        logo: ""
      }
    ]);

  const delBrand = (id) => setBrands((list) => list.filter((b) => b.id !== id));

  const uploadBrandLogo =
    (id, file) =>
    async () => {
      try {
        if (!file) return;
        if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
          setMsg(T.fileTypeError);
          return;
        }
        const blobUrl = URL.createObjectURL(file);
        setBrands((list) =>
          list.map((b) => (b.id === id ? { ...b, logo: blobUrl, _blob: true } : b))
        );

        const r = await uploadFile(token, file, "brands");
        const serverPath = r?.url || r?.path || r?.location || "";
        setBrands((list) =>
          list.map((b) => {
            if (b.id !== id) return b;
            try {
              if (b._blob && b.logo?.startsWith?.("blob:"))
                URL.revokeObjectURL(b.logo);
            } catch {}
            return { ...b, logo: serverPath, _blob: false };
          })
        );
        setMsg(T.uploadOk);
      } catch (e) {
        setMsg(e?.message || T.uploadFailed);
      }
    };

  /* ------ save ------ */
  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      const cleanBrands = brands.map((b) => ({
        id: b.id,
        name: trimI18nObj(b.name),
        href: (b.href || "").trim(),
        logo: b._blob ? "" : (b.logo || "").trim(),
        linkType: b.linkType || "url",
        keyword: (b.keyword || "").trim()
      }));

      const next = { ...(baseInfo || {}) };
      next.brands = cleanBrands;
      next.brandsTitleColor = titleColor || "#000000";
      next.brandsTitleText = trimI18nObj(titleTextI18n);
      next.brandsCols = Number(cols) || 3;
      next.brandsBgColor = (rowBg || "").trim();

      await adminSaveInfo(token, next);

      const back = await adminGetInfo(token);
      const info = back?.information || next;

      setBaseInfo(info);
      setBrands(
        (Array.isArray(info.brands) ? info.brands : []).map((x) => {
          const keyword = (x?.keyword || "").trim();
          const href = (x?.href || "").trim();
          const linkType =
            x?.linkType || (keyword ? "keyword" : href ? "url" : "keyword");
          return {
            id: x.id || uid(),
            name: toI18nObj(x?.name ?? ""),
            href,
            logo: (x?.logo || "").trim(),
            linkType,
            keyword
          };
        })
      );
      setTitleColor(info.brandsTitleColor || "#000000");
      setTitleText(toI18nObj(info.brandsTitleText || ""));
      setCols(Number(info.brandsCols || 3));
      setRowBg(info.brandsBgColor || "#fcfcfc");

      setMsg(T.savedOk);
    } catch (e) {
      setMsg(e?.message || T.saveFailed);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 1500);
    }
  };

  /* ------ UI ------ */
  if (loading) return h("div", { className: "card" }, T.loading);

  return h(
    "div",
    { className: "admin-scroll-root" },
    h(
      "h2",
      {
        className: "company-title",
        style: { marginTop: 8, textAlign: "left", marginBottom: 6 }
      },
      T.heading
    ),

    h(
      "div",
      { className: "panel controls card" },
      h(
        "div",
        { className: "row" },
        h("label", { className: "lbl" }, T.titleColorLabel),
        h("input", {
          type: "color",
          value: titleColor,
          onChange: (e) => setTitleColor(e.target.value),
          className: "color-input"
        }),
        h("span", { className: "hex" }, titleColor)
      ),

      h(I18nRow, {
        brandId: null,
        label: T.titleTextLabel,
        value: titleTextI18n,
        onChange: (L, v, fieldKey, pos) => {
          lastFocusRef.current = { key: fieldKey, pos };
          setTitleText((o) => ({ ...o, [L]: v }));
        },
        langs: activeLangs
      }),

      h(  
        "div",
        { className: "row" },
        h("label", { className: "lbl" }, T.colsLabel),
        h(
          "select",
          {
            className: "input",
            value: String(cols),
            onChange: (e) => setCols(Number(e.target.value) || 3),
            style: { width: 160 }
          },
          h("option", { value: "3" }, T.colsOption3),
          h("option", { value: "2" }, T.colsOption2),
          h("option", { value: "1" }, T.colsOption1)
        )
      ),
      h(
        "div",
        { className: "row" },
        h("label", { className: "lbl" }, T.rowBgLabel),
        h("input", {
          type: "color",
          value: rowBg,
          onChange: (e) => setRowBg(e.target.value),
          className: "color-input"
        }),
        h("span", { className: "hex" }, rowBg)
      )
    ),

    h(
      "div",
      { className: "admin-brands" },
      ...brands.map((b) =>
        h(
          "div",
          { key: b.id, className: "brand-row card" },
          h(
            "div",
            { className: "brand-logo" },
            b.logo
              ? h("img", {
                  src: absPreview(b.logo),
                  alt: b.name?.am || "logo"
                })
              : h(
                  "span",
                  { className: "brand-initials" },
                  (b.name?.am || "?").slice(0, 2).toUpperCase()
                )
          ),
          h(
            "div",
            { className: "brand-main" },
            h(
              "div",
              { className: "brand-actions" },
              h(
                "label",
                {
                  className: "btn pill",
                  style: { cursor: "pointer" },
                  onMouseDown: (e) => e.preventDefault()
                },
                T.uploadButton,
                h("input", {
                  type: "file",
                  accept: "image/*,video/*",
                  style: { display: "none" },
                  onChange: (e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadBrandLogo(b.id, f)();
                    e.target.value = "";
                  }
                })
              ),
              h(
                "button",
                {
                  className: "btn pill danger",
                  type: "button",
                  onClick: () => delBrand(b.id)
                },
                T.deleteButton
              )
            ),

            h(I18nRow, {
              brandId: b.id,
              label: T.brandNameLabel,
              value: b.name,
              onChange: (L, v, fieldKey, pos) =>
                onBrandNameLang(b.id, L, v, fieldKey, pos),
              langs: activeLangs
            }),

            h(
              "div",
              { className: "row" },
              h("label", { className: "lbl" }, T.linkTypeLabel),
              h(
                "select",
                {
                  className: "input",
                  style: { maxWidth: 220 },
                  value: b.linkType || "keyword",
                  onChange: (e) =>
                    onBrandField(b.id, "linkType", e.target.value)
                },
                h("option", { value: "keyword" }, T.linkTypeKeyword),
                h("option", { value: "url" }, T.linkTypeUrl)
              )
            ),

            (function () {
              const fieldKey = b.id + ":keyword";
              if ((b.linkType || "keyword") !== "keyword") return null;
              return h("input", {
                className: "input",
                "data-fieldkey": fieldKey,
                autoComplete: "off",
                spellCheck: false,
                placeholder: T.keywordPlaceholder,
                value: b.keyword || "",
                onChange: (e) => {
                  const pos = {
                    start: e.target.selectionStart,
                    end: e.target.selectionEnd
                  };
                  onBrandField(
                    b.id,
                    "keyword",
                    e.target.value,
                    fieldKey,
                    pos
                  );
                }
              });
            })(),

            (function () {
              const fieldKey = b.id + ":href";
              if ((b.linkType || "keyword") !== "url") return null;
              return h("input", {
                className: "input",
                "data-fieldkey": fieldKey,
                autoComplete: "off",
                spellCheck: false,
                placeholder: T.hrefPlaceholder,
                value: b.href || "",
                onChange: (e) => {
                  const pos = {
                    start: e.target.selectionStart,
                    end: e.target.selectionEnd
                  };
                  onBrandField(b.id, "href", e.target.value, fieldKey, pos);
                }
              });
            })()
          )
        )
      )
    ),

    h(
      "div",
      { className: "footer-actions" },
      h(
        "button",
        { className: "btn strong", type: "button", onClick: addBrand },
        T.addButton
      ),
      h("div", { style: { flex: 1 } }),
      h(
        "button",
        {
          className: "btn strong",
          type: "button",
          onClick: save,
          disabled: saving
        },
        saving ? T.savingButton : T.saveButton
      ),
      msg && h("span", { className: "small-msg" }, msg)
    ),

    h(
      "style",
      null,
      `
      .controls{ display:grid; gap:12px; margin:10px 0 14px; background:#fff; border:1px solid #eee; border-radius:16px; padding:12px; }
      .row{ display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
      .lbl{ font-weight:600; min-width:max-content; }
      .color-input{ width:48px; height:32px; border:none; padding:0; cursor:pointer; }
      .hex{ font-family:monospace; font-size:12px; color:#444; }
      .i18n-row{ display:grid; gap:6px; }
      .i18n-vertical{ display:grid; gap:8px; grid-template-columns:1fr; }
      .i18n-item{ display:grid; gap:4px; }
      .tag{ font-size:12px; font-weight:700; opacity:.7; }

      .admin-brands{ display:flex; flex-direction:column; gap:12px; }
      .card{ background:#fff; border:1px solid #ececec; border-radius:16px; padding:12px; box-shadow:0 1px 4px rgba(0,0,0,.04); }
      .brand-row{ display:grid; grid-template-columns:84px 1fr; gap:12px; }
      @media (max-width:520px){ .brand-row{ grid-template-columns:64px 1fr; } }
      .brand-logo{ width:84px; height:84px; border-radius:16px; overflow:hidden; background:#f2f2f2; display:grid; place-items:center; }
      .brand-logo img{ width:100%; height:100%; object-fit:cover; }
      .brand-initials{ color:#777; font-weight:700; }
      .brand-main{ display:grid; gap:8px; align-content:start; }
      .brand-actions{ display:flex; gap:8px; justify-content:flex-start; }
      .btn{ padding:10px 14px; border:none; border-radius:12px; background:#111; color:#fff; cursor:pointer; }
      .btn.pill{ border-radius:999px; } .btn.danger{ background:#e8554d; } .btn.strong{ font-weight:700; }
      .input{ width:100%; padding:10px 12px; border:1px solid #ddd; border-radius:12px; background:#fff; }
      .footer-actions{ margin-top:10px; display:flex; align-items:center; gap:10px; }
      .small-msg{ margin-left:8px; font-size:12px; color:#444; }

      .admin-scroll-root{ overscroll-behavior:contain; }

      .floating-menu{
        max-height:60vh;
        overflow:auto;
        overscroll-behavior:contain;
        background:#fff;
        border-radius:14px;
        box-shadow:0 10px 30px rgba(0,0,0,.15);
        padding:6px 0;
        min-width:220px;
      }
      .floating-menu .menu-item{ padding:10px 14px; cursor:pointer; }
      .floating-menu .menu-item:hover{ background:#f4f4f4; }
    `
    )
  );
}
