// client/src/tabs/HomeTab.js
import React from "react";
import {
  adminInfoFetch,   // alias of adminGetInfo(token)
  adminInfoSave,    // alias of adminSaveInfo(token, payload)
  adminUploadFile,  // alias of uploadFile(token, file, field)
} from "../api.js";
import { fileUrl } from "../utils/fileUrl.js";

const h = React.createElement;

const ALL_LANGS = [
  { code: "am", label: "Հայերեն (AM)" },
  { code: "ru", label: "Русский (RU)" },
  { code: "en", label: "English (EN)" },
  { code: "ar", label: "العربية (AR)" },
  { code: "fr", label: "Français (FR)" }
];

function useDebounced(fn, delay = 350) {
  const ref = React.useRef();
  return React.useCallback((...args) => {
    clearTimeout(ref.current);
    ref.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

function isVideoUrl(u = "") {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(u || "");
}

/* ---- common preview video (keeps playing) ---- */
function PreviewVideo({ src, style }) {
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
    autoPlay: true,
    playsInline: true,
    preload: "auto",
    disableRemotePlayback: true,
    style
  });
}

export default function HomeTab() {
  const token =
    sessionStorage.getItem("adminToken") ||
    localStorage.getItem("adminToken") || "";

  const [loading, setLoading] = React.useState(true);
  const [saving,  setSaving ] = React.useState(false);
  const [msg,     setMsg    ] = React.useState("");

  // ակտիվ լեզուների հերթականություն
  const [langs, setLangs] = React.useState(["am","ru","en","ar","fr"]);

  // canonical state -> DB json
  const [company, setCompany] = React.useState({
    name: { am: "", ru: "", en: "", ar: "", fr: "" },
    nameColor: "#000000",
  });
  const [profile, setProfile] = React.useState({
    about: { am: "", ru: "", en: "", ar: "", fr: "" },
    aboutColor: "#000000",
    avatar: "",
  });
  const [background, setBackground] = React.useState({
    type: "color",
    color: "#ffffff",
    imageUrl: "",
    videoUrl: "",
  });

  const ALL_CODES = ALL_LANGS.map(x => x.code);

  // normalize helper to keep full shape
  function normAll({ c = {}, p = {}, b = {} }) {
    const srcName  = (c && c.name)  || c || {};
    const srcAbout = (p && p.about) || p || {};

    const normName  = {};
    const normAbout = {};

    ALL_CODES.forEach(code => {
      normName[code]  = srcName[code]  || "";
      normAbout[code] = srcAbout[code] || "";
    });

    setCompany({
      name: normName,
      nameColor: c?.nameColor || "#000000",
    });
    setProfile({
      about: normAbout,
      aboutColor: p?.aboutColor || "#000000",
      avatar: p?.avatar || "",
    });
    setBackground({
      type: b?.type || "color",
      color: b?.color || "#ffffff",
      imageUrl: b?.imageUrl || "",
      videoUrl: b?.videoUrl || "",
    });
  }

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const resp = await adminInfoFetch(token); // ⚠️ with token
        const data = resp?.data || resp || {};
        const rootInfo = data?.information || {};
        const c = data?.company   || rootInfo.company   || {};
        const p = data?.profile   || rootInfo.profile   || {};
        const b = data?.background|| rootInfo.background|| {};
        normAll({ c, p, b });

        // languages from server
        const rawAvail =
          Array.isArray(data?.available_langs)    ? data.available_langs :
          Array.isArray(rootInfo.available_langs) ? rootInfo.available_langs :
          ["am","ru","en","ar","fr"];

        const cleanAvail = rawAvail.filter(code => ALL_CODES.includes(code));
        let langsArr = cleanAvail.length ? cleanAvail : ["am","ru","en","ar","fr"];

        const def =
          data?.default_lang ||
          rootInfo.default_lang ||
          langsArr[0] ||
          "am";

        if (def) {
          if (!langsArr.includes(def)) {
            langsArr = [def].concat(langsArr);
          } else {
            langsArr = [def].concat(langsArr.filter(c => c !== def));
          }
        }

        const seen = new Set();
        langsArr = langsArr.filter(c => {
          if (seen.has(c)) return false;
          seen.add(c);
          return true;
        });

        setLangs(langsArr);
      } catch (e) {
        setMsg(e.message || "Load error");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // setters
  const setNameFor = (code) => (e) => {
    const v = e.target.value;
    setCompany(s => ({
      name: {
        ...(s?.name || {}),
        [code]: v
      },
      nameColor: s?.nameColor ?? "#000000",
    }));
    debouncedAutoSave();
  };

  const setAboutFor = (code) => (e) => {
    const v = e.target.value;
    setProfile(s => ({
      about: {
        ...(s?.about || {}),
        [code]: v
      },
      aboutColor: s?.aboutColor ?? "#000000",
      avatar: s?.avatar || "",
    }));
    debouncedAutoSave();
  };

  const setNameColor = (v) => {
    setCompany(s => ({
      name: { ...(s.name || {}) },
      nameColor: v
    }));
    debouncedAutoSave();
  };

  const setAboutColor = (v) => {
    setProfile(s => ({
      about: { ...(s.about || {}) },
      aboutColor: v,
      avatar: s.avatar || ""
    }));
    debouncedAutoSave();
  };

  const setBgType  = (v) => {
    setBackground(s => ({
      type: v,
      color: s?.color ?? "#ffffff",
      imageUrl: "",
      videoUrl: ""
    }));
    debouncedAutoSave();
  };

  const setBgColor = (v) => {
    setBackground(s => ({
      type: s?.type || "color",
      color: v,
      imageUrl: s?.imageUrl || "",
      videoUrl: s?.videoUrl || ""
    }));
    debouncedAutoSave();
  };

  const setBgMediaManual = (v) => {
    setBackground(s => {
      const t = s?.type || "color";
      return {
        type: t,
        color: s?.color ?? "#ffffff",
        imageUrl: t === "image" ? v : "",
        videoUrl: t === "video" ? v : ""
      };
    });
    debouncedAutoSave();
  };

  const setAvatarManual = (v) => {
    setProfile(s => ({
      about: {
        ...(s?.about || {})
      },
      aboutColor: s?.aboutColor ?? "#000000",
      avatar: v || s?.avatar || ""
    }));
    debouncedAutoSave();
  };

  const onBgFile = async (e) => {
    try {
      const f = e.target.files?.[0];
      if (!f) return;
      const { ok, url, path, error } = await adminUploadFile(token, f);
      if (!ok) throw new Error(error || "Upload failed");

      // DB-ի մեջ պահելու համար օգտագործում ենք path-ը, եթե կա, հակառակ դեպքում՝ url
      const stored = path || url;

      if (background.type === "image") {
        setBackground(s => ({
          type: s?.type || "image",
          color: s?.color ?? "#ffffff",
          imageUrl: stored,
          videoUrl: ""
        }));
      } else if (background.type === "video") {
        setBackground(s => ({
          type: s?.type || "video",
          color: s?.color ?? "#ffffff",
          imageUrl: "",
          videoUrl: stored
        }));
      }

      setMsg("Ֆոնը վերբեռնված է");
      debouncedAutoSave();
    } catch (e2) {
      setMsg(e2.message || "Upload error");
    } finally {
      e.target.value = "";
    }
  };

  const onAvatarFile = async (e) => {
    try {
      const f = e.target.files?.[0];
      if (!f) return;
      const { ok, url, path, error } = await adminUploadFile(token, f);
      if (!ok) throw new Error(error || "Upload failed");

      const stored = path || url;

      setProfile(s => ({
        about: {
          ...(s?.about || {})
        },
        aboutColor: s?.aboutColor ?? "#000000",
        avatar: stored || s?.avatar || ""
      }));

      setMsg("Ավատարը վերբեռնված է");
      debouncedAutoSave();
    } catch (e2) {
      setMsg(e2.message || "Upload error");
    } finally {
      e.target.value = "";
    }
  };

  const doSave = React.useCallback(async () => {
    try {
      setSaving(true);
      setMsg("");
      const payload = {
        company,
        profile,
        background,
        available_langs: langs,
        default_lang: (langs && langs[0]) || "am"
      };
      const { ok, error } = await adminInfoSave(token, payload);
      if (ok === false) throw new Error(error || "Save failed");
      setMsg("Պահպանված է ✅");
    } catch (e) {
      setMsg(e.message || "Save error");
    } finally {
      setSaving(false);
    }
  }, [token, company, profile, background, langs]);

  const debouncedAutoSave = useDebounced(() => { doSave(); }, 800);

  const rawMediaUrl =
    background.type === "video" ? background.videoUrl :
    background.type === "image" ? background.imageUrl : "";

  const mediaUrl = fileUrl(rawMediaUrl);

  const isVid = background.type === "video" || isVideoUrl(rawMediaUrl);

  const toggleLang = (code) => {
    setLangs(prev => {
      const exists = prev.includes(code);
      if (exists) {
        if (prev.length === 1) return prev; // չթողնենք, որ մնա առանց լեզվի
        return prev.filter(c => c !== code);
      }
      return [...prev, code];
    });
    debouncedAutoSave();
  };

  const moveLang = (code, dir) => {
    setLangs(prev => {
      const idx = prev.indexOf(code);
      if (idx === -1) return prev;
      const nextIdx = dir === "up" ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= prev.length) return prev;
      const arr = prev.slice();
      const [item] = arr.splice(idx, 1);
      arr.splice(nextIdx, 0, item);
      return arr;
    });
    debouncedAutoSave();
  };

  if (loading) {
    return h("div", { className:"pad" }, "Բեռնվում է…");
  }

  return h("div", {
      className:"pad",
      style:{ maxWidth: 860, margin: "0 auto" }
    },

    msg
      ? h("div", { className:"note", style:{ marginBottom: 10 }}, msg)
      : null,

    /* LANGUAGES */
    h("h2", {
      className:"company-title",
      style:{ textAlign:"center", marginBottom: 6 }
    }, "ԼԵԶՈՒՆԵՐ"),

    h("div", {
      className:"card",
      style:{
        padding: 10,
        marginBottom: 16,
        display:"grid",
        gap:8
      }
    },
      h("div", {
        className:"small",
        style:{ opacity:.75 }
      }, "Ընտրիր, թե որ լեզուներն են ակտիվ։ Առաջինը կլինի public-ի default լեզուն։"),

      ALL_LANGS.map(({ code, label }) => {
        const active = langs.includes(code);
        const idx = langs.indexOf(code);
        return h("div", {
          key: code,
          className:"row",
          style:{
            alignItems:"center",
            gap:8,
            opacity: active ? 1 : 0.5
          }
        },
          h("button", {
            type:"button",
            className: "chip" + (active ? " active" : ""),
            onClick: () => toggleLang(code),
            style:{ minWidth: 54 }
          }, code.toUpperCase()),

          h("span", { style:{ flex:1, fontSize:13 } }, label),

          active && h("span", {
            className:"small",
            style:{ minWidth:60, fontSize:11, opacity:.8 }
          }, idx === 0 ? "Default" : `#${idx+1}`),

          h("div", { style:{ display:"flex", gap:4 } },
            h("button", {
              type:"button",
              className:"btn small",
              disabled: idx <= 0 || !active,
              onClick: () => moveLang(code, "up")
            }, "↑"),
            h("button", {
              type:"button",
              className:"btn small",
              disabled: idx === -1 || idx >= langs.length - 1 || !active,
              onClick: () => moveLang(code, "down")
            }, "↓")
          )
        );
      })
    ),

    /* AVATAR */
    h("h3", {
      style:{ marginTop:16 }
    }, "Avatar"),

    h("div", {
      className:"row",
      style:{ alignItems:"center", gap:8, marginTop:6 }
    },
      h("input", {
        className:"input",
        value: profile?.avatar || "",
        onChange: e => setAvatarManual(e.target.value),
        placeholder:"/file/... կամ URL"
      }),

      h("label", {
        className:"btn",
        style:{ alignSelf:"center", cursor:"pointer" }
      }, "Վերբեռնել",
        h("input", {
          type:"file",
          accept:"image/*,video/*",
          style:{ display:"none" },
          onChange: onAvatarFile
        })
      )
    ),

    // Avatar preview (կլոր դաշտ)
    h("div", {
      style:{
        marginTop:8,
        display:"flex",
        alignItems:"center",
        gap:10
      }
    },
      h("div", {
        style:{
          width:64,
          height:64,
          borderRadius:"50%",
          overflow:"hidden",
          background:"#f5f5f5",
          display:"grid",
          placeItems:"center",
          border:"1px solid rgba(0,0,0,.08)"
        }
      },
        profile?.avatar
          ? (isVideoUrl(profile.avatar)
              ? h(PreviewVideo, {
                  src: fileUrl(profile.avatar),
                  style:{ width:"100%", height:"100%", objectFit:"cover" }
                })
              : h("img", {
                  src: fileUrl(profile.avatar),
                  alt:"avatar preview",
                  style:{ width:"100%", height:"100%", objectFit:"cover" }
                })
            )
          : h("div", {
              style:{ opacity:.6, fontSize:11 }
            }, "No avatar")
      )
    ),

    /* COMPANY NAME */
    h("h2", {
      className:"company-title",
      style:{ marginTop:20, textAlign:"center" }
    }, "COMPANY NAME"),

    langs.map(code => {
      const meta = ALL_LANGS.find(x => x.code === code);
      const label = meta ? meta.label.split(" ")[0] : code.toUpperCase();
      const placeholder =
        code === "am" ? "Անուն (AM)" :
        code === "ru" ? "Название (RU)" :
        code === "en" ? "Company Name (EN)" :
        code === "ar" ? "اسم الشركة (AR)" :
        "Nom de l'entreprise (FR)";

      return h("div", {
        key: code,
        style:{ display: "grid", gap: 6, marginTop: 8 }
      },
        h("label", {
          style:{ fontSize:12, opacity:.7, alignSelf:"start" }
        }, label),

        h("input", {
          className:"input",
          value: (company?.name && company.name[code]) || "",
          onChange: setNameFor(code),
          placeholder,
          style:{
            color: company?.nameColor || "#000000",
            fontWeight: 600
          }
        })
      );
    }),

    h("div", {
      className:"row",
      style:{ gap:8, alignItems:"center", marginTop:10 }
    },
      h("label", {
        style:{ minWidth:130, opacity:.8 }
      }, "Name Color"),

      h("input", {
        type:"color",
        value:company?.nameColor || "#000000",
        onChange: e=>setNameColor(e.target.value),
        style:{
          width:48,
          height:36,
          padding:0,
          border:"none",
          background:"none"
        }
      }),

      h("input", {
        className:"input",
        style:{ maxWidth:140 },
        value:company?.nameColor || "#000000",
        onChange: e=>setNameColor(e.target.value),
        placeholder:"#000000"
      })
    ),

    /* DESCRIPTION */
    h("h2", {
      className:"company-title",
      style:{ marginTop:20, textAlign:"center" }
    }, "DESCRIPTION"),

    langs.map(code => {
      const meta = ALL_LANGS.find(x => x.code === code);
      const label = meta ? meta.label.split(" ")[0] : code.toUpperCase();
      const placeholder =
        code === "am" ? "Նկարագրություն (AM)" :
        code === "ru" ? "Описание (RU)" :
        code === "en" ? "Description (EN)" :
        code === "ar" ? "الوصف (AR)" :
        "Description (FR)";

      return h("div", {
        key: code,
        style:{ display:"grid", gap:6, marginTop:8 }
      },
        h("label", {
          style:{ fontSize:12, opacity:.7, alignSelf:"start" }
        }, label),

        h("textarea", {
          className:"textarea",
          rows:4,
          value: (profile?.about && profile.about[code]) || "",
          onChange: setAboutFor(code),
          placeholder,
          style:{
            color: profile?.aboutColor || "#000000"
          }
        })
      );
    }),

    h("div", {
      className:"row",
      style:{ gap:8, alignItems:"center", marginTop:10 }
    },
      h("label", {
        style:{ minWidth:130, opacity:.8 }
      }, "Description Color"),

      h("input", {
        type:"color",
        value:profile?.aboutColor || "#000000",
        onChange: e=>setAboutColor(e.target.value),
        style:{
          width:48,
          height:36,
          padding:0,
          border:"none",
          background:"none"
        }
      }),

      h("input", {
        className:"input",
        style:{ maxWidth:140 },
        value:profile?.aboutColor || "#000000",
        onChange: e=>setAboutColor(e.target.value),
        placeholder:"#000000"
      })
    ),

    /* BACKGROUND */
    h("h2", {
      className:"company-title",
      style:{ marginTop:20, textAlign:"center" }
    }, "BACKGROUND"),

    h("div", {
      className:"row",
      style:{ gap:8, alignItems:"center", marginTop:10 }
    },
      h("label", {
        style:{ minWidth:130, opacity:.8 }
      }, "Type"),

      h("select", {
        className:"input",
        value: background?.type || "color",
        onChange: e => setBgType(e.target.value),
        style:{ maxWidth:180 }
      },
        h("option",{ value:"color" }, "Color"),
        h("option",{ value:"image" }, "Image"),
        h("option",{ value:"video" }, "Video")
      )
    ),

    background?.type === "color" && h(React.Fragment, null,
      h("div", {
        className:"row",
        style:{ gap:8, alignItems:"center", marginTop:10 }
      },
        h("label", {
          style:{ minWidth:130, opacity:.8 }
        }, "Background Color"),

        h("input", {
          type:"color",
          value:background?.color || "#ffffff",
          onChange: e=>setBgColor(e.target.value),
          style:{
            width:48,
            height:36,
            padding:0,
            border:"none",
            background:"none"
          }
        }),

        h("input", {
          className:"input",
          style:{ maxWidth:140 },
          value:background?.color || "#ffffff",
          onChange: e=>setBgColor(e.target.value),
          placeholder:"#ffffff"
        })
      ),

      h("div", {
        style:{
          marginTop:8,
          borderRadius:10,
          overflow:"hidden",
          border:"1px solid rgba(0,0,0,.08)"
        }
      },
        h("div", {
          style:{
            height:60,
            background:background?.color || "#ffffff",
            display:"grid",
            placeItems:"center",
            fontSize:12,
            opacity:.8
          }
        }, "Preview")
      )
    ),

    (background?.type === "image" || background?.type === "video") && h(React.Fragment,null,
      h("div", {
        className:"row",
        style:{ gap:8, alignItems:"center", marginTop:10 }
      },
        h("label", {
          style:{ minWidth:130, opacity:.8 }
        }, background?.type === "image" ? "Image URL" : "Video URL"),

        h("input", {
          className:"input",
          value: background?.type === "image"
            ? (background?.imageUrl || "")
            : (background?.videoUrl || ""),
          onChange: e => setBgMediaManual(e.target.value),
          placeholder: background?.type === "image"
            ? "/file/... կամ https://..."
            : "/file/video.mp4 կամ https://..."
        }),

        h("label", {
          className:"btn",
          style:{ alignSelf:"center", cursor:"pointer" }
        }, "Վերբեռնել",
          h("input", {
            type:"file",
            accept: background?.type === "image" ? "image/*" : "video/*",
            style:{ display:"none" },
            onChange: onBgFile
          })
        )
      ),

      h("div", {
        style:{
          marginTop:8,
          borderRadius:10,
          overflow:"hidden",
          border:"1px solid rgba(0,0,0,.08)",
          display:"grid",
          placeItems:"center",
          height:140,
          background:"#f5f5f5"
        }
      },
        (background?.imageUrl || background?.videoUrl)
          ? (isVid
              ? h(PreviewVideo, {
                  src: mediaUrl,
                  style:{
                    width:"100%",
                    height:"100%",
                    objectFit:"cover"
                  }
                })
              : h("img", {
                  src: mediaUrl,
                  style:{
                    width:"100%",
                    height:"100%",
                    objectFit:"cover"
                  }
                })
            )
          : h("div", {
              style:{ opacity:.6, fontSize:12 }
            }, "No media selected")
      )
    ),

    h("div", {
      className:"row",
      style:{ justifyContent:"flex-end", marginTop:16 }
    },
      h("button", {
        className:"btn",
        disabled: saving,
        onClick: doSave
      }, saving ? "Պահպանում…" : "Պահպանել")
    )
  );
}
