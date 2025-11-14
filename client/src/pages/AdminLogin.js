// client/src/pages/AdminLogin.js
import React, { useState } from "react";
import PhoneShell from "../PhoneShell.js";
import { adminLogin } from "../api.js";

import "./AdminLogin.css";

import KHLogoHolding   from "../img/KH_HOLDING.png";
import KHLogoContactum from "../img/KHCONTACTUM1.png";

import phoneIcon    from "../img/phone.png";
import telegramIcon from "../img/telegram.png";
import viberIcon    from "../img/viber.png";
import whatsappIcon from "../img/watsapp.png";
import mailIcon     from "../img/mail.png";

const h = React.createElement;

const LANGS = ["en", "am", "fr", "ar", "ru"];

const TEXT = {
  am: {
    appTitle: "KHContactum",
    username: "Մուտքանուն",
    password: "Գաղտնաբառ",
    login: "Մուտք",
    description:
      "KHContactum թվային այցեքարտեր.Բիզնեսը սկսվում է մեկ հպումով․KHContactum LLC -ին Khachatryans Holding CJSC-ի հերթական նորարարական նախագիծն է, որը միավորում է տեխնոլոգիան և բիզնեսը։Ստեղծված է առաջնորդների համար, ովքեր գնահատում են ոճը և արդյունավետությունը։Ակնթարթային շփում NFC կամ QR կոդով՝ անհատական պրեմիում ձևավորմամբ Ձեր բրենդի համար։ KHContactum — բիզնես հաղորդակցության նոր լեզուն։",
    contactsLabel: "Կապ մեզ հետ",
  },
  ru: {
    appTitle: "KHContactum",
    username: "Имя пользователя",
    password: "Пароль",
    login: "Вход",
    description:
      "Цифровые визитки KHContactum. Бизнес начинается с одного прикосновения. KHContactum LLC — ещё один инновационный проект компании «Хачатрянс Холдинг», объединяющий технологии и бизнес. Созданы для лидеров, ценящих стиль и эффективность. Мгновенный контакт по NFC или QR-коду с индивидуальным премиальным дизайном для вашего бренда. KHContactum — новый язык делового общения.",
    contactsLabel: "Связаться с нами",
  },
  en: {
    appTitle: "KHContactum",
    username: "Username",
    password: "Password",
    login: "Login",
    description:
      "KHContactum digital business cards. Business starts with one touch. KHContactum LLC is another innovative project of Khachatryans Holding CJSC, which combines technology and business. Created for leaders who value style and efficiency. Instant contact via NFC or QR code with individual premium design for your brand. KHContactum — the new language of business communication.",
    contactsLabel: "Contact us",
  },
  ar: {
    appTitle: "KHContactum",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    login: "تسجيل الدخول",
    description:
      "بطاقات أعمال رقمية من KHContactum. تبدأ الأعمال بلمسة واحدة. KHContactum LLC هو مشروع مبتكر آخر من شركة خاتشاتريانز القابضة، يجمع بين التكنولوجيا والأعمال. صُمم للقادة الذين يُقدّرون الأناقة والكفاءة. تواصل فوري عبر تقنية NFC أو رمز الاستجابة السريعة مع تصميم مميز فريد لعلامتك التجارية. KHContactum - لغة التواصل الجديدة في عالم الأعمال.",
    contactsLabel: "اتصل بنا",
  },
  fr: {
    appTitle: "KHContactum",
    username: "Nom d'utilisateur",
    password: "Mot de passe",
    login: "Connexion",
    description:
      "Cartes de visite numériques KHContactum. Le commerce commence en un clic. KHContactum LLC est un projet innovant de Khachatryans Holding CJSC, alliant technologie et affaires. Conçues pour les dirigeants qui privilégient l'élégance et l'efficacité. Contact instantané par NFC ou QR code, avec un design premium personnalisé pour votre marque. KHContactum : le nouveau langage de la communication d'entreprise.",
    contactsLabel: "Contactez-nous",
  },
};

function contactIcon(src, alt, href) {
  const isHttp = /^https?:\/\//i.test(href);
  return h(
    "a",
    {
      key: alt,
      href,
      className: "admin-login-contact",
      target: isHttp ? "_blank" : undefined,
      rel: isHttp ? "noreferrer noopener" : undefined,
    },
    h("img", { src, alt })
  );
}

