// client/src/pages/PublicPage.js
import React from "react";
import { Helmet } from "react-helmet";
import PhoneShell from "../PhoneShell.js";
import HomePage from "../components/HomePage.js";

const h = React.createElement;

export default function PublicPage({ cardId }) {
  const url =
    typeof window !== "undefined" ? window.location.href : "https://your-domain.com/";
  const siteUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}/`
      : "https://your-domain.com/";

  // 👇 Public tab title
  const title = "KHContactum";

  const description =
    "Khachatryans Holding CJSC թվային այցեքարտ․ մեկ հարթակում՝ բոլոր կապի ուղիները, սոցիալական ցանցերն ու կայքը։";

  return h(
    React.Fragment,
    null,

    h(
      Helmet,
      null,
      // հիմնական SEO
      h("title", null, title),
      h("meta", { name: "description", content: description }),
      h("meta", {
        name: "keywords",
        content:
          "Khachatryans Holding, Holding CJSC, բիզնես, շինարարություն, տեխնոլոգիա, անշարժ գույք, digital business card, թվային այցեքարտ",
      }),
      h("meta", { name: "robots", content: "index,follow" }),

      // canonical
      h("link", { rel: "canonical", href: url }),

      // Open Graph
      h("meta", { property: "og:title", content: title }),
      h("meta", { property: "og:description", content: description }),
      h("meta", { property: "og:type", content: "website" }),
      h("meta", { property: "og:url", content: url }),
      h("meta", { property: "og:image", content: `${siteUrl}og-card-default.jpg` }),

      // Twitter Card
      h("meta", { name: "twitter:card", content: "summary_large_image" }),
      h("meta", { name: "twitter:title", content: title }),
      h("meta", { name: "twitter:description", content: description }),
      h("meta", { name: "twitter:image", content: `${siteUrl}og-card-default.jpg` }),

      // Structured Data (Organization)
      h(
        "script",
        { type: "application/ld+json" },
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "KHACHATRYANS HOLDING CJSC",
          url: siteUrl,
          logo: `${siteUrl}logo192.png`,
        })
      )
    ),

    h(
      PhoneShell,
      {
        title: "",
        light: true,
        hideHeader: true,
      },
      h(HomePage, { cardId, inShell: true })
    )
  );
}
