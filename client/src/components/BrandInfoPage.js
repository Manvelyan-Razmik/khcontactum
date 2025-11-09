// client/src/components/BrandInfoPage.js
import React from "react";
import "./Responcive.css";


const h = React.createElement;

/* helpers */
function filesBase() {
  if (typeof window === "undefined") return "http://localhost:5050";
  const host = window.location.hostname || "localhost";
  return "http://" + host + ":5050";
}
function absSrc(u = "") {
  if (!u) return "";
  if (/^(data:|https?:\/\/|blob:)/i.test(u)) return u;
  let s = String(u).trim();
  if (!s.startsWith("/")) s = "/" + s;
  return filesBase() + s;
}

function pickLang(v, lang, fallbacks = ["am","en","ru","ar","fr"]) {
  if (!v) return "";
  if (typeof v === "string") return v;
  const order = [lang, ...fallbacks.filter(x => x !== lang)];
  for (const k of order) {
    const s = v?.[k];
    if (s && String(s).trim()) return String(s).trim();
  }
  return "";
}

function hasKeyword(itemKeyword, activeKeyword) {
  const kw = (activeKeyword || "").trim().toLowerCase();
  if (!kw) return false;
  const raw = (itemKeyword || "").toString();
  return raw
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
    .includes(kw);
}

/* ---------- rating helpers (localStorage) ---------- */

const RATING_STORAGE_KEY = "brand-worker-rating-v1";

function readRatingMap() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(RATING_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {}
  return {};
}

function writeRatingMap(map) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RATING_STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