export default function AdminLogin({
  onSuccess,
  lang: initialLang = "en",
  onLangChange,
}) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");

  const [lang, setLang] = useState(initialLang);
  const t = TEXT[lang] || TEXT.en;

  // current URL (որպես fallback՝ "/admin")
  const currentHref =
    (typeof window !== "undefined" && window.location && window.location.href) ||
    "/admin";

  function handleLangChange(next) {
    setLang(next);
    if (onLangChange) onLangChange(next);
    try {
      // ✅ միայն sessionStorage — localStorage չենք օգտագործում
      sessionStorage.setItem("adminLang", next);
    } catch {}
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const { token } = await adminLogin(u, p);

      try {
        // ✅ token –ը նույնպես միայն sessionStorage-ում
        sessionStorage.setItem("adminToken", token);
      } catch {}

      onSuccess && onSuccess(token);
    } catch (e2) {
      setErr(e2.message || "Bad creds");
    }
  }

  return h(
    PhoneShell,
    { title: "" },
    h(
      "div",
      { className: "admin-login-root" },

      h(
        "div",
        {
          className: "admin-login-panel",
          dir: lang === "ar" ? "rtl" : "ltr",
          style: lang === "ar" ? { textAlign: "right" } : {},
        },

        h(
          "div",
          { className: "admin-login-header-row" },
          // ⬇ KHContactum clickable link + full refresh
          h(
            "a",
            {
              href: currentHref,
              className:
                "admin-login-app-title admin-login-app-title-link",
            },
            t.appTitle
          ),
          h(
            "select",
            {
              className: "admin-login-lang-select",
              value: lang,
              onChange: (e) => handleLangChange(e.target.value),
            },
            LANGS.map((L) =>
              h("option", { key: L, value: L }, L.toUpperCase())
            )
          )
        ),

        h(
          "form",
          { onSubmit: submit, className: "admin-login-form" },
          h("input", {
            className: "input admin-login-input",
            placeholder: t.username,
            autoComplete: "username",
            value: u,
            onChange: (e) => setU(e.target.value),
          }),

          // 👁 password + show/hide
          h(
            "div",
            {
              style: {
                position: "relative",
                width: "100%",
              },
            },
            h("input", {
              className: "input admin-login-input",
              placeholder: t.password,
              type: showPass ? "text" : "password",
              autoComplete: "current-password",
              value: p,
              onChange: (e) => setP(e.target.value),
              style: { paddingRight: 40 },
            }),
            h(
              "button",
              {
                type: "button",
                onClick: () => setShowPass((v) => !v),
                style: {
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 18,
                },
              },
              showPass ? "🤦‍♀️" : "🙎‍♀️"
            )
          ),

          h(
            "button",
            { className: "btn admin-login-btn", type: "submit" },
            t.login
          ),
          err &&
            h("div", { className: "admin-login-error" }, err)
        ),

        h(
          "div",
          { className: "admin-login-description" },
          t.description
        ),

        h(
          "div",
          { className: "admin-login-logos" },
          h("img", {
            src: KHLogoHolding,
            alt: "KH Holding",
            className: "admin-login-logo-img",
          }),
          h("img", {
            src: KHLogoContactum,
            alt: "KHContactum",
            className: "admin-login-logo-img1",
          })
        ),

        h(
          "div",
          { className: "admin-login-contacts" },
          h(
            "div",
            { className: "admin-login-contacts-label" },
            t.contactsLabel
          ),
          h(
            "div",
            { className: "admin-login-contacts-row" },
            contactIcon(
              phoneIcon,
              "Phone",
              "tel:+37477765334"
            ),
            contactIcon(
              telegramIcon,
              "Telegram",
              "https://t.me/KHachatryansHoldingCJSC"
            ),
            contactIcon(
              viberIcon,
              "Viber",
              "viber://add?number=%2B37477765334"
            ),
            contactIcon(
              whatsappIcon,
              "WhatsApp",
              "https://wa.me/37477765334"
            ),
            contactIcon(
              mailIcon,
              "Email",
              "mailto:contact@khachatryanholding.com"
            )
          )
        )
      )
    )
  );
}
