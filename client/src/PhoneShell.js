// client/src/PhoneShell.js
import React from "react";
import "./PhoneShell.css";
const h = React.createElement;

export default function PhoneShell({
  title = "Super Admin",
  right = null,
  children,
  light = false,
  hideHeader = false
}) {
  const screenCls = "screen" + (light ? " light" : "");
  const showHeader = !hideHeader;

  return h("div", { className: "phone" },
    h("div", { className: screenCls },
      showHeader,
        
      children
    )
  );
}
