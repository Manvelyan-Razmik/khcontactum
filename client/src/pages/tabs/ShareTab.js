// client/src/pages/tabs/ShareTab.js
import React from "react";
import { adminSaveInfo } from "../../api.js";

const h = React.createElement;

/* ---------- CONSTANTS ---------- */
// ՄԻՇՏ լիարժեք https domain, վերջում մի հատ "/"-ով
const ONLINE_BASE = "https://khcontactum.com/"; // fixed, non-editable

/* ---------- UI TEXT BY LANGUAGE ---------- */
const SHARE_UI_TEXT = {
  am: {
    titleMain: "Share / QR",
    intro: "QR կոդով և share հղումով կարող եք կիսվել ձեր քարտով։",
    onlineTitle: "Online QR · Հղում",
    onlineLabel: "Քարտի public link-ը",
    onlineHelp: "Հիմքը անփոփոխ է, մուտքագրեք միայն card_id / path-ը։",

    offlineTitle: "Offline QR & Կոնտակտներ",
    offlineIntro:
      "Այս տվյալները կօգտագործվեն offline QR կոդի և “Ավելացրեք ինձ կոնտակտների ցանկում” կոճակի համար։",

    fullNameLabel: "Անուն, ազգանուն",
    phoneLabel: "Հեռախոս",
    phonePlaceholder: "+374...",

    quickTitle: "Արագ կիսվելու ձևեր",
    quickIntro: "Ընտրիր՝ որ icon-ները երևան կիսվելու հատվածում։",

    colorsTitle: "Գույներ",
    colorBtnText: "Կոճակի տեքստի գույնը",
    colorBtnBg: "Կոճակի ֆոնի գույնը",
    colorShareTitle: "“Կիսվել իմ քարտով” տեքստի գույնը",

    saveButton: "Պահել",
    savingButton: "Պահվում է...",
    msgNoToken: "Token չկա, նորից login արեք",
    msgSaveOk: "Պահվեց ✅",
    msgSaveError: "Սխալ պահելիս",
    pathReset: "Վերակայել card_id-ով",
    pathInvalid: "Սխալ path․ միայն թվեր/սիմվոլներ, բացակայեն բացատները։",

    channelLabels: {
      fb: "Facebook",
      tg: "Telegram",
      ln: "LinkedIn",
      wa: "WhatsApp",
      mail: "Email",
      viber: "Viber",
      ig: "Instagram",
    },
  },
  ru: {
    titleMain: "Share / QR",
    intro:
      "Вы можете делиться своей карточкой через QR-код и ссылку для шаринга.",
    onlineTitle: "Online QR · Ссылка",
    onlineLabel: "Публичная ссылка на карточку",
    onlineHelp:
      "База фиксирована, введите только card_id / путь.",

    offlineTitle: "Offline QR и контакты",
    offlineIntro:
      "Эти данные будут использованы для офлайн QR-кода и кнопки «Добавьте меня в список контактов».",

    fullNameLabel: "Имя, фамилия",
    phoneLabel: "Телефон",
    phonePlaceholder: "+7...",

    quickTitle: "Способы быстрого шаринга",
    quickIntro:
      "Выберите, какие иконки будут отображаться в блоке шаринга.",

    colorsTitle: "Цвета",
    colorBtnText: "Цвет текста кнопки",
    colorBtnBg: "Цвет фона кнопки",
    colorShareTitle: "Цвет текста «Поделиться моей карточкой»",

    saveButton: "Сохранить",
    savingButton: "Сохранение...",
    msgNoToken: "Нет токена, войдите заново",
    msgSaveOk: "Сохранено ✅",
    msgSaveError: "Ошибка при сохранении",
    pathReset: "Сбросить на card_id",
    pathInvalid:
      "Неверный путь: только символы/цифры, без пробелов.",

    channelLabels: {
      fb: "Facebook",
      tg: "Telegram",
      ln: "LinkedIn",
      wa: "WhatsApp",
      mail: "Email",
      viber: "Viber",
      ig: "Instagram",
    },
  },
  en: {
    titleMain: "Share / QR",
    intro: "You can share your card via QR code and a share link.",
    onlineTitle: "Online QR · Link",
    onlineLabel: "Public link of the card",
    onlineHelp:
      "Base is fixed. Enter only your card_id / path.",

    offlineTitle: "Offline QR & Contacts",
    offlineIntro:
      "These details will be used for the offline QR code and the “Add me to the contact list” button.",

    fullNameLabel: "Full name",
    phoneLabel: "Phone",
    phonePlaceholder: "+1...",

    quickTitle: "Quick share options",
    quickIntro: "Choose which icons will appear in the share section.",

    colorsTitle: "Colors",
    colorBtnText: "Button text color",
    colorBtnBg: "Button background color",
    colorShareTitle: "“Share my card” text color",

    saveButton: "Save",
    savingButton: "Saving...",
    msgNoToken: "No token, please log in again",
    msgSaveOk: "Saved ✅",
    msgSaveError: "Error while saving",
    pathReset: "Reset to card_id",
    pathInvalid:
      "Invalid path: letters/numbers/-/_ only, no spaces.",

    channelLabels: {
      fb: "Facebook",
      tg: "Telegram",
      ln: "LinkedIn",
      wa: "WhatsApp",
      mail: "Email",
      viber: "Viber",
      ig: "Instagram",
    },
  },
  ar: {
    titleMain: "Share / QR",
    intro: "يمكنك مشاركة بطاقتك عبر رمز QR ورابط المشاركة.",
    onlineTitle: "رمز QR أونلاين · الرابط",
    onlineLabel: "الرابط العلني للبطاقة",
    onlineHelp:
      "الأساس ثابت. أدخِل فقط card_id / المسار.",

    offlineTitle: "رمز QR أوفلاين وجهات الاتصال",
    offlineIntro:
      "سيتم استخدام هذه البيانات لرمز QR الأوفلاين وزر «أضِفني إلى قائمة جهات الاتصال».",

    fullNameLabel: "الاسم الكامل",
    phoneLabel: "رقم الهاتف",
    phonePlaceholder: "+971...",

    quickTitle: "طرق المشاركة السريعة",
    quickIntro: "اختر الأيقونات التي ستظهر في قسم المشاركة.",

    colorsTitle: "الألوان",
    colorBtnText: "لون نص الزر",
    colorBtnBg: "لون خلفية الزر",
    colorShareTitle: "لون نص «مشاركة بطاقتي»",

    saveButton: "حفظ",
    savingButton: "جارٍ الحفظ...",
    msgNoToken: "لا يوجد رمز (token)، يرجى تسجيل الدخول مرة أخرى",
    msgSaveOk: "تم الحفظ ✅",
    msgSaveError: "حدث خطأ أثناء الحفظ",
    pathReset: "إعادة إلى card_id",
    pathInvalid:
      "مسار غير صالح: أحرف/أرقام/-/_ فقط، بلا مسافات.",

    channelLabels: {
      fb: "Facebook",
      tg: "Telegram",
      ln: "LinkedIn",
      wa: "WhatsApp",
      mail: "Email",
      viber: "Viber",
      ig: "Instagram",
    },
  },
  fr: {
    titleMain: "Share / QR",
    intro:
      "Vous pouvez partager votre carte via un code QR et un lien de partage.",
    onlineTitle: "QR en ligne · Lien",
    onlineLabel: "Lien public de la carte",
    onlineHelp:
      "La base est fixe. Saisissez uniquement votre card_id / chemin.",

    offlineTitle: "QR hors ligne & Contacts",
    offlineIntro:
      "Ces informations seront utilisées pour le QR hors ligne et le bouton « Ajoutez-moi à la liste de contacts ».",

    fullNameLabel: "Nom et prénom",
    phoneLabel: "Téléphone",
    phonePlaceholder: "+33...",

    quickTitle: "Modes de partage rapide",
    quickIntro:
      "Choisissez quelles icônes apparaîtront dans la section de partage.",

    colorsTitle: "Couleurs",
    colorBtnText: "Couleur du texte du bouton",
    colorBtnBg: "Couleur de fond du bouton",
    colorShareTitle:
      "Couleur du texte « Partager ma carte »",

    saveButton: "Enregistrer",
    savingButton: "Enregistrement...",
    msgNoToken: "Pas de jeton, veuillez vous reconnecter",
    msgSaveOk: "Enregistré ✅",
    msgSaveError: "Erreur lors de l’enregistrement",
    pathReset: "Réinitialiser avec card_id",
    pathInvalid:
      "Chemin invalide : lettres/chiffres/-/_ uniquement, pas d’espaces.",

    channelLabels: {
      fb: "Facebook",
      tg: "Telegram",
      ln: "LinkedIn",
      wa: "WhatsApp",
      mail: "Email",
      viber: "Viber",
      ig: "Instagram",
    },
  },
};

