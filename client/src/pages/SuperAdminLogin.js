// client/src/pages/SuperAdminLogin.js
import React, { useState } from "react";
import PhoneShell from "../PhoneShell.js";
import { superLogin } from "../api.js";

const h = React.createElement;

export default function SuperAdminLogin({ onSuccess }) {
  // username-ի default արժեքը կարող ես փոխել ինչպես ուզում ես
  const [u, setU] = useState("ArmKHCon");
  const [p, setP] = useState("");
  const [otp, setOtp] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");

    const username = u.trim();
    const password = p;
    const code = otp.trim();

    if (!username || !password || !code) {
      setErr("username, password և otp դաշտերը պարտադիր են");
      return;
    }

    try {
      // ✅ ուղարկում ենք նաև otp
      const { token } = await superLogin(username, password, code);
      onSuccess(token); // sessionStorage-ով աշխատում է App.js-ից
    } catch (e2) {
      setErr(e2.message || "Bad creds");
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

      h(
        "button",
        {
          className: "btn",
          type: "submit",
          style: { marginTop: 10 },
        },
        "Login"
      ),

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
