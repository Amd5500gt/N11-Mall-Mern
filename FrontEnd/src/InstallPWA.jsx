import React, {
  useEffect,
  useRef
} from "react";

import "@khmyznikov/pwa-install";

const InstallPWA = () => {

  const pwaRef = useRef(null);

  useEffect(() => {

    const pwa =
      pwaRef.current;

    /* INSTALL SUCCESS */

    pwa?.addEventListener(
      "pwa-install-success-event",
      () => {

        console.log(
          "App Installed"
        );

      }
    );

    /* INSTALL FAIL */

    pwa?.addEventListener(
      "pwa-install-fail-event",
      () => {

        console.log(
          "Install Failed"
        );

      }
    );

    /* USER CHOICE */

    pwa?.addEventListener(
      "pwa-user-choice-result-event",
      (e) => {

        console.log(
          e.detail.outcome
        );

      }
    );

  }, []);

  return (

    <div>

      {/* CUSTOM BUTTON */}

      <button
        onClick={() =>
          pwaRef.current?.showDialog()
        }
        style={{
          padding:
            "14px 22px",

          border: "none",

          borderRadius:
            "16px",

          background:
            "linear-gradient(135deg,#14b8a6,#0f766e)",

          color: "#fff",

          fontWeight: "700",

          cursor: "pointer",

          fontSize: "16px",

          boxShadow:
            "0 10px 30px rgba(20,184,166,0.25)"
        }}
      >
        📥 Install App
      </button>

      {/* PWA INSTALL */}

      <pwa-install

        ref={pwaRef}

        manual-chrome
        manual-apple

        use-local-storage

        disable-screenshots={false}

        manifest-url="/manifest.json"

      ></pwa-install>

    </div>
  );
};

export default InstallPWA;