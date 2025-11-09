// client/src/pages/tabs/BrandInfoTab.js
import React from "react";
import { adminGetInfo, adminSaveInfo, uploadFile } from "../../api.js";

const h = React.createElement;
const LANGS = ["am", "ru", "en", "ar", "fr"];

/* ---------- UI TEXT ---------- */
const BRANDINFO_TEXT = {
  am: {
    keywordHint: "Այս հատվածը կապվում է բրենդների հետ keyword դաշտի միջոցով։",
    keywordLabel: "Keyword",
    ratingLabel: "Like / Dislike",
    nameLabel: "Անուն:",
    bioLabel: "Նկարագրություն:",
    sliderLabel: "Սլայդեր (մինչև 5 նկար, 6:9)",
    deleteWorkerButton: "Ջնջել",
    addWorkerButton: "Ավելացնել",
    saveButton: "Պահել",
    savingButton: "Պահպանում…",
    loading: "Բեռնվում է…",
    avatarLabel: "Վերբեռնել",
    fileTypeError: "Ընդունվում է միայն նկար",
    uploadAvatarOk: "Avatar-ը վերբեռնվեց ✔",
    uploadImageOk: "Նկարը վերբեռնվեց ✔",
    uploadFailed: "Վերբեռնումը ձախողվեց",
    savedOk: "Պահվեց ✅",
    loadFailed: "Ներբեռնումը ձախողվեց",
    saveFailed: "Պահպանելը ձախողվեց",
  },

  ru: {
    keywordHint: "Этот блок связывается с брендами через поле keyword.",
    keywordLabel: "Keyword",
    ratingLabel: "Like / Dislike",
    nameLabel: "Имя :",
    bioLabel: "Описание :",
    sliderLabel: "Слайдер (до 5 изображений, 6:9)",
    deleteWorkerButton: "Удалить",
    addWorkerButton: "Добавить",
    saveButton: "Сохранить",
    savingButton: "Сохранение…",
    loading: "Загрузка…",
    avatarLabel: "Загрузить",
    fileTypeError: "Допускается только изображение",
    uploadAvatarOk: "Аватар загружен ✔",
    uploadImageOk: "Изображение загружено ✔",
    uploadFailed: "Ошибка при загрузке",
    savedOk: "Сохранено ✅",
    loadFailed: "Ошибка при загрузке",
    saveFailed: "Ошибка при сохранении",
  },

  en: {
    keywordHint: "This section is linked to brands via the keyword field.",
    keywordLabel: "Keyword",
    ratingLabel: "Like / Dislike",
    nameLabel: "Name:",
    bioLabel: "Description:",
    sliderLabel: "Slider (up to 5 images, 6:9)",
    deleteWorkerButton: "Delete",
    addWorkerButton: "Add",
    saveButton: "Save",
    savingButton: "Saving…",
    loading: "Loading…",
    avatarLabel: "Upload",
    fileTypeError: "Only image files are allowed",
    uploadAvatarOk: "Avatar uploaded ✔",
    uploadImageOk: "Image uploaded ✔",
    uploadFailed: "Upload failed",
    savedOk: "Saved ✅",
    loadFailed: "Load failed",
    saveFailed: "Save failed",
  },

  ar: {
    keywordHint: "يتم ربط هذا القسم بالعلامات التجارية عبر حقل الـ keyword.",
    keywordLabel: "الكلمة المفتاحية",
    ratingLabel: "Like / Dislike",
    nameLabel: "الاسم:",
    bioLabel: "الوصف:",
    sliderLabel: "سلايدر (حتى ٥ صور، 6:9)",
    deleteWorkerButton: "حذف",
    addWorkerButton: "إضافة",
    saveButton: "حفظ",
    savingButton: "جاري الحفظ…",
    loading: "جاري التحميل…",
    avatarLabel: "رفع",
    fileTypeError: "يُسمح بالصور فقط",
    uploadAvatarOk: "تم رفع الـ Avatar ✔",
    uploadImageOk: "تم رفع الصورة ✔",
    uploadFailed: "فشل الرفع",
    savedOk: "تم الحفظ ✅",
    loadFailed: "فشل التحميل",
    saveFailed: "فشل الحفظ",
  },

  fr: {
    keywordHint:
      "Cette section est reliée aux marques via le champ keyword.",
    keywordLabel: "Mot-clé",
    ratingLabel: "Like / Dislike",
    nameLabel: "Nom :",
    bioLabel: "Description :",
    sliderLabel: "Slider (jusqu’à 5 images, 6:9)",
    deleteWorkerButton: "Supprimer",
    addWorkerButton: "Ajouter",
    saveButton: "Enregistrer",
    savingButton: "Enregistrement…",
    loading: "Chargement…",
    avatarLabel: "Téléverser",
    fileTypeError: "Seule une image est acceptée",
    uploadAvatarOk: "Avatar téléversé ✔",
    uploadImageOk: "Image téléversée ✔",
    uploadFailed: "Échec du téléversement",
    savedOk: "Enregistré ✅",
    loadFailed: "Échec du chargement",
    saveFailed: "Échec de l’enregistrement",
  },
};


