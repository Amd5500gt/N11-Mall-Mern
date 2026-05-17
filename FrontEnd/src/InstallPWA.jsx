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

  const [installing, setInstalling] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [supported, setSupported] =
    useState(true);

  useEffect(() => {

    /* CHECK INSTALLED */

    const isStandalone =
      window.matchMedia(
        "(display-mode: standalone)"
      ).matches
      ||
      window.navigator.standalone;

    if (isStandalone) {

      setInstalled(true);

    }

    /* CHECK SUPPORT */

    if (
      !("BeforeInstallPromptEvent" in window)
      &&
      !window.navigator.userAgent.includes(
        "Android"
      )
    ) {

      setSupported(false);

    }

    const pwa =
      pwaRef.current;

    /* SUCCESS */

    const handleSuccess = () => {
setProgress(100);

setTimeout(() => {

  setInstalling(false);

  setInstalled(true);
   console.log(
        "✅ Installed"
      );

}, 700);

     

    };

    /* FAIL */

    const handleFail = () => {

      setInstalling(false);

      setProgress(0);

      console.log(
        "❌ Failed"
      );

    };

    /* USER CHOICE */

    const handleChoice = (e) => {

      console.log(
        e.detail.outcome
      );

      if (
        e.detail.outcome === "dismissed"
      ) {

        setInstalling(false);

        setProgress(0);

      }

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

    return () => {

      pwa?.removeEventListener(
        "pwa-install-success-event",
        handleSuccess
      );

      pwa?.removeEventListener(
        "pwa-install-fail-event",
        handleFail
      );

      pwa?.removeEventListener(
        "pwa-user-choice-result-event",
        handleChoice
      );

    };

  }, []);

  /* INSTALL */
const handleInstall = async () => {

  if (!pwaRef.current)
    return;

  setInstalling(true);

  setProgress(0);

  let current = 0;

  const interval =
    setInterval(() => {

      current += 5;

      /* STOP AT 90 */

      if (current < 90) {

        setProgress(current);

      }

    }, 200);

  try {

    /* OPEN INSTALL POPUP */

    pwaRef.current.showDialog();

    /* WAIT SOME TIME */

    setTimeout(() => {

      /* IF STILL NOT INSTALLED */

      setProgress(100);

    }, 2500);

  } catch (err) {

    console.log(err);

    setInstalling(false);

    setProgress(0);

  }

  /* AUTO CLEANUP */

  setTimeout(() => {

    clearInterval(interval);

  }, 4000);
  };

  /* OPEN APP */

  const openApp = () => {

    window.location.href = "/";

  };

  return (

    <>

      {/* INSTALL */}

      {!installed && (

        <button
          onClick={handleInstall}
          disabled={
            installing ||
            !supported
          }
          style={{

            position: "fixed",

            bottom: "20px",

            right: "20px",

            zIndex: 999999,

            border: "none",

            outline: "none",

            padding:
              "15px 24px",

            borderRadius:
              "18px",

            fontWeight: "700",

            fontSize: "15px",

            color: "#fff",

            cursor: "pointer",

            overflow: "hidden",

            transition:
              "0.3s",

            backdropFilter:
              "blur(10px)",

            background:
              installing
                ? "linear-gradient(135deg,#4f46e5,#7c3aed)"
                : "linear-gradient(135deg,#14b8a6,#0f766e)",

            boxShadow:
              "0 10px 30px rgba(0,0,0,0.25)"
          }}
        >

          {installing
            ? `Installing ${progress}%`
            : supported
            ? "📥 Install App"
            : "❌ Not Supported"}

          {/* PROGRESS */}

          {installing && (

            <div
              style={{

                position: "absolute",

                left: 0,

                bottom: 0,

                width: `${progress}%`,

                height: "4px",

                background:
                  "#fff",

                transition:
                  "0.2s"
              }}
            />

          )}

        </button>

      )}

      {/* OPEN APP */}

      {installed && (

        <button
          onClick={openApp}
          style={{

            position: "fixed",

            bottom: "20px",

            right: "20px",

            zIndex: 999999,

            border: "none",

            padding:
              "15px 24px",

            borderRadius:
              "18px",

            fontWeight: "700",

            fontSize: "15px",

            color: "#fff",

            cursor: "pointer",

            background:
              "linear-gradient(135deg,#22c55e,#15803d)",

            boxShadow:
              "0 10px 30px rgba(0,0,0,0.25)"
          }}
        >
          🚀 Open App
        </button>

      )}

      {/* PWA */}

      <pwa-install

        ref={pwaRef}

        manual-chrome
        manual-apple

        use-local-storage

        disable-screenshots="true"

        manifest-url="/manifest.json"

      ></pwa-install>

    </>

  );
};

export default InstallPWA;