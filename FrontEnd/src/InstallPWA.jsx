import React, {
  useEffect,
  useRef,
  useState
} from "react";

import "@khmyznikov/pwa-install";

const InstallPWA = () => {

  const pwaRef = useRef(null);

  const loaderRef = useRef(null);

  const deferredPrompt =
    useRef(null);

  const [canInstall, setCanInstall] =
    useState(false);

  const [showPopup, setShowPopup] =
    useState(false);

  const [installing, setInstalling] =
    useState(false);

  const [installed, setInstalled] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  /* =========================
     CHECK INSTALLED
  ========================= */

  useEffect(() => {

    const isInstalled =

      window.matchMedia(
        "(display-mode: standalone)"
      ).matches ||

      window.navigator?.standalone;

    if (isInstalled) {

      setInstalled(true);

      setCanInstall(false);

    }

  }, []);

  /* =========================
     BEFORE INSTALL PROMPT
  ========================= */

  useEffect(() => {

    const handleBeforeInstall =
      (e) => {

        e.preventDefault();

        deferredPrompt.current =
          e;

        setCanInstall(true);

      };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstall
    );

    return () => {

      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstall
      );

    };

  }, []);

  /* =========================
     PWA EVENTS
  ========================= */

  useEffect(() => {

    const pwa = pwaRef.current;

    if (!pwa) return;

    /* SUCCESS */

    const successHandler =
      () => {

        clearInterval(
          loaderRef.current
        );

        setProgress(100);

        navigator.vibrate?.(200);

        setTimeout(() => {

          setInstalling(false);

          setInstalled(true);

          setCanInstall(false);

        }, 500);

        setTimeout(() => {

          setShowPopup(false);

        }, 2200);

      };

    /* FAIL */

    const failHandler =
      () => {

        clearInterval(
          loaderRef.current
        );

        setInstalling(false);

        setProgress(0);

      };

    pwa.addEventListener(
      "pwa-install-success-event",
      successHandler
    );

    pwa.addEventListener(
      "pwa-install-fail-event",
      failHandler
    );

    return () => {

      clearInterval(
        loaderRef.current
      );

      pwa.removeEventListener(
        "pwa-install-success-event",
        successHandler
      );

      pwa.removeEventListener(
        "pwa-install-fail-event",
        failHandler
      );

    };

  }, []);

  /* =========================
     OPEN POPUP
  ========================= */

  const handleInstallClick =
    () => {

      setShowPopup(true);

    };

  /* =========================
     INSTALL
  ========================= */

  const startInstallation =
    async () => {

      try {

        if (
          !deferredPrompt.current
        ) {

          alert(
            "Install not supported on this device/browser"
          );

          return;

        }

        setInstalling(true);

        setProgress(0);

        /* FAKE LOADER */

        let current = 0;

        loaderRef.current =
          setInterval(() => {

            current += 4;

            if (current >= 90) {

              current = 90;

              clearInterval(
                loaderRef.current
              );

            }

            setProgress(current);

          }, 180);

        /* OPEN INSTALL */

        deferredPrompt.current.prompt();

        const result =
          await deferredPrompt.current.userChoice;

        if (
          result.outcome ===
          "accepted"
        ) {

          setProgress(100);

          setTimeout(() => {

            setInstalling(false);

            setInstalled(true);

            setCanInstall(false);

          }, 500);

          setTimeout(() => {

            setShowPopup(false);

          }, 2200);

        }

        else {

          clearInterval(
            loaderRef.current
          );

          setInstalling(false);

          setProgress(0);

        }

        deferredPrompt.current =
          null;

      }

      catch (error) {

        console.log(error);

        clearInterval(
          loaderRef.current
        );

        setInstalling(false);

        setProgress(0);

      }

    };

  /* =========================
     OPEN APP
  ========================= */

  const openApp = () => {

    window.location.href = "/";

  };

  /* =========================
     CLOSE
  ========================= */

  const closePopup =
    () => {

      if (!installing) {

        setShowPopup(false);

      }

    };

  return (

    <>

      {/* PWA */}

      <pwa-install
        ref={pwaRef}
        manual-chrome
        manual-apple
        use-local-storage
        manifest-url="/manifest.json"
      />

      {/* INSTALL BTN */}

      {!installed &&
        canInstall && (

        <button
          onClick={
            handleInstallClick
          }
          style={{

            position: "fixed",

            bottom: "20px",

            right: "20px",

            zIndex: 9999,

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

            fontSize: "15px",

            boxShadow:
              "0 12px 30px rgba(20,184,166,0.25)"
          }}
        >
          📥 Install App
        </button>

      )}

      {/* POPUP */}

      {showPopup && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.65)",
            backdropFilter:
              "blur(8px)",
            zIndex: 99999,
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
            padding: "20px",
          }}
        >

          <div
            style={{
              width: "100%",
              maxWidth: "360px",
              background:
                "#f7f7f7",
              borderRadius:
                "28px",
              padding: "30px",
              textAlign:
                "center",
              position:
                "relative",
              overflow:
                "hidden",
              boxShadow:
                "0 25px 60px rgba(0,0,0,0.35)",
            }}
          >

            {!installing && (

              <button
                onClick={
                  closePopup
                }
                style={{
                  position:
                    "absolute",
                  top: "14px",
                  right: "14px",
                  border: "none",
                  background:
                    "transparent",
                  fontSize: "22px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>

            )}

            {/* ICON */}

            <div
              style={{
                width: "90px",
                height: "90px",
                margin:
                  "0 auto 20px",
                borderRadius:
                  "24px",
                background:
                  installed
                    ? "linear-gradient(135deg,#22c55e,#16a34a)"
                    : "linear-gradient(135deg,#14b8a6,#0f766e)",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                fontSize: "42px",
                color: "#fff",
              }}
            >
              {installed
                ? "✅"
                : "📱"}
            </div>

            <h2
              style={{
                color:
                  "#111827",
                marginBottom:
                  "12px",
                fontSize:
                  "28px",
                fontWeight:
                  "800",
              }}
            >
              NexXcart
            </h2>

            {/* INSTALLING */}

            {installing && (

              <>

                <div
                  style={{
                    width: "100%",
                    height:
                      "10px",
                    background:
                      "#e5e7eb",
                    borderRadius:
                      "999px",
                    overflow:
                      "hidden",
                    marginBottom:
                      "18px",
                  }}
                >

                  <div
                    style={{
                      width:
                        `${progress}%`,
                      height:
                        "100%",
                      background:
                        "linear-gradient(90deg,#14b8a6,#0f766e)",
                      transition:
                        "0.2s linear",
                    }}
                  />

                </div>

                <h3>
                  Installing...
                </h3>

                <p
                  style={{
                    color:
                      "#6b7280",
                    marginTop:
                      "8px",
                  }}
                >
                  {progress}%
                </p>

              </>

            )}

            {/* INSTALLED */}

            {!installing &&
              installed && (

              <>

                <p
                  style={{
                    marginBottom:
                      "24px",
                    color:
                      "#4b5563",
                  }}
                >
                  App Installed 🎉
                </p>

                <button
                  onClick={
                    openApp
                  }
                  style={{
                    width:
                      "100%",
                    border:
                      "none",
                    padding:
                      "15px",
                    borderRadius:
                      "16px",
                    background:
                      "linear-gradient(135deg,#22c55e,#16a34a)",
                    color:
                      "#fff",
                    fontWeight:
                      "700",
                    fontSize:
                      "16px",
                    cursor:
                      "pointer",
                  }}
                >
                  🚀 Open App
                </button>

              </>

            )}

            {/* DEFAULT */}

            {!installing &&
              !installed && (

              <>

                <p
                  style={{
                    color:
                      "#4b5563",
                    lineHeight:
                      "1.7",
                    marginBottom:
                      "24px",
                  }}
                >
                  Install NexXcart
                  for better experience 🚀
                </p>

                <button
                  onClick={
                    startInstallation
                  }
                  style={{
                    width:
                      "100%",
                    border:
                      "none",
                    padding:
                      "15px",
                    borderRadius:
                      "16px",
                    background:
                      "linear-gradient(135deg,#14b8a6,#0f766e)",
                    color:
                      "#fff",
                    fontWeight:
                      "700",
                    fontSize:
                      "16px",
                    cursor:
                      "pointer",
                  }}
                >
                  📥 Install Now
                </button>

              </>

            )}

          </div>

        </div>

      )}

    </>

  );
};

export default InstallPWA;