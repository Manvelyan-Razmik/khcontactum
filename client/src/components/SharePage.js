// client/src/components/SharePage.js
import React from "react";
import "./Responcive.css";

// png icon-ներ
import fbIcon    from "../img/face.png";
import tgIcon    from "../img/tele.png";
import lnIcon    from "../img/linkdin.png";
import waIcon    from "../img/wp.png";
import mailIcon  from "../img/email.png";
import viberIcon from "../img/vb.png";
import igIcon    from "../img/insta.png";

const h = React.createElement;

/* ===== i18n text ===== */
const TEXT = {
  am: {
    scanBtn: "Սկանավորել QR կոդը",
    shareTitle: "Կիսվել իմ քարտով",
    addBtn: "ԱՎԵԼԱՑՐԵՔ ԻՆՁ ԿՈՆՏԱԿՏՆԵՐԻ ՑԱՆԿՈՒՄ",
    qrOnline: "ONLINE QR-CODE",
    qrOffline: "OFFLINE QR-CODE",
    offlineNote: "Սկանելուց հետո կարող եք պահպանել կոնտակտի մեջ։",
    qrTitle: "QR կոդ",
    qrDesc: "Ընտրեք Online/Offline տարբերակը և սկանավորեք:",
  },
  ru: {
    scanBtn: "СКАНИРОВАТЬ QR-КОД",
    shareTitle: "ПОДЕЛИТЬСЯ МОЕЙ ВИЗИТКОЙ",
    addBtn: "ДОБАВИТЬ В КОНТАКТЫ",
    qrOnline: "ОНЛАЙН QR-КОД",
    qrOffline: "ОФЛАЙН QR-КОД",
    offlineNote: "После сканирования можно сохранить в контактах.",
    qrTitle: "QR-код",
    qrDesc: "Выберите Online/Offline и отсканируйте.",
  },
  en: {
    scanBtn: "SCAN QR CODE",
    shareTitle: "SHARE MY CARD",
    addBtn: "ADD ME TO THE CONTACT LIST",
    qrOnline: "ONLINE QR-CODE",
    qrOffline: "OFFLINE QR-CODE",
    offlineNote: "After scanning you can save it to your contacts.",
    qrTitle: "QR code",
    qrDesc: "Pick Online/Offline and scan.",
  },
  ar: {
    scanBtn: "مسح رمز QR",
    shareTitle: "مشاركة بطاقتي",
    addBtn: "إضافتي إلى قائمة جهات الاتصال",
    qrOnline: "رمز QR عبر الإنترنت",
    qrOffline: "رمز QR بدون اتصال",
    offlineNote: "بعد المسح يمكنك حفظه في جهات الاتصال.",
    qrTitle: "رمز QR",
    qrDesc: "اختر عبر الإنترنت/بدون اتصال ثم امسح.",
  },
  fr: {
    scanBtn: "SCANNER LE QR CODE",
    shareTitle: "PARTAGER MA CARTE",
    addBtn: "M’AJOUTER À LA LISTE DE CONTACTS",
    qrOnline: "QR-CODE EN LIGNE",
    qrOffline: "QR-CODE HORS LIGNE",
    offlineNote: "Après le scan vous pouvez l’enregistrer dans vos contacts.",
    qrTitle: "Code QR",
    qrDesc: "Choisissez En ligne/Hors ligne et scannez.",
  },
};

const DEFAULT_QUICK = {
  fb: true,
  tg: true,
  ln: true,
  wa: true,
  mail: false,
  viber: false,
  ig: false,
};

function normalizeShare(raw) {
  const s = raw && typeof raw === "object" ? raw : {};
  return {
    onlineUrl: (s.onlineUrl || "").toString().trim(),
    offlineFullName: (s.offlineFullName || "").toString().trim(),
    offlinePhone: (s.offlinePhone || "").toString().trim(),
    quick: Object.assign({}, DEFAULT_QUICK, s.quick || {}),
    shareText: (s.shareText || "").toString().trim(),
    styles: {
      btnTextColor: (s.styles && s.styles.btnTextColor) || "#ffffff",
      btnBgColor:   (s.styles && s.styles.btnBgColor)   || "#000000",
      shareTitleColor:
        (s.styles && s.styles.shareTitleColor) || "#000000",
    },
  };
}

function defaultOnlineUrl(cardId) {
  if (typeof window === "undefined") {
    return "https://vcard.l4.am/arm/card-" + (cardId || "100001") + "--.html";
  }
  const origin = window.location.origin || "http://localhost:5173";
  return origin.replace(/\/+$/, "") + "/arm/card-" + (cardId || "100001") + "--.html";
}

// CRLF պարտադիր որոշ կոնտակտ-կլայենտների համար (iOS/Outlook)
function buildVCard(name, phone) {
  const safeName = (name || "").trim() || "KHContactum";
  const safePhone = (phone || "").trim();
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:" + safeName + ";;;;",
    "FN:" + safeName,
  ];
  if (safePhone) {
    lines.push("TEL;TYPE=CELL,VOICE;TYPE=pref:" + safePhone.replace(/\s+/g, ""));
  }
  lines.push("END:VCARD");
  return lines.join("\r\n");
}

