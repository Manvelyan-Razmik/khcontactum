// client/src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import PhoneShell from "../PhoneShell.js";
import { adminMe, adminGetInfo, adminSaveInfo, uploadFile } from "../api.js";
import { fileUrl } from "../utils/fileUrl.js";

import IconsTab from "./tabs/IconsTab.js";
import BrandsTab from "./tabs/BrandsTab.js";
import PasswordTab from "./tabs/PasswordTab.js";
import BrandInfoTab from "./tabs/BrandInfoTab.js";
import ShareTab from "./tabs/ShareTab.js";

const h = React.createElement;

/* ---------- UI TEXT BY LANGUAGE ---------- */
const ADMIN_UI_TEXT = {
  am: {
    tabs: {
      home: "Գլխավոր էջ",
      icons: "Իկոնների էջ",
      brands: "Բրենդների էջ",
      brandinfo: "Բրենդ ինֆո",
      share: "Կիսվել / QR",
      password: "Փոխել Գաղտնաբառը",
    },
    logout: "ԵԼՔ",
    headerAdminPrefix: "ADMIN",

    langsTitle: "ԼԵԶՈՒՆԵՐ",
    langsDescription:
      "Ընտրիր ակտիվ լեզուները և փոխիր կարգը․ առաջինը կլինի public էջի հիմնական լեզուն։",

    avatarTitle: "AVATAR",
    typeLabel: "Տեսակ",
    avatarTypeImage: "Նկար",
    avatarTypeVideo: "Վիդեո",
    avatarImageUrlLabel: "Avatar նկարի հղում",
    avatarVideoUrlLabel: "Avatar վիդեոյի հղում",
    avatarVideoHint: "Մաքս. 20 MB (mp4, webm, ogg)",

    companyNameTitle: "ԿԱԶՄԱԿԵՐՊՈՒԹՅԱՆ ԱՆՎԱՆՈՒՄ",
    nameColorLabel: "Անվան գույնը",

    descriptionTitle: "ՆԿԱՐԱԳՐՈՒԹՅՈՒՆ",
    descriptionColorLabel: "Նկարագրության գույնը",

    backgroundTitle: "ՖՈՆ",
    backgroundTypeColor: "Գույն",
    backgroundTypeImage: "Նկար",
    backgroundTypeVideo: "Վիդեո",
    backgroundColorLabel: "Ֆոնի գույնը",
    backgroundImageUrlLabel: "Ֆոնի նկարի հղում",
    backgroundVideoUrlLabel: "Ֆոնի վիդեոյի հղում",
    backgroundVideoHint: "Մաքս. 20 MB (mp4, webm, ogg)",

    saveButton: "Պահել",
    savingButton: "Պահվում է...",
    saveOk: "Պահվեց ✅",
    saveError: "Սխալ պահելիս",

    needLoginTitle: "Մուտք անհրաժեշտ է",
    needLoginBody: "Մուտք գործիր / էջում։",
    loading: "Բեռնվում է…",

    defaultBadge: "Default",

    chooseFileLabel: "Ընտրել ֆայլ",
  },

  ru: {
    tabs: {
      home: "Главная",
      icons: "Иконки",
      brands: "Бренды",
      brandinfo: "Инфо о бренде",
      share: "Поделиться / QR",
      password: "Смена пароля",
    },
    logout: "ВЫХОД",
    headerAdminPrefix: "ADMIN",

    langsTitle: "ЯЗЫКИ",
    langsDescription:
      "Выберите активные языки и поменяйте порядок: первый будет языком по умолчанию на публичной странице.",

    avatarTitle: "AVATAR",
    typeLabel: "Тип",
    avatarTypeImage: "Изображение",
    avatarTypeVideo: "Видео",
    avatarImageUrlLabel: "Ссылка на аватар",
    avatarVideoUrlLabel: "Ссылка на видео-аватар",
    avatarVideoHint: "Макс. 20 MB (mp4, webm, ogg)",

    companyNameTitle: "НАЗВАНИЕ КОМПАНИИ",
    nameColorLabel: "Цвет названия",

    descriptionTitle: "ОПИСАНИЕ",
    descriptionColorLabel: "Цвет описания",

    backgroundTitle: "ФОН",
    backgroundTypeColor: "Цвет",
    backgroundTypeImage: "Изображение",
    backgroundTypeVideo: "Видео",
    backgroundColorLabel: "Цвет фона",
    backgroundImageUrlLabel: "Ссылка на фон-картинку",
    backgroundVideoUrlLabel: "Ссылка на фон-видео",
    backgroundVideoHint: "Макс. 20 MB (mp4, webm, ogg)",

    saveButton: "Сохранить",
    savingButton: "Сохранение...",
    saveOk: "Сохранено ✅",
    saveError: "Ошибка при сохранении",

    needLoginTitle: "Требуется вход",
    needLoginBody: "Авторизуйтесь на странице /.",
    loading: "Загрузка…",

    defaultBadge: "По умолчанию",

    chooseFileLabel: "Выбрать файл",
  },

  en: {
    tabs: {
      home: "Home",
      icons: "Icons",
      brands: "Brands",
      brandinfo: "Brand Info",
      share: "Share / QR",
      password: "Change Password",
    },
    logout: "LOG OUT",
    headerAdminPrefix: "ADMIN",

    langsTitle: "LANGUAGES",
    langsDescription:
      "Select active languages and reorder them; the first one will be the default language on the public page.",

    avatarTitle: "AVATAR",
    typeLabel: "Type",
    avatarTypeImage: "Image",
    avatarTypeVideo: "Video",
    avatarImageUrlLabel: "Avatar Image URL",
    avatarVideoUrlLabel: "Avatar Video URL",
    avatarVideoHint: "Max 20 MB (mp4, webm, ogg)",

    companyNameTitle: "COMPANY NAME",
    nameColorLabel: "Name Color",

    descriptionTitle: "DESCRIPTION",
    descriptionColorLabel: "Description Color",

    backgroundTitle: "BACKGROUND",
    backgroundTypeColor: "Color",
    backgroundTypeImage: "Image",
    backgroundTypeVideo: "Video",
    backgroundColorLabel: "Background Color",
    backgroundImageUrlLabel: "Background Image URL",
    backgroundVideoUrlLabel: "Background Video URL",
    backgroundVideoHint: "Max 20 MB (mp4, webm, ogg)",

    saveButton: "Save",
    savingButton: "Saving...",
    saveOk: "Saved ✅",
    saveError: "Error while saving",

    needLoginTitle: "Login required",
    needLoginBody: "Please log in on the / page.",
    loading: "Loading…",

    defaultBadge: "Default",

    chooseFileLabel: "Choose File",
  },

  ar: {
    tabs: {
      home: "الصفحة الرئيسية",
      icons: "الأيقونات",
      brands: "العلامات التجارية",
      brandinfo: "معلومات العلامة",
      share: "مشاركة / QR",
      password: "تغيير كلمة المرور",
    },
    logout: "تسجيل الخروج",
    headerAdminPrefix: "ADMIN",

    langsTitle: "اللغات",
    langsDescription:
      "اختر اللغات النشطة وقم بتغيير الترتيب؛ الأول سيكون اللغة الافتراضية في الصفحة العامة.",

    avatarTitle: "الصورة (Avatar)",
    typeLabel: "النوع",
    avatarTypeImage: "صورة",
    avatarTypeVideo: "فيديو",
    avatarImageUrlLabel: "رابط صورة الـ Avatar",
    avatarVideoUrlLabel: "رابط فيديو الـ Avatar",
    avatarVideoHint: "الحد الأقصى 20MB (mp4, webm, ogg)",

    companyNameTitle: "اسم الشركة",
    nameColorLabel: "لون الاسم",

    descriptionTitle: "الوصف",
    descriptionColorLabel: "لون الوصف",

    backgroundTitle: "الخلفية",
    backgroundTypeColor: "لون",
    backgroundTypeImage: "صورة",
    backgroundTypeVideo: "فيديو",
    backgroundColorLabel: "لون الخلفية",
    backgroundImageUrlLabel: "رابط صورة الخلفية",
    backgroundVideoUrlLabel: "رابط فيديو الخلفية",
    backgroundVideoHint: "الحد الأقصى 20MB (mp4, webm, ogg)",

    saveButton: "حفظ",
    savingButton: "جاري الحفظ...",
    saveOk: "تم الحفظ ✅",
    saveError: "خطأ أثناء الحفظ",

    needLoginTitle: "مطلوب تسجيل الدخول",
    needLoginBody: "يرجى تسجيل الدخول من صفحة /.",
    loading: "جاري التحميل…",

    defaultBadge: "افتراضي",

    chooseFileLabel: "اختر ملفًا",
  },

  fr: {
    tabs: {
      home: "Accueil",
      icons: "Icônes",
      brands: "Marques",
      brandinfo: "Infos marque",
      share: "Partager / QR",
      password: "Changer le mot de passe",
    },
    logout: "DÉCONNEXION",
    headerAdminPrefix: "ADMIN",

    langsTitle: "LANGUES",
    langsDescription:
      "Sélectionnez les langues actives et changez l’ordre ; la première sera la langue par défaut sur la page publique.",

    avatarTitle: "AVATAR",
    typeLabel: "Type",
    avatarTypeImage: "Image",
    avatarTypeVideo: "Vidéo",
    avatarImageUrlLabel: "URL de l’image avatar",
    avatarVideoUrlLabel: "URL de la vidéo avatar",
    avatarVideoHint: "Max 20 MB (mp4, webm, ogg)",

    companyNameTitle: "NOM DE L’ENTREPRISE",
    nameColorLabel: "Couleur du nom",

    descriptionTitle: "DESCRIPTION",
    descriptionColorLabel: "Couleur de la description",

    backgroundTitle: "ARRIÈRE-PLAN",
    backgroundTypeColor: "Couleur",
    backgroundTypeImage: "Image",
    backgroundTypeVideo: "Vidéo",
    backgroundColorLabel: "Couleur de fond",
    backgroundImageUrlLabel: "URL de l’image de fond",
    backgroundVideoUrlLabel: "URL de la vidéo de fond",
    backgroundVideoHint: "Max 20 MB (mp4, webm, ogg)",

    saveButton: "Enregistrer",
    savingButton: "Enregistrement...",
    saveOk: "Enregistré ✅",
    saveError: "Erreur lors de l’enregistrement",

    needLoginTitle: "Connexion requise",
    needLoginBody: "Connectez-vous sur la page /.",
    loading: "Chargement…",

    defaultBadge: "Par défaut",

    chooseFileLabel: "Choisir un файл",
  },
};