/* ---------- defaults & helpers ---------- */
const DEFAULT_QUICK = {
  fb: true,
  tg: true,
  ln: true,
  wa: true,
  mail: false,
  viber: false,
  ig: false,
};

function normalizeShare(raw, cardId) {
  const s = raw && typeof raw === "object" ? raw : {};
  const rawUrl = (s.onlineUrl || "").toString().trim();

  // derive path part after ONLINE_BASE (if any)
  let path = "";
  if (rawUrl.startsWith(ONLINE_BASE)) {
    path = rawUrl.slice(ONLINE_BASE.length);
  } else if (rawUrl) {
    // if user had stored only number or short path before
    path = rawUrl.replace(/^https?:\/\/[^/]+\//i, "");
  }

  // reasonable default: use cardId if exists
  if (!path && cardId) path = String(cardId);

  return {
    // now we store both for UI; on save we will compose full URL
    onlineUrl: rawUrl || (cardId ? ONLINE_BASE + cardId : ""),
    onlinePath: (s.onlinePath || path || "").toString().trim(),

    offlineFullName: (s.offlineFullName || "").toString().trim(),
    offlinePhone: (s.offlinePhone || "").toString().trim(),
    shareText: (s.shareText || "").toString().trim(),
    quick: Object.assign({}, DEFAULT_QUICK, s.quick || {}),
    styles: {
      btnTextColor: (s.styles && s.styles.btnTextColor) || "#ffffff",
      btnBgColor: (s.styles && s.styles.btnBgColor) || "#000000",
      shareTitleColor:
        (s.styles && s.styles.shareTitleColor) || "#000000",
    },
  };
}

function isValidPath(p) {
  // allow digits/letters/-/_ (so future slugs also ok), no spaces, no //, no protocol
  if (!p) return false;
  if (/^https?:\/\//i.test(p)) return false;
  if (p.includes(" ")) return false;
  return /^[A-Za-z0-9\-_]+$/.test(p);
}

/* ---------- component ---------- */
export default function ShareTab({ cardId, info, uiLang = "am" }) {
  const T = SHARE_UI_TEXT[uiLang] || SHARE_UI_TEXT.am;

  const [share, setShare] = React.useState(
    () => normalizeShare(info && info.share, cardId)
  );
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  React.useEffect(() => {
    setShare(normalizeShare(info && info.share, cardId));
  }, [info, cardId]);

  function setField(key, value) {
    setShare((prev) => ({ ...prev, [key]: value }));
  }

  function setQuick(key, value) {
    setShare((prev) => ({
      ...prev,
      quick: { ...(prev.quick || {}), [key]: !!value },
    }));
  }

  function setStyleColor(key, value) {
    setShare((prev) => ({
      ...prev,
      styles: { ...(prev.styles || {}), [key]: value },
    }));
  }

  function composeOnlineUrl(path) {
    const clean = String(path || "").replace(/^\/+/, "");
    return ONLINE_BASE + clean;
  }

  async function save() {
    const token =
      (typeof sessionStorage !== "undefined" &&
        sessionStorage.getItem("adminToken")) ||
      (typeof localStorage !== "undefined" &&
        localStorage.getItem("adminToken")) ||
      "";
    if (!token) {
      setMsg(T.msgNoToken);
      return;
    }

    // validate path
    const path = share.onlinePath || "";
    if (!isValidPath(path)) {
      setMsg(T.pathInvalid);
      setTimeout(() => setMsg(""), 2000);
      return;
    }

    setSaving(true);
    setMsg("");
    try {
      const payload = {
        ...(info || {}),
        share: {
          ...share,
          onlineUrl: composeOnlineUrl(path),
        },
      };
      await adminSaveInfo(token, payload);
      setMsg(T.msgSaveOk);
    } catch (e) {
      setMsg(e.message || T.msgSaveError);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 1500);
    }
  }

  function colorRow(label, key) {
    const val = (share.styles && share.styles[key]) || "#000000";
    const onChange = (v) => setStyleColor(key, v || "#000000");

    return h(
      "label",
      { className: "block mb-3" },
      h("div", { className: "text-sm mb-1" }, label),
      h(
        "div",
        { className: "row", style: { alignItems: "center", gap: 8 } },
        h("input", {
          type: "color",
          value: val,
          onChange: (e) => onChange(e.target.value),
        }),
        h("input", {
          className: "input",
          style: { maxWidth: 160 },
          value: val,
          onChange: (e) => onChange(e.target.value),
        })
      )
    );
  }

  const channelLabels =
    (T && T.channelLabels) || SHARE_UI_TEXT.am.channelLabels;

  const urlPlaceholder =
    ONLINE_BASE + (cardId ? String(cardId) : "101");

  return h(
    React.Fragment,
    null,

    h("h3", { className: "title mb-2" }, T.titleMain),

    h(
      "p",
      {
        id: "shareFirstText",
        className: "small mb-3",
        style: { maxWidth: 360 },
      },
      T.intro
    ),

    // ONLINE LINK (fixed prefix + editable suffix)
    h("h4", { className: "title mb-1" }, T.onlineTitle),
    h(
      "label",
      { className: "block mb-2" },
      h("div", { className: "text-sm mb-1" }, T.onlineLabel),

      // input group: non-editable base + editable path
      h(
        "div",
        {
          className: "row",
          style: {
            alignItems: "stretch",
            gap: 0,
          },
        },
        // prefix (read-only)
        h(
          "span",
          {
            className: "input",
            style: {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              whiteSpace: "nowrap",
              userSelect: "text",
              background: "#f4f5f7",
              color: "#333",
            },
          },
          ONLINE_BASE
        ),
        // editable path
        h("input", {
          className: "input",
          style: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
          value: share.onlinePath || "",
          placeholder: (cardId && String(cardId)) || "101",
          onChange: (e) =>
            setField("onlinePath", e.target.value.trim()),
        })
      ),
      h(
        "div",
        { className: "small", style: { opacity: 0.7, marginTop: 6 } },
        T.onlineHelp
      ),
      h(
        "div",
        { className: "row", style: { gap: 8, marginTop: 8 } },
        h(
          "button",
          {
            type: "button",
            className: "btn",
            onClick: () =>
              setField("onlinePath", cardId ? String(cardId) : ""),
          },
          T.pathReset
        ),
        h(
          "div",
          { className: "small", style: { opacity: 0.8 } },
          composeOnlineUrl(share.onlinePath || cardId || "101")
        )
      )
    ),

    // OFFLINE QR & CONTACTS
    h("h4", { className: "title mb-1" }, T.offlineTitle),
    h(
      "p",
      {
        className: "small mb-3",
        id: "offlineQRText",
        style: { maxWidth: 360 },
      },
      T.offlineIntro
    ),

    h(
      "label",
      { className: "block mb-3" },
      h("div", { className: "text-sm mb-1" }, T.fullNameLabel),
      h("input", {
        className: "input",
        value: share.offlineFullName,
        onChange: (e) => setField("offlineFullName", e.target.value),
      })
    ),

    h(
      "div",
      { className: "row mb-4", style: { gap: 8 } },
      h(
        "label",
        { className: "block", style: { flex: 1 } },
        h("div", { className: "text-sm mb-1" }, T.phoneLabel),
        h("input", {
          className: "input",
          value: share.offlinePhone,
          placeholder: T.phonePlaceholder,
          onChange: (e) => setField("offlinePhone", e.target.value),
        })
      )
    ),

    // QUICK SHARE
    h("h4", { className: "title mb-1" }, T.quickTitle),
    h("p", { className: "small mb-2" }, T.quickIntro),

    ["fb", "tg", "ln", "wa", "mail", "viber", "ig"].map((key) => {
      const checked = !!share.quick[key];
      return h(
        "label",
        {
          key,
          className: "row mb-1",
          style: { alignItems: "center", gap: 8 },
        },
        h("input", {
          type: "checkbox",
          checked,
          onChange: (e) => setQuick(key, e.target.checked),
        }),
        h("span", { className: "small" }, channelLabels[key] || key)
      );
    }),

    // COLORS
    h(
      "h4",
      { className: "title mb-1", style: { marginTop: 16 } },
      T.colorsTitle
    ),
    colorRow(T.colorBtnText, "btnTextColor"),
    colorRow(T.colorBtnBg, "btnBgColor"),
    colorRow(T.colorShareTitle, "shareTitleColor"),

    h(
      "div",
      { className: "row mt-4" },
      h(
        "button",
        {
          type: "button",
          className: "btn",
          disabled: saving,
          onClick: save,
        },
        saving ? T.savingButton : T.saveButton
      ),
      msg && h("div", { className: "small" }, msg)
    )
  );
}