/** icon meta՝ png-ներով */
const SHARE_ICON_META = {
  fb:   { label: "Facebook",  img: fbIcon },
  tg:   { label: "Telegram",  img: tgIcon },
  ln:   { label: "LinkedIn",  img: lnIcon },
  wa:   { label: "WhatsApp",  img: waIcon },
  mail: { label: "Email",     img: mailIcon },
  viber:{ label: "Viber",     img: viberIcon },
  ig:   { label: "Instagram", img: igIcon },
};

function buildShareUrl(kind, url, text) {
  const msg = (text ? text + " " : "") + url;
  const encUrl  = encodeURIComponent(url);
  const encText = encodeURIComponent(text || "");
  const encBoth = encodeURIComponent(msg);

  switch (kind) {
    case "fb":
      return "https://www.facebook.com/sharer/sharer.php?u=" + encUrl;
    case "tg":
      return "https://t.me/share/url?url=" + encUrl + "&text=" + encText;
    case "ln":
      return "https://www.linkedin.com/sharing/share-offsite/?url=" + encUrl;
    case "wa":
      return "https://wa.me/?text=" + encBoth;
    case "mail":
      return (
        "mailto:?subject=" +
        encodeURIComponent("KHContactum digital card") +
        "&body=" +
        encBoth
      );
    case "viber":
      return "viber://forward?text=" + encBoth;
    case "ig":
      // Instagram web share չկա
      return url;
    default:
      return url;
  }
}

/** icon button (png) */
function ShareIcon({ kind, onClick }) {
  const meta = SHARE_ICON_META[kind];
  if (!meta) return null;

  return h(
    "button",
    {
      type: "button",
      className: "share-icon-btn share-icon-" + kind,
      onClick,
      title: meta.label,
      style: {
        border: "none",
        background: "transparent",
        padding: 0,
        cursor: "pointer",
      },
    },
    h("img", {
      src: meta.img,
      alt: meta.label,
      loading: "lazy",
      style: { width: 36, height: 36, display: "block" },
    })
  );
}

/* =========
   vCard saver — Android/iOS overlay-first
   ========= */
async function saveVCardUniversal({ name, phone, fileName = "contact.vcf" }) {
  const vcard = buildVCard(name, phone);

  // Try two MIME variants (Android տարբեր սարքերում տարբերն է աշխատում)
  const blobs = [
    new Blob([vcard], { type: "text/x-vcard;charset=utf-8" }),
    new Blob([vcard], { type: "text/vcard;charset=utf-8" }),
  ];
  const files = [
    new File([blobs[0]], fileName, { type: "text/x-vcard" }),
    new File([blobs[1]], fileName, { type: "text/vcard" }),
  ];

  // 1) Prefer Web Share Level 2 with files → opens system share sheet OVERLAY (Android & iOS)
  try {
    const nav = typeof navigator !== "undefined" ? navigator : null;

    // Some Androids support share(files) even if canShare is absent/false → try directly
    if (nav && nav.share) {
      try {
        await nav.share({ title: "KHContactum", text: "Save my contact", files: [files[0]] });
        return;
      } catch (e1) {
        // retry with the second MIME
        try {
          await nav.share({ title: "KHContactum", text: "Save my contact", files: [files[1]] });
          return;
        } catch (e2) {}
      }
    }

    // Strict path with canShare check (Safari / some Chromes)
    if (nav && typeof nav.canShare === "function") {
      if (nav.canShare({ files: [files[0]] })) {
        await nav.share({ title: "KHContactum", text: "Save my contact", files: [files[0]] });
        return;
      }
      if (nav.canShare({ files: [files[1]] })) {
        await nav.share({ title: "KHContactum", text: "Save my contact", files: [files[1]] });
        return;
      }
    }
  } catch (_) {}

  // 2) Legacy Edge / IE download
  try {
    if (window.navigator && typeof window.navigator.msSaveOrOpenBlob === "function") {
      window.navigator.msSaveOrOpenBlob(blobs[1], fileName);
      return;
    }
  } catch (_) {}

  // 3) Safe download click (no new tab, SPA stays)
  try {
    const url = URL.createObjectURL(blobs[1]);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click(); // Android՝ ցույց է տալիս download snackbar / «Open» → Contacts
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 400);
    return;
  } catch (_) {}

  // 4) Last fallback — data URL (կարող է բացել preview նոր թաբում)
  try {
    const encoded = encodeURIComponent(vcard);
    const dataUrl = "data:text/x-vcard;charset=utf-8," + encoded;
    window.open(dataUrl, "_blank", "noopener,noreferrer");
  } catch (_) {}
}

/**
 * lang-ը կարող ես փոխանցել HomePage-ից.
 */