const DEFAULT_INFO = {
  logo_url: "",
  avatar: { type: "image", imageUrl: "", videoUrl: "" },

  company: {
    name: { am: "", ru: "", en: "", ar: "", fr: "" },
    nameColor: "#000000",
  },

  description: {
    am: "",
    ru: "",
    en: "",
    ar: "",
    fr: "",
    color: "#000000",
  },

  background: {
    type: "color",
    color: "#ffffff",
    imageUrl: "",
    videoUrl: "",
  },
};

// լեզուների ամբողջ ցանկ
const ALL_LANGS = [
  { code: "am", label: "Հայերեն (AM)" },
  { code: "ru", label: "Русский (RU)" },
  { code: "en", label: "English (EN)" },
  { code: "ar", label: "العربية (AR)" },
  { code: "fr", label: "Français (FR)" },
];
const ALL_CODES = ALL_LANGS.map((x) => x.code);

// always return full shape + back-compat mapping
function normalizeInfo(partial) {
  const i = partial || {};
  const avatar = {
    type: i.avatar?.type || (i.logo_url ? "image" : "image"),
    imageUrl: i.avatar?.imageUrl || i.logo_url || "",
    videoUrl: i.avatar?.videoUrl || "",
  };
  return {
    logo_url: i.logo_url || avatar.imageUrl || "",
    avatar,

    company: {
      nameColor: (i.company && i.company.nameColor) || "#000000",
      name: {
        am: i.company?.name?.am || "",
        ru: i.company?.name?.ru || "",
        en: i.company?.name?.en || "",
        ar: i.company?.name?.ar || "",
        fr: i.company?.name?.fr || "",
      },
    },

    description: {
      am: i.description?.am || "",
      ru: i.description?.ru || "",
      en: i.description?.en || "",
      ar: i.description?.ar || "",
      fr: i.description?.fr || "",
      color: i.description?.color || "#000000",
    },

    background: {
      type: i.background?.type || "color",
      color: i.background?.color || "#ffffff",
      imageUrl: i.background?.imageUrl || "",
      videoUrl: i.background?.videoUrl || "",
    },

    // share դաշտը թողնում ենք ինչ կա՝ ShareTab–ը ինքը կխումբագրի
    share: i.share || undefined,
  };
}

