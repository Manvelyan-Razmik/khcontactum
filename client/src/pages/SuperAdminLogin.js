// client/src/pages/SuperAdminLogin.js
import React, { useState } from "react";
import PhoneShell from "../PhoneShell.js";
import { superLogin } from "../api.js";

const h = React.createElement;

export default function SuperAdminLogin({ onSuccess }) {
  const [u, setU] = useState("ArmKHCon");
  const [p, setP] = useState("");
  const [otp, setOtp] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const username = u.trim();
    const password = p;
    const code = otp.trim();

    if (!username || !password || !code) {
      setErr("username, password և otp դաշտերը պարտադիր են");
      setLoading(false);
      return;
    }

    try {
      // ⛔️ Նախընտրելի տարբերակ՝ ապահով ստուգում
      const result = await superLogin(username, password, code);

      // Եթե login-ը սխալ է՝ null կամ դատարկ պատասխան
      if (!result || !result.token) {
        setErr(result?.message || "Մուտք գործելու սխալ տվյալներ կամ սերվերային սխալ");
        setLoading(false);
        return;
      }

      // ✅ Եթե ամեն ինչ նորմալ է՝ փոխանցում ենք token-ը
      onSuccess(result.token);
    } catch (e2) {
      console.error("SuperAdmin login error:", e2);
      setErr(e2.message || "Server connection error");
    } finally {
      setLoading(false);
    }
  }

  return h(
    PhoneShell,
    { title: "Super Admin" },
    h(
      "form",
      { onSubmit: submit, className: "card" },

      // username
      h("input", {
        className: "input",
        placeholder: "username",
        value: u,
        onChange: (e) => setU(e.target.value),
        autoComplete: "username",
      }),

      // password + 👁
      h(
        "div",
        { style: { position: "relative", width: "100%", marginTop: 8 } },
        h("input", {
          className: "input",
          placeholder: "password",
          type: showPass ? "text" : "password",
          value: p,
          onChange: (e) => setP(e.target.value),
          autoComplete: "current-password",
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
          showPass ? "🙈" : "👁"
        )
      ),

      // OTP field
      h("input", {
        className: "input",
        placeholder: "OTP / Secret code",
        style: { marginTop: 8 },
        value: otp,
        onChange: (e) => setOtp(e.target.value),
        autoComplete: "one-time-code",
      }),

      // Submit button
      h(
        "button",
        {
          className: "btn",
          type: "submit",
          disabled: loading,
          style: { marginTop: 10, opacity: loading ? 0.6 : 1 },
        },
        loading ? "Loading..." : "Login"
      ),

      // Error block
      err &&
        h(
          "div",
          {
            className: "small",
            style: { color: "#ff9b9b", marginTop: 8 },
          },
          err
        )
    )
  );
}