/* մեկ աշխատակցի քարտ */
function WorkerCard({ item, lang }) {
  const name = pickLang(item.name, lang);

  const descSource = item.description || item.bio || "";
  const desc = pickLang(descSource, lang);

  const slidesSource =
    Array.isArray(item.slides) && item.slides.length
      ? item.slides
      : (Array.isArray(item.gallery) ? item.gallery : []);

  const slides = slidesSource.map(absSrc).filter(Boolean).slice(0, 5);

  const avatarAbs = absSrc(item.avatar || "");

  const [index, setIndex] = React.useState(0);
  const hasSlides = slides.length > 0;
  const currentIdx = hasSlides ? (index % slides.length + slides.length) % slides.length : 0;
  const currentSlide = hasSlides ? slides[currentIdx] : "";

  const goPrev = () => {
    if (!hasSlides) return;
    setIndex(i => (i - 1 + slides.length) % slides.length);
  };
  const goNext = () => {
    if (!hasSlides) return;
    setIndex(i => (i + 1) % slides.length);
  };

  React.useEffect(() => {
    if (!hasSlides) return;
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [hasSlides, slides.length]);

  /* ---------- rating state ---------- */

  const ratingAllowed = item.ratingEnabled !== false; // default true

  const workerKey =
    (item.id && String(item.id)) ||
    (item.keyword && String(item.keyword)) ||
    ("worker-" + (name || "?"));

  const [vote, setVote] = React.useState(() => ({
    likes: Number(item.likes ?? 0) || 0,
    dislikes: Number(item.dislikes ?? 0) || 0,
    status: "none"
  }));

  React.useEffect(() => {
    const map = readRatingMap();
    const saved = map[workerKey];
    if (saved && typeof saved === "object") {
      setVote({
        likes: Number(saved.likes ?? item.likes ?? 0) || 0,
        dislikes: Number(saved.dislikes ?? item.dislikes ?? 0) || 0,
        status:
          saved.status === "like" || saved.status === "dislike"
            ? saved.status
            : "none"
      });
    } else {
      setVote({
        likes: Number(item.likes ?? 0) || 0,
        dislikes: Number(item.dislikes ?? 0) || 0,
        status: "none"
      });
    }
  }, [workerKey, item.likes, item.dislikes]);

  function persist(next) {
    const map = readRatingMap();
    map[workerKey] = {
      likes: next.likes,
      dislikes: next.dislikes,
      status: next.status
    };
    writeRatingMap(map);
  }

  function handleLike() {
    setVote(prev => {
      let next = { ...prev };
      if (prev.status === "like") {
        next.likes = Math.max(0, prev.likes - 1);
        next.status = "none";
      } else if (prev.status === "dislike") {
        next.dislikes = Math.max(0, prev.dislikes - 1);
        next.likes = prev.likes + 1;
        next.status = "like";
      } else {
        next.likes = prev.likes + 1;
        next.status = "like";
      }
      persist(next);
      return next;
    });
  }

  function handleDislike() {
    setVote(prev => {
      let next = { ...prev };
      if (prev.status === "dislike") {
        next.dislikes = Math.max(0, prev.dislikes - 1);
        next.status = "none";
      } else if (prev.status === "like") {
        next.likes = Math.max(0, prev.likes - 1);
        next.dislikes = prev.dislikes + 1;
        next.status = "dislike";
      } else {
        next.dislikes = prev.dislikes + 1;
        next.status = "dislike";
      }
      persist(next);
      return next;
    });
  }

  const likeActive = vote.status === "like";
  const dislikeActive = vote.status === "dislike";

  return h(
    "div",
    {
      className: "card worker-card-public",
      style: {
        marginBottom: 16,
        padding: 16,
        textAlign: "center"
      }
    },

    /* avatar շրջան */
    h("div", {
      style:{
        width:100,
        height:100,
        borderRadius:"50%",
        margin:"0 auto 10px",
        overflow:"hidden",
        background:"#f4f4f4",
        display:"grid",
        placeItems:"center",
        boxShadow:"0 4px 16px rgba(0,0,0,.12)"
      }
    },
      avatarAbs
        ? h("img", {
            src: avatarAbs,
            alt: name || "worker",
            style:{ width:"100%", height:"100%", objectFit:"cover" }
          })
        : h("span", {
            style:{ fontWeight:700, fontSize:22, color:"#777" }
          }, (name || "?").slice(0,2).toUpperCase())
    ),

    /* անուն */
    h("h3", {
      style:{
        margin:"4px 0 8px",
        fontSize:18,
        fontWeight:700
      }
    }, name || "—"),

    /* նկարագրություն */
    desc && h("div", {
      style:{
        margin:"0 auto 14px",
        maxWidth:320,
        padding:"10px 12px",
        borderRadius:14,
        background:"#fafafa",
        fontSize:14,
        lineHeight:1.5,
        textAlign:"left",
        whiteSpace:"pre-line"
      }
    }, desc),

    /* slider */
    hasSlides && h("div", {
      style:{
        margin:"0 auto 12px",
        maxWidth:340
      }
    },
      h("div", {
        style:{
          position:"relative",
          borderRadius:18,
          overflow:"hidden",
          background:"#f3f3f3",
          height:190,
          display:"grid",
          placeItems:"center"
        }
      },
        currentSlide && h("img", {
          src: currentSlide,
          alt:"",
          style:{
            width:"100%",
            height:"100%",
            objectFit:"cover",
            transition: "opacity .35s ease"
          }
        }),

        h("button", {
          type:"button",
          onClick: goPrev,
          style:{
            position:"absolute",
            left:8,
            top:"50%",
            transform:"translateY(-50%)",
            width:30,
            height:30,
            borderRadius:"50%",
            border:"none",
            background:"rgba(0,0,0,.45)",
            color:"#fff",
            display:"grid",
            placeItems:"center",
            cursor:"pointer"
          }
        }, "<"),

        h("button", {
          type:"button",
          onClick: goNext,
          style:{
            position:"absolute",
            right:8,
            top:"50%",
            transform:"translateY(-50%)",
            width:30,
            height:30,
            borderRadius:"50%",
            border:"none",
            background:"rgba(0,0,0,.45)",
            color:"#fff",
            display:"grid",
            placeItems:"center",
            cursor:"pointer"
          }
        }, ">")
      ),

      h("div", {
        style:{
          marginTop:6,
          display:"flex",
          justifyContent:"center",
          gap:6
        }
      },
        slides.map((_, i) =>
          h("span", {
            key:i,
            style:{
              width:8,
              height:8,
              borderRadius:"50%",
              background: i === currentIdx ? "#111" : "#d0d0d0"
            }
          })
        )
      )
    ),

    /* rating block – միայն եթե admin–ը միացրել է */
    ratingAllowed && h(React.Fragment, null,
      h("div", {
        style:{
          marginTop: 10,
          fontSize: 13,
          color: "#555",
          textAlign: "center"
        }
      }, "Գնահատեք աշխատակցին։"),

      h("div", {
        style:{
          marginTop: 6,
          display:"flex",
          justifyContent:"center",
          gap:12
        }
      },
        h("button", {
          type:"button",
          onClick: handleLike,
          style:{
            display:"flex",
            alignItems:"center",
            gap:6,
            padding:"6px 14px",
            borderRadius:999,
            border:"none",
            cursor:"pointer",
            fontSize:13,
            fontWeight:600,
            background: likeActive ? "#16a34a" : "#e5f7ea",
            color: likeActive ? "#fff" : "#166534",
            boxShadow: likeActive ? "0 0 0 1px rgba(0,0,0,.15)" : "none",
            minWidth:70,
            justifyContent:"center"
          }
        },
          h("span", null, "👍"),
          h("span", null, String(vote.likes ?? 0))
        ),

        h("button", {
          type:"button",
          onClick: handleDislike,
          style:{
            display:"flex",
            alignItems:"center",
            gap:6,
            padding:"6px 14px",
            borderRadius:999,
            border:"none",
            cursor:"pointer",
            fontSize:13,
            fontWeight:600,
            background: dislikeActive ? "#f97316" : "#fff7ed",
            color: dislikeActive ? "#fff" : "#9a3412",
            boxShadow: dislikeActive ? "0 0 0 1px rgba(0,0,0,.15)" : "none",
            minWidth:70,
            justifyContent:"center"
          }
        },
          h("span", null, "👎"),
          h("span", null, String(vote.dislikes ?? 0))
        )
      )
    )
  );
}

/**
 * Props:
 * - brandInfos: [{ id, keyword, name, bio/description, gallery/slides[], ratingEnabled }]
 * - keyword
 * - lang
 * - onBack()
 */
export default function BrandInfoPage({
  brandInfos = [],
  keyword = "",
  lang = "am",
  onBack
}) {
  React.useEffect(() => {
    const container = document.querySelector(".public-scroll-layer");
    if (container && typeof container.scrollTo === "function") {
      container.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else if (typeof window !== "undefined" && window.scrollTo) {
      window.scrollTo(0, 0);
    }
  }, [keyword]);

  const list = (Array.isArray(brandInfos) ? brandInfos : []).filter(item =>
    hasKeyword(item.keyword, keyword)
  );

  return h(
    "section",
    { className: "brandinfo-public", style: { padding: "10px 12px" } },

    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          marginBottom: 10,
          gap: 8
        }
      },
      h(
        "button",
        {
          type: "button",
          className: "btn",
          style: { padding: "6px 10px", borderRadius: 999 },
          onClick: () => onBack && onBack()
        },
        "←"
      ),
      h("h2", {
        className: "company-title",
        style: { margin: 0, fontSize: 20 }
      }, "Ինֆորմացիա")
    ),

    !list.length &&
      h(
        "div",
        {
          className: "card",
          style: { padding: 12, fontSize: 14 }
        },
        "Տվյալ keyword-ով աշխատակից դեռ չկա։"
      ),

    ...list.map(item =>
      h(WorkerCard, {
        key: item.id || item.keyword || Math.random().toString(36),
        item,
        lang
      })
    )
  );
}