/* ---------- Reusable file button (translated) ---------- */
function FileButton({ label, accept, onChange }) {
  const inputRef = React.useRef(null);
  return h(
    React.Fragment,
    null,
    h(
      "button",
      {
        type: "button",
        className: "btn",
        onClick: () => inputRef.current && inputRef.current.click(),
      },
      label
    ),
    h("input", {
      ref: inputRef,
      type: "file",
      style: { display: "none" },
      accept,
      onChange,
    })
  );
}

export default function AdminDashboard({ token: propToken, onLogout, uiLang = "en" }) {
  const token =
    propToken ||
    sessionStorage.getItem("adminToken") ||
    localStorage.getItem("adminToken") ||
    "";

  const T = ADMIN_UI_TEXT[uiLang] || ADMIN_UI_TEXT.en;

  // tabs: "home" | "icons" | "brands" | "brandinfo" | "share" | "password"
  const [tab, setTab] = useState("home");
  const [showMenu, setShowMenu] = useState(false);

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [me, setMe] = useState(null);

  // Home (info.json)
  const [cardId, setCardId] = useState(null);
  const [info, setInfo] = useState(DEFAULT_INFO);
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");

  // լեզուների կարգավորումներ (ակտիվ + կարգ)
  const [langs, setLangs] = useState(["am", "ru", "en", "ar", "fr"]);

  // previews
  const [avatarPreview, setAvatarPreview] = useState("");
  const [bgImagePreview, setBgImagePreview] = useState("");
  const [bgVideoPreview, setBgVideoPreview] = useState("");

  // initial load
  useEffect(() => {
    (async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await adminMe(token);
        setMe(data?.admin || null);

        const inf = await adminGetInfo(token);
        setCardId(inf?.card_id || null);

        const root = inf?.information || inf || {};
        const normalized = normalizeInfo(root);
        setInfo(normalized);

        // languages from server
        const rawAvail = Array.isArray(root.available_langs)
          ? root.available_langs
          : null;

        let langsArr =
          rawAvail && rawAvail.length
            ? rawAvail.filter((code) => ALL_CODES.includes(code))
            : ALL_CODES.slice();

        const def =
          root.default_lang && ALL_CODES.includes(root.default_lang)
            ? root.default_lang
            : langsArr[0] || "am";

        if (def) {
          if (!langsArr.includes(def)) {
            langsArr = [def].concat(langsArr);
          } else {
            langsArr = [def].concat(langsArr.filter((c) => c !== def));
          }
        }

        const seen = new Set();
        langsArr = langsArr.filter((c) => {
          if (seen.has(c)) return false;
          seen.add(c);
          return true;
        });

        if (!langsArr.length) langsArr = ["am"];
        setLangs(langsArr);
      } catch (e) {
        setMsg(e.message || "Load failed");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  /* ===== Logout ===== */
  function doLogout() {
    try {
      sessionStorage.removeItem("adminToken");
      localStorage.removeItem("adminToken");
    } catch {}
    onLogout && onLogout();
  }

  /* ===== Info mutation helpers ===== */
  function setInfoPath(path, value) {
    setInfo((prev) => {
      const next = normalizeInfo(prev);
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!cur[keys[i]] || typeof cur[keys[i]] !== "object") {
          cur[keys[i]] = {};
        }
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return normalizeInfo(next);
    });
  }

  async function saveInfo() {
    setSavingInfo(true);
    setInfoMsg("");
    try {
      const payload = normalizeInfo(info);
      payload.available_langs = langs;
      payload.default_lang = langs[0] || "am";

      await adminSaveInfo(token, payload);
      setInfoMsg(T.saveOk);
    } catch (e) {
      setInfoMsg(e.message || T.saveError);
    } finally {
      setSavingInfo(false);
      setTimeout(() => setInfoMsg(""), 1500);
    }
  }

  function input(label, value, onChange, props) {
    return h(
      "label",
      { className: "block mb-3" },
      h("div", { className: "text-sm mb-1" }, label),
      h(
        "input",
        Object.assign(
          {
            className: "input",
            value: value || "",
            onChange: (e) => onChange(e.target.value),
          },
          props || {}
        )
      )
    );
  }

  function textarea(label, value, onChange, props) {
    return h(
      "label",
      { className: "block mb-3" },
      h("div", { className: "text-sm mb-1" }, label),
      h(
        "textarea",
        Object.assign(
          {
            className: "input h-28",
            value: value || "",
            onChange: (e) => onChange(e.target.value),
          },
          props || {}
        )
      )
    );
  }

  function bytesMB(n) {
    return (n / (1024 * 1024)).toFixed(1);
  }

  // small circular preview
  function CirclePreview(src, kind) {
    return h(
      "div",
      {
        style: {
          width: "64px",
          height: "64px",
          borderRadius: "9999px",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,.15)",
          background: "#fff",
          flex: "0 0 auto",
          display: "grid",
          placeItems: "center",
        },
      },
      src
        ? kind === "video"
          ? h("video", {
              src,
              muted: true,
              loop: true,
              playsInline: true,
              autoPlay: true,
              style: { width: "100%", height: "100%", objectFit: "cover" },
            })
          : h("img", {
              src,
              alt: "preview",
              style: { width: "100%", height: "100%", objectFit: "cover" },
            })
        : h("div", {
            style: {
              width: "60%",
              height: "60%",
              borderRadius: "9999px",
              background: "#e5e7eb",
            },
          })
    );
  }

  // ---- uploads ----
  async function handleAvatarUpload(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const isVid = info?.avatar?.type === "video";

    if (isVid) {
      if (!f.type.startsWith("video/")) {
        setInfoMsg("Ընդունվում են միայն վիդեոներ");
        return;
      }
      if (f.size > 20 * 1024 * 1024) {
        setInfoMsg(`Վիդեոն մեծ է (${bytesMB(f.size)} MB) — մաքս. 20 MB`);
        return;
      }
    } else {
      if (!f.type.startsWith("image/")) {
        setInfoMsg("Ընդունվում են միայն նկարներ");
        return;
      }
    }

    setAvatarPreview(URL.createObjectURL(f));

    try {
      const field = isVid ? "avatar.videoUrl" : "avatar.imageUrl";
      const res = await uploadFile(token, f, field);

      if (res?.information) {
        if (!isVid) {
          res.information.logo_url = res.url;
        }
        setInfo(normalizeInfo(res.information));
      } else {
        if (isVid) {
          setInfoPath("avatar.videoUrl", res.url);
        } else {
          setInfoPath("avatar.imageUrl", res.url);
          setInfoPath("logo_url", res.url);
        }
      }

      setInfoMsg(isVid ? "Avatar video ✔" : "Avatar image ✔");
    } catch (err) {
      setInfoMsg(err.message || "Upload failed");
    } finally {
      e.target.value = "";
    }
  }

  async function handleBgImageUpload(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setInfoMsg("Ընդունվում են միայն նկարներ");
      return;
    }
    setBgImagePreview(URL.createObjectURL(f));
    try {
      const res = await uploadFile(token, f, "background.imageUrl");
      if (res?.information) {
        setInfo(normalizeInfo(res.information));
      } else {
        setInfoPath("background.imageUrl", res.url);
      }
      setInfoPath("background.type", "image");
      setInfoMsg("Background image ✔");
    } catch (err) {
      setInfoMsg(err.message || "Upload failed");
    } finally {
      e.target.value = "";
    }
  }

  async function handleBgVideoUpload(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setInfoMsg("Ընդունվում են միայն վիդեոներ");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setInfoMsg(`Վիդեոն մեծ է (${bytesMB(f.size)} MB) — մաքս. 20 MB`);
      return;
    }
    setBgVideoPreview(URL.createObjectURL(f));
    try {
      const res = await uploadFile(token, f, "background.videoUrl");
      if (res?.information) {
        setInfo(normalizeInfo(res.information));
      } else {
        setInfoPath("background.videoUrl", res.url);
      }
      setInfoPath("background.type", "video");
      setInfoMsg("Background video ✔");
    } catch (err) {
      setInfoMsg(err.message || "Upload failed");
    } finally {
      e.target.value = "";
    }
  }

  function handleAvatarTypeChange(val) {
    setInfo((prev) => {
      const next = normalizeInfo(prev);
      next.avatar.type = val;
      setAvatarPreview("");
      return next;
    });
  }

  function handleBgTypeChange(val) {
    setInfoPath("background.type", val);
    if (val === "color") {
      setBgImagePreview("");
      setBgVideoPreview("");
      setInfoPath("background.imageUrl", "");
      setInfoPath("background.videoUrl", "");
    } else if (val === "image") {
      setBgVideoPreview("");
      setInfoPath("background.videoUrl", "");
    } else {
      setBgImagePreview("");
      setInfoPath("background.imageUrl", "");
    }
  }

  /* --- լեզուների helper-ներ --- */
  function toggleLang(code) {
    setLangs((prev) => {
      const exists = prev.includes(code);
      if (exists) {
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== code);
      }
      return [...prev, code];
    });
  }

  function moveLang(code, dir) {
    setLangs((prev) => {
      const idx = prev.indexOf(code);
      if (idx === -1) return prev;
      const nextIdx = dir === "up" ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= prev.length) return prev;
      const arr = prev.slice();
      const [item] = arr.splice(idx, 1);
      arr.splice(nextIdx, 0, item);
      return arr;
    });
  }

  /* dropdown menu item */
  function TabMenuItem(id, label) {
    const active = tab === id;
    return h(
      "button",
      {
        key: id,
        type: "button",
        className: "list-menu-item" + (active ? " active" : ""),
        onClick: () => {
          setTab(id);
          setShowMenu(false);
        },
      },
      label
    );
  }

  /* 3 կետանոց մենյուի anchor (card-ի վերևի աջ) */
  function TabsAnchor() {
    if (!token || loading) return null;
    return h(
      "div",
      { className: "menu-anchor" },
      h(
        "button",
        {
          type: "button",
          className: "btn-ghost",
          onClick: () => setShowMenu((v) => !v),
        },
        "⋮"
      ),
      showMenu &&
        h(
          "div",
          { className: "popup-menu" },
          TabMenuItem("home", T.tabs.home),
          TabMenuItem("icons", T.tabs.icons),
          TabMenuItem("brands", T.tabs.brands),
          TabMenuItem("brandinfo", T.tabs.brandinfo),
          TabMenuItem("share", T.tabs.share),
          TabMenuItem("password", T.tabs.password),
          h(
            "button",
            {
              type: "button",
              className: "list-menu-item",
              onClick: () => {
                setShowMenu(false);
                doLogout();
              },
            },
            T.logout
          )
        )
    );
  }

  /* small helpers for render */
  const Card = (title, children) =>
    h(
      "div",
      { className: "card" },
      (title || (token && !loading)) &&
        h(
          "div",
          {
            className: "row",
            style: {
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: title ? 8 : 0,
            },
          },
          title && h("h2", { style: { margin: 0 } }, title),
          TabsAnchor()
        ),
      children || null
    );

  /* ====== PAGE: HOME ====== */
  const PageHome = Card(
    T.tabs.home,
    h(
      React.Fragment,
      null,
      /* LANGUAGES */
      h("h3", { className: "title mb-2" }, T.langsTitle),
      h(
        "div",
        { className: "mb-4" },
        h(
          "div",
          {
            className: "text-sm mb-2",
            style: { opacity: 0.75, width: 280 },
          },
          T.langsDescription
        ),

        ALL_LANGS.map(({ code, label }) => {
          const active = langs.includes(code);
          const idx = langs.indexOf(code);
          return h(
            "div",
            {
              key: code,
              className: "row mb-1",
              style: {
                display: "flex",
                marginLeft: "5px",
                alignItems: "center",
                opacity: active ? 1 : 0.4,
              },
            },
            h(
              "button",
              {
                type: "button",
                className: "btn",
                onClick: () => toggleLang(code),
                style: { padding: "2px 5px", width: 60 },
              },
              code.toUpperCase()
            ),

            h(
              "span",
              {
                style: { flex: 1, fontSize: "14px", fontFamily: "revert-layer", width: 100 },
              },
              label
            ),

            active &&
              h(
                "span",
                {
                  className: "small",
                  style: { minWidth: 60, fontSize: "13px", opacity: 0.8 },
                },
                idx === 0 ? T.defaultBadge : `#${idx + 1}`
              ),

            h(
              "div",
              { style: { display: "flex", gap: "4px" } },
              h(
                "button",
                {
                  type: "button",
                  className: "btn",
                  disabled: !active || idx <= 0,
                  onClick: () => moveLang(code, "up"),
                },
                "↑"
              ),
              h(
                "button",
                {
                  type: "button",
                  className: "btn",
                  disabled: !active || idx === langs.length - 1,
                  onClick: () => moveLang(code, "down"),
                },
                "↓"
              )
            )
          );
        })
      ),

      /* AVATAR */
      h("h3", { className: "title mb-2" }, T.avatarTitle),
      h(
        "label",
        { className: "block mb-3" },
        h("div", { className: "text-sm mb-1" }, T.typeLabel),
        h(
          "select",
          {
            className: "input",
            value: info?.avatar?.type || "image",
            onChange: (e) => handleAvatarTypeChange(e.target.value),
          },
          h("option", { value: "image" }, T.avatarTypeImage),
          h("option", { value: "video" }, T.avatarTypeVideo)
        )
      ),

      info?.avatar?.type === "image" &&
        h(
          "div",
          {
            className: "mb-4",
            style: { display: "flex", alignItems: "center", gap: "10px" },
          },
          CirclePreview(
            fileUrl(avatarPreview || info?.avatar?.imageUrl || info.logo_url),
            "image"
          ),
          input(
            T.avatarImageUrlLabel,
            info?.avatar?.imageUrl || info.logo_url || "",
            (v) => {
              setInfoPath("avatar.imageUrl", v);
              setInfoPath("logo_url", v);
            },
            { placeholder: "https://..." }
          ),
          h(FileButton, {
            label: T.chooseFileLabel,
            accept:
              "image/png,image/jpeg,image/webp,image/gif,image/svg+xml",
            onChange: handleAvatarUpload,
          })
        ),

      info?.avatar?.type === "video" &&
        h(
          "div",
          {
            className: "mb-4",
            id: "uploadImg",
            style: { display: "flex", alignItems: "center", gap: "12px" },
          },
          CirclePreview(
            fileUrl(avatarPreview || info?.avatar?.videoUrl || ""),
            "video"
          ),
          input(
            T.avatarVideoUrlLabel,
            info?.avatar?.videoUrl || "",
            (v) => setInfoPath("avatar.videoUrl", v),
            { placeholder: "/file/..." }
          ),
          h(FileButton, {
            label: T.chooseFileLabel,
            accept: "video/*,.mp4,.webm,.ogg",
            onChange: handleAvatarUpload,
          }),
          h("div", { className: "small" }, T.avatarVideoHint)
        ),

      /* COMPANY */
      h("h3", { className: "title mb-2" }, T.companyNameTitle),

      langs.map((code) => {
        const meta = ALL_LANGS.find((x) => x.code === code);
        const label = meta ? meta.label : code.toUpperCase();
        const placeholder =
          code === "am"
            ? "Անուն (AM)"
            : code === "ru"
            ? "Название (RU)"
            : code === "en"
            ? "Company Name (EN)"
            : code === "ar"
            ? "الاسم (AR)"
            : "Nom de l'entreprise (FR)";

        const extraProps =
          code === "ar" ? { dir: "rtl", placeholder } : { placeholder };

        return h(
          React.Fragment,
          { key: code },
          input(
            label,
            info?.company?.name?.[code] || "",
            (v) => setInfoPath(`company.name.${code}`, v),
            extraProps
          )
        );
      }),

      h(
        "div",
        { className: "row mb-4", id: "companyNameColor" },
        input(
          T.nameColorLabel,
          info?.company?.nameColor || "#000000",
          (v) => setInfoPath("company.nameColor", v),
          { style: { maxWidth: 200 } }
        ),
        h("input", {
          type: "color",
          value: info?.company?.nameColor || "#000000",
          onChange: (e) => setInfoPath("company.nameColor", e.target.value),
        })
      ),

      /* DESCRIPTION */
      h("h3", { className: "title mb-2" }, T.descriptionTitle),

      langs.map((code) => {
        const meta = ALL_LANGS.find((x) => x.code === code);
        const label = meta ? meta.label : code.toUpperCase();
        const placeholder =
          code === "am"
            ? "Նկարագրություն (AM)"
            : code === "ru"
            ? "Описание (RU)"
            : code === "en"
            ? "Description (EN)"
            : code === "ar"
            ? "الوصف (AR)"
            : "Description (FR)";

        const extraProps =
          code === "ar" ? { dir: "rtl", placeholder } : { placeholder };

        return h(
          React.Fragment,
          { key: code },
          textarea(
            label,
            info?.description?.[code] || "",
            (v) => setInfoPath(`description.${code}`, v),
            extraProps
          )
        );
      }),

      h(
        "div",
        { className: "row mb-4", id: "descriptionColor" },
        input(
          T.descriptionColorLabel,
          info?.description?.color || "#000000",
          (v) => setInfoPath("description.color", v),
          { style: { maxWidth: 180 } }
        ),
        h("input", {
          type: "color",
          value: info?.description?.color || "#000000",
          onChange: (e) => setInfoPath("description.color", e.target.value),
        })
      ),

      /* BACKGROUND */
      h("h3", { className: "title mb-2" }, T.backgroundTitle),
      h(
        "label",
        { className: "block mb-3", id: "selectOurBackground" },
        h("div", { className: "text-sm mb-1" }, T.typeLabel),
        h(
          "select",
          {
            className: "input",
            value: info?.background?.type || "color",
            onChange: (e) => handleBgTypeChange(e.target.value),
          },
          h("option", { value: "color" }, T.backgroundTypeColor),
          h("option", { value: "image" }, T.backgroundTypeImage),
          h("option", { value: "video" }, T.backgroundTypeVideo)
        )
      ),

      info?.background?.type === "color" &&
        h(
          "div",
          { className: "row mb-4" },
          input(
            T.backgroundColorLabel,
            info?.background?.color || "#ffffff",
            (v) => setInfoPath("background.color", v),
            { style: { maxWidth: 180 } }
          ),
          h("input", {
            type: "color",
            value: info?.background?.color || "#ffffff",
            onChange: (e) =>
              setInfoPath("background.color", e.target.value),
          })
        ),

      info?.background?.type === "image" &&
        h(
          "div",
          {
            className: "row mb-3",
            style: {
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            },
          },
          CirclePreview(
            fileUrl(bgImagePreview || info?.background?.imageUrl || ""),
            "image"
          ),
          input(
            T.backgroundImageUrlLabel,
            info?.background?.imageUrl || "",
            (v) => setInfoPath("background.imageUrl", v),
            { placeholder: "https://..." }
          ),
          h(FileButton, {
            label: T.chooseFileLabel,
            accept:
              "image/png,image/jpeg,image/webp,image/gif,image/svg+xml",
            onChange: handleBgImageUpload,
          })
        ),

      info?.background?.type === "video" &&
        h(
          "div",
            {
              className: "row mb-3",
              style: { display: "flex", alignItems: "center", gap: "12px" },
            },
          CirclePreview(
            fileUrl(bgVideoPreview || info?.background?.videoUrl || ""),
            "video"
          ),
          input(
            T.backgroundVideoUrlLabel,
            info?.background?.videoUrl || "",
            (v) => setInfoPath("background.videoUrl", v),
            { placeholder: "/file/..." }
          ),
          h(FileButton, {
            label: T.chooseFileLabel,
            accept: "video/*,.mp4,.webm,.ogg",
            onChange: handleBgVideoUpload,
          }),
          h("div", { className: "small" }, T.backgroundVideoHint)
        ),

      h(
        "div",
        { className: "row mt-4" },
        h(
          "button",
          {
            className: "btn",
            disabled: savingInfo,
            onClick: saveInfo,
          },
          savingInfo ? T.savingButton : T.saveButton
        ),

        (infoMsg || msg) && h("div", { className: "small" }, infoMsg || msg)
      )
    )
  );

  /* ===== other tabs ===== */
  const PageIcons = Card(T.tabs.icons, h(IconsTab, { langs, uiLang }));
  const PageBrands = Card(T.tabs.brands, h(BrandsTab, { langs, uiLang }));
  const PageBrandInfo = Card(
    T.tabs.brandinfo,
    h(BrandInfoTab, { langs, uiLang })
  );
  const PageShare = Card(
    T.tabs.share,
    h(ShareTab, { cardId, info, uiLang })
  );
  const PagePassword = Card(
    T.tabs.password,
    h(PasswordTab, { token, uiLang })
  );

  const pages = {
    home: PageHome,
    icons: PageIcons,
    brands: PageBrands,
    brandinfo: PageBrandInfo,
    share: PageShare,
    password: PagePassword,
  };

  const TITLE_MAP = {
    home: T.tabs.home,
    icons: T.tabs.icons,
    brands: T.tabs.brands,
    brandinfo: T.tabs.brandinfo,
    share: T.tabs.share,
    password: T.tabs.password,
  };
  const headerTitle = `${T.headerAdminPrefix} • ${
    TITLE_MAP[tab] || T.tabs.home
  }`;

  const bodyContent = !token
    ? Card(T.needLoginTitle, T.needLoginBody)
    : loading
    ? Card(T.loading)
    : pages[tab] || PageHome;

  return h(
    PhoneShell,
    { title: headerTitle, light: true },
    showMenu &&
      h("div", {
        className: "menu-backdrop",
        onClick: () => setShowMenu(false),
      }),
    bodyContent
  );
}