export default function SharePage({ info, cardId, lang }) {
  const share = normalizeShare(info && info.share);
  const [qrOpen, setQrOpen] = React.useState(false);
  const [qrMode, setQrMode] = React.useState("online");

  const activeLang =
    lang ||
    (typeof window !== "undefined"
      ? localStorage.getItem("lang") || "am"
      : "am");

  const t = TEXT[activeLang] || TEXT.am;

  const onlineUrl = share.onlineUrl || defaultOnlineUrl(cardId);
  const offlineName = share.offlineFullName || info?.company?.name?.en || "";
  const offlinePhone = share.offlinePhone || "";

  const shareText =
    share.shareText ||
    "Check out my KHContactum digital card…";

  // գույներ admin-ից
  const btnTextColor    = share.styles.btnTextColor    || "#ffffff";
  const btnBgColor      = share.styles.btnBgColor      || "#000000";
  const shareTitleColor = share.styles.shareTitleColor || "#000000";

  const quick = share.quick || DEFAULT_QUICK;
  const enabledKinds = Object.keys(quick).filter((k) => quick[k]);

  function onShare(kind) {
    const url = onlineUrl || (typeof window !== "undefined" ? window.location.href : "");
    if (!url) return;

    if (kind === "ig" && typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "KHContactum", text: shareText, url }).catch(() => {});
      return;
    }

    const href = buildShareUrl(kind, url, shareText);

    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      // viber://, mailto: — բացվում է արտաքին հարթակում, SPA-ն մնում է տեղում
      const a = document.createElement("a");
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  function currentQrValue() {
    if (qrMode === "offline") {
      return buildVCard(offlineName, offlinePhone);
    }
    return onlineUrl;
  }

  async function downloadVCard() {
    await saveVCardUniversal({
      name: offlineName,
      phone: offlinePhone,
      fileName: (offlineName || "contact").replace(/[^\w\-]+/g, "_") + ".vcf",
    });
  }

  const qrValue = currentQrValue();
  const encodedQr = encodeURIComponent(qrValue);
  const qrImgSrc =
    "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
    encodedQr;

  return h(
    "section",
    {
      style: {
        marginTop: 24,
        marginBottom: 24,
        textAlign: "center",
      },
    },

    h("h2", { style: { marginBottom: 4 } }, t.qrTitle),
    h(
      "p",
      {
        className: "small",
        style: { marginBottom: 16, maxWidth: 360, marginInline: "auto" },
      },
      t.qrDesc
    ),

    h(
      "button",
      {
        type: "button",
        className: "btn",
        style: {
          width: "80%",
          maxWidth: 360,
          margin: "0 auto 18px",
          background: btnBgColor,
          color: btnTextColor,
        },
        onClick: () => setQrOpen(true),
      },
      t.scanBtn
    ),

    h(
      "h3",
      {
        style: {
          margin: "0 0 10px",
          fontSize: 16,
          color: shareTitleColor,
        },
      },
      t.shareTitle
    ),

    h(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "center",
          gap: 14,
          marginBottom: 20,
          flexWrap: "wrap",
        },
      },
      enabledKinds.map((kind) =>
        h(ShareIcon, {
          key: kind,
          kind,
          onClick: () => onShare(kind),
        })
      )
    ),

    h(
      "button",
      {
        type: "button",
        className: "btn",
        style: {
          width: "80%",
          maxWidth: 360,
          margin: "0 auto",
          background: btnBgColor,
          color: btnTextColor,
        },
        onClick: downloadVCard,
      },
      t.addBtn
    ),

    qrOpen &&
      h(
        "div",
        {
          style: {
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 40,
            display: "grid",
            placeItems: "center",
          },
          onClick: () => setQrOpen(false),
        },
        h(
          "div",
          {
            className: "card",
            style: {
              position: "relative",
              maxWidth: 360,
              width: "90%",
              padding: 16,
              textAlign: "center",
            },
            onClick: (e) => e.stopPropagation(),
          },

          h(
            "button",
            {
              type: "button",
              onClick: () => setQrOpen(false),
              style: {
                position: "absolute",
                right: 8,
                top: 6,
                border: "none",
                background: "transparent",
                fontSize: 20,
                cursor: "pointer",
              },
            },
            "×"
          ),

          h(
            "div",
            {
              style: {
                display: "flex",
                gap: 8,
                marginBottom: 12,
              },
            },
            h(
              "button",
              {
                type: "button",
                className: "btn",
                style: {
                  flex: 1,
                  background: qrMode === "online" ? "#111" : "#eee",
                  color: qrMode === "online" ? "#fff" : "#111",
                },
                onClick: () => setQrMode("online"),
              },
              t.qrOnline
            ),
            h(
              "button",
              {
                type: "button",
                className: "btn",
                style: {
                  flex: 1,
                  background: qrMode === "offline" ? "#111" : "#eee",
                  color: qrMode === "offline" ? "#fff" : "#111",
                },
                onClick: () => setQrMode("offline"),
              },
              t.qrOffline
            )
          ),

          h("img", {
            src: qrImgSrc,
            alt: "QR code",
            loading: "lazy",
            style: { width: 260, height: 260, margin: "0 auto 8px" },
          }),

          qrMode === "offline" &&
            h(
              "div",
              { className: "small", style: { marginTop: 4 } },
              t.offlineNote
            )
        )
      )
  );
}