/* ---------- helpers ---------- */
function filesBase() {
  if (typeof window === "undefined") return "http://localhost:5050";
  const host = window.location.hostname || "localhost";
  return "http://" + host + ":5050";
}
const isAbsLike = (u = "") => /^(data:|https?:\/\/|blob:)/i.test(u);
function absPreview(u) {
  if (!u) return "";
  if (isAbsLike(u)) return u;
  let s = String(u).trim();
  if (!s.startsWith("/")) s = "/" + s;
  return filesBase() + s;
}
function toI18nObj(v, fb = "") {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const out = {};
    for (const L of LANGS) out[L] = (v[L] ?? "").toString().trim();
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
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}
function cleanGallery(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((x) => (x || "").toString().trim())
    .filter(Boolean)
    .slice(0, 5);
}
function putInArray(arr, index, value, maxLen = 5) {
  const out = Array.isArray(arr) ? arr.slice(0, maxLen) : [];
  while (out.length < maxLen) out.push("");
  out[index] = value;
  return out;
}

/* ---------- I18nRow helper ---------- */
function I18nRow({ brandId, label, value, onChange, langs }) {
  const usedLangs = Array.isArray(langs) && langs.length ? langs : LANGS;

  return h(
    "div",
    { className: "i18n-row" },
    h("label", { className: "lbl" }, label),
    h(
      "div",
      { className: "i18n-vertical" },
      usedLangs.map((L) => {
        const fieldKey = brandId
          ? `${brandId}:${L}:${label}`
          : `title:${L}:${label}`;
        const rtlProps =
          L === "ar" ? { dir: "rtl", style: { textAlign: "right" } } : {};
        return h(
          "div",
          { key: L, className: "i18n-item" },
          h("div", { className: "tag" }, L.toUpperCase()),
          h(
            "textarea",
            Object.assign(
              {
                className: "input",
                "data-fieldkey": fieldKey,
                autoComplete: "off",
                spellCheck: false,
                rows: 2,
                value: value?.[L] ?? "",
                onChange: (e) =>
                  onChange && onChange(L, e.target.value, fieldKey, null),
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
export default function BrandInfoTab({ langs, uiLang = "am" }) {
  const token =
    sessionStorage.getItem("adminToken") ||
    localStorage.getItem("adminToken") ||
    "";

  const activeLangs = Array.isArray(langs) && langs.length ? langs : LANGS;
  const T = BRANDINFO_TEXT[uiLang] || BRANDINFO_TEXT.en;

  const [baseInfo, setBaseInfo] = React.useState(null);

  // workers: [{ id, keyword, name:{}, bio:{}, avatar, gallery[], ratingEnabled }]
  const [workers, setWorkers] = React.useState([]);

  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await adminGetInfo(token);
        const info = r?.information || r || {};
        setBaseInfo(info);

        // նախընտրում ենք brandInfos, fallback՝ brandWorkers
        const list = Array.isArray(info.brandInfos)
          ? info.brandInfos
          : Array.isArray(info.brandWorkers)
          ? info.brandWorkers
          : [];

        const prepared = list.map((x) => ({
          id: x.id || uid(),
          keyword: (x.keyword || "").toString().trim(),
          name: toI18nObj(x.name || x.title || ""),
          bio: toI18nObj(x.bio || x.description || ""),
          avatar: (x.avatar || "").toString().trim(),
          gallery: cleanGallery(x.gallery),
          ratingEnabled: x.ratingEnabled !== false, // default TRUE
        }));
        setWorkers(prepared);
      } catch (e) {
        setMsg(e?.message || T.loadFailed);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, uiLang]);

  /* ------ CRUD helpers ------ */
  function onWorkerField(id, key, value) {
    setWorkers((list) =>
      list.map((w) => (w.id === id ? { ...w, [key]: value } : w))
    );
  }

  function onWorkerName(id, lang, value) {
    setWorkers((list) =>
      list.map((w) =>
        w.id === id ? { ...w, name: { ...w.name, [lang]: value } } : w
      )
    );
  }

  function onWorkerBio(id, lang, value) {
    setWorkers((list) =>
      list.map((w) =>
        w.id === id ? { ...w, bio: { ...w.bio, [lang]: value } } : w
      )
    );
  }

  function addWorker() {
    setWorkers((list) => [
      ...list,
      {
        id: uid(),
        keyword: "",
        name: toI18nObj(""),
        bio: toI18nObj(""),
        avatar: "",
        gallery: [],
        ratingEnabled: true,
      },
    ]);
  }

  function delWorker(id) {
    setWorkers((list) => list.filter((w) => w.id !== id));
  }

  /* ------ upload helpers ------ */
  function uploadWorkerAvatar(id, file) {
    return (async () => {
      try {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
          setMsg(T.fileTypeError);
          return;
        }
        const blobUrl = URL.createObjectURL(file);
        setWorkers((list) =>
          list.map((w) => (w.id === id ? { ...w, avatar: blobUrl } : w))
        );

        const r = await uploadFile(token, file, "brandInfos.avatar");
        const serverPath = r?.url || r?.path || r?.location || "";
        setWorkers((list2) =>
          list2.map((w) => (w.id === id ? { ...w, avatar: serverPath } : w))
        );
        setMsg(T.uploadAvatarOk);
      } catch (e) {
        setMsg(e?.message || T.uploadFailed);
      }
    })();
  }

  function uploadWorkerGallery(id, file, index) {
    return (async () => {
      try {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
          setMsg(T.fileTypeError);
          return;
        }
        const blobUrl = URL.createObjectURL(file);
        setWorkers((list) =>
          list.map((w) => {
            if (w.id !== id) return w;
            const g1 = putInArray(w.gallery, index, blobUrl, 5);
            return { ...w, gallery: g1 };
          })
        );

        const r = await uploadFile(token, file, "brandInfos.gallery");
        const serverPath = r?.url || r?.path || r?.location || "";
        setWorkers((list2) =>
          list2.map((w) => {
            if (w.id !== id) return w;
            const g2 = putInArray(w.gallery, index, serverPath, 5);
            return { ...w, gallery: g2 };
          })
        );
        setMsg(T.uploadImageOk);
      } catch (e) {
        setMsg(e?.message || T.uploadFailed);
      }
    })();
  }

  /* ------ save ------ */
  async function save() {
    setSaving(true);
    setMsg("");
    try {
      const cleanWorkers = workers.map((w) => ({
        id: w.id,
        keyword: (w.keyword || "").toString().trim(),
        name: trimI18nObj(w.name),
        bio: trimI18nObj(w.bio),
        avatar: (w.avatar || "").toString().trim(),
        gallery: cleanGallery(w.gallery),
        ratingEnabled: !!w.ratingEnabled,
      }));

      const next = { ...(baseInfo || {}) };
      next.brandInfos = cleanWorkers;
      delete next.brandWorkers;

      await adminSaveInfo(token, next);

      const back = await adminGetInfo(token);
      const info = back?.information || next;

      setBaseInfo(info);

      const list = Array.isArray(info.brandInfos)
        ? info.brandInfos
        : Array.isArray(info.brandWorkers)
        ? info.brandWorkers
        : [];
      const prepared = list.map((x) => ({
        id: x.id || uid(),
        keyword: (x.keyword || "").toString().trim(),
        name: toI18nObj(x.name || x.title || ""),
        bio: toI18nObj(x.bio || x.description || ""),
        avatar: (x.avatar || "").toString().trim(),
        gallery: cleanGallery(x.gallery),
        ratingEnabled: x.ratingEnabled !== false,
      }));
      setWorkers(prepared);

      setMsg(T.savedOk);
    } catch (e) {
      setMsg(e?.message || T.saveFailed);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 1500);
    }
  }

  /* ------ UI ------ */
  if (loading) return h("div", { className: "card" }, T.loading);

  return h(
    "div",
    { className: "admin-scroll-root" },

    h(
      "h2",
      {
        className: "company-title",
        style: { marginTop: 8, marginBottom: 6 },
      },
      T.title
    ),

    h(
      "p",
      {
        className: "small",
        style: { marginBottom: 10 },
      },
      T.keywordHint
    ),

    h(
      "div",
      { className: "admin-workers" },
      workers.map((w) =>
        h(
          "div",
          { key: w.id, className: "worker-row card" },

          // avatar + upload overlay
          h(
            "div",
            { className: "worker-avatar", id: "avatarUpload"},
            w.avatar
              ? h("img", { src: absPreview(w.avatar), alt: "worker" })
              : h(
                  "span",
                  { className: "worker-avatar-initials" },
                  (w.name && (w.name.am || w.name.en || "?"))
                    .slice(0, 2)
                    .toUpperCase()
                ),
            h(
              "label",
              {
                className: "btn pill btn-small avatar-upload",
                id: "text"
              },
              T.avatarLabel,
              h("input", {
                type: "file",
                accept: "image/*",
                style: { display: "none" },
                onChange: (e) => {
                  const f = e.target.files && e.target.files[0];
                  if (f) uploadWorkerAvatar(w.id, f);
                  e.target.value = "";
                },
              })
            )
          ),

          // main fields
          h(
            "div",
            { className: "worker-main" },

            h(
              "div",
              { className: "row" },
              h("label", { className: "lbl" }, T.keywordLabel + ":"),
              h("input", {
                className: "input",
                style: { flex: 1 },
                value: w.keyword || "",
                "data-fieldkey": w.id + ":keyword",
                autoComplete: "off",
                spellCheck: false,
                onChange: (e) =>
                  onWorkerField(w.id, "keyword", e.target.value),
              })
            ),

            // Like / Dislike toggle
            h(
              "div",
              { className: "row", style: { marginTop: 4 } },
              h("label", { className: "lbl" }, T.ratingLabel),
              h("input", {
                type: "checkbox",
                checked: !!w.ratingEnabled,
                onChange: (e) =>
                  onWorkerField(w.id, "ratingEnabled", e.target.checked),
              })
            ),

            h(I18nRow, {
              brandId: w.id + ":name",
              label: T.nameLabel,
              value: w.name,
              onChange: (L, v, fieldKey) =>
                onWorkerName(w.id, L, v, fieldKey),
              langs: activeLangs,
            }),

            h(I18nRow, {
              brandId: w.id + ":bio",
              label: T.bioLabel,
              value: w.bio,
              onChange: (L, v, fieldKey) => onWorkerBio(w.id, L, v, fieldKey),
              langs: activeLangs,
            }),

            h(
              "div",
              { className: "worker-gallery-block" },
              h(
                "div",
                { className: "lbl", style: { marginBottom: 6 } },
                T.sliderLabel
              ),
              h(
                "div",
                { className: "worker-gallery-row" },
                [0, 1, 2, 3, 4].map((idx) => {
                  const src = w.gallery && w.gallery[idx] ? w.gallery[idx] : "";
                  return h(
                    "label",
                    {
                      key: idx,
                      className: "gallery-slot",
                    },
                    src
                      ? h("img", { src: absPreview(src), alt: "slide" })
                      : h("span", { className: "gallery-plus" }, "+"),
                    h("input", {
                      type: "file",
                      accept: "image/*",
                      style: { display: "none" },
                      onChange: (e) => {
                        const f = e.target.files && e.target.files[0];
                        if (f) uploadWorkerGallery(w.id, f, idx);
                        e.target.value = "";
                      },
                    })
                  );
                })
              )
            ),

            h(
              "div",
              { className: "row", style: { marginTop: 6 } },
              h(
                "button",
                {
                  type: "button",
                  className: "btn pill danger btn-small",
                  onClick: () => delWorker(w.id),
                },
                T.deleteWorkerButton
              )
            )
          )
        )
      )
    ),

    h(
      "div",
      { className: "footer-actions" },
      h(
        "button",
        {
          className: "btn strong",
          type: "button",
          onClick: addWorker,
        },
        T.addWorkerButton
      ),
      h("div", { style: { flex: 1 } }),
      h(
        "button",
        {
          className: "btn strong",
          type: "button",
          onClick: save,
          disabled: saving,
        },
        saving ? T.savingButton : T.saveButton
      ),
      msg && h("span", { className: "small-msg" }, msg)
    ),

    h(
      "style",
      null,
      [
        ".admin-workers{display:flex;flex-direction:column;gap:12px;}",
        ".worker-row{display:grid;grid-template-columns:96px 1fr;gap:12px;}",
        "@media(max-width:520px){.worker-row{grid-template-columns:80px 1fr;}}",
        ".worker-avatar{width:96px;height:96px;border-radius:16px;overflow:hidden;background:#f2f2f2;display:grid;place-items:center;position:relative;}",
        ".worker-avatar img{width:100%;height:100%;object-fit:cover;}",
        ".worker-avatar-initials{font-weight:700;color:#777;}",
        ".avatar-upload{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);padding:6px 12px;font-size:11px;opacity:.95;cursor:pointer;}",
        ".worker-main{display:grid;gap:8px;align-content:start;}",
        ".worker-gallery-row{display:flex;gap:8px;flex-wrap:wrap;}",
        ".gallery-slot{width:90px;height:54px;border-radius:10px;overflow:hidden;background:#f4f4f4;position:relative;display:grid;place-items:center;cursor:pointer;border:1px dashed #ccc;}",
        ".gallery-slot img{width:100%;height:100%;object-fit:cover;}",
        ".gallery-plus{font-size:22px;color:#777;}",
        ".btn-small{padding:6px 10px;font-size:12px;}",
        ".card{background:#fff;border:1px solid:#ececec;border-radius:16px;padding:12px;box-shadow:0 1px 4px rgba(0,0,0,.04);}",
        ".lbl{font-weight:600;min-width:max-content;}",
        ".i18n-row{display:grid;gap:6px;}",
        ".i18n-vertical{display:grid;gap:6px;grid-template-columns:1fr;}",
        ".i18n-item{display:grid;gap:4px;}",
        ".tag{font-size:12px;font-weight:700;opacity:.7;}",
        ".input{width:100%;padding:8px 10px;border:1px solid:#ddd;border-radius:12px;background:#fff;}",
        ".btn{padding:10px 14px;border:none;border-radius:12px;background:#111;color:#fff;cursor:pointer;}",
        ".btn.pill{border-radius:999px;}",
        ".btn.danger{background:#e8554d;}",
        ".btn.strong{font-weight:700;}",
        ".footer-actions{margin-top:10px;display:flex;align-items:center;gap:10px;}",
        ".small-msg{margin-left:8px;font-size:12px;color:#444;}",
        ".admin-scroll-root{overscroll-behavior:contain;}",
        ".small{font-size:12px;color:#666;}",
      ].join("\n")
    )
  );
}
