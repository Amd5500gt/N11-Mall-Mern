import React, {
  useEffect,
  useRef,
  useState
} from "react";

import "@khmyznikov/pwa-install";

const InstallPWA = () => {

  const pwaRef = useRef(null);

  const [installed, setInstalled] =
    useState(false);

  useEffect(() => {

    /* CHECK IF APP ALREADY INSTALLED */

    const isInstalled =

      window.matchMedia(
        "(display-mode: standalone)"
      ).matches

      ||

      window.navigator.standalone

      ||

      document.referrer.includes(
        "android-app://"
      );

    if (isInstalled) {

      setInstalled(true);

    }

    const pwa =
      pwaRef.current;

    /* INSTALL SUCCESS */

    const handleSuccess = () => {

      console.log(
        "App Installed"
      );

      setInstalled(true);

    };

    /* INSTALL FAIL */

    const handleFail = () => {

      console.log(
        "Install Failed"
      );

    };

    /* USER CHOICE */

    const handleChoice = (e) => {

      console.log(
        e.detail.outcome
      );

    };

    pwa?.addEventListener(
      "pwa-install-success-event",
      handleSuccess
    );

    pwa?.addEventListener(
      "pwa-install-fail-event",
      handleFail
    );

    pwa?.addEventListener(
      "pwa-user-choice-result-event",
      handleChoice
    );

    /* REAL INSTALL EVENT */

    window.addEventListener(
      "appinstalled",
      () => {

        setInstalled(true);

      }
    );

  }, []);

  /* HIDE BUTTON IF INSTALLED */

  if (installed)
    return null;

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

          fontSize: "16px"
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