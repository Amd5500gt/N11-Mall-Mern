import React, {
  useEffect,
  useRef,
  useState
} from "react";

import "@khmyznikov/pwa-install";

const InstallPWA = () => {

  const pwaRef = useRef(null);

  const [
    canInstall,
    setCanInstall
  ] = useState(false);

  const [
    showPopup,
    setShowPopup
  ] = useState(false);

  const [
    installed,
    setInstalled
  ] = useState(false);

  /* =========================
     CHECK INSTALLED
  ========================= */

  useEffect(() => {

    const isInstalled =

      window.matchMedia(
        "(display-mode: standalone)"
      ).matches;

    if (isInstalled) {

      setInstalled(true);

      setCanInstall(false);
    }

  }, []);

  /* =========================
     PWA EVENTS
  ========================= */

  useEffect(() => {

    const pwa =
      pwaRef.current;

    if (!pwa) return;

    /* INSTALL AVAILABLE */

    const availableHandler =
      () => {

        const isInstalled =

          window.matchMedia(
            "(display-mode: standalone)"
          ).matches;

        if (!isInstalled) {

          setCanInstall(true);

        }
      };

    /* INSTALL SUCCESS */

    const successHandler =
      () => {

        navigator.vibrate?.(200);

        /* SHOW SUCCESS STATE */

        setInstalled(true);

        setCanInstall(false);

        /* AUTO CLOSE */

        setTimeout(() => {

          setShowPopup(false);

        }, 5000);
      };

    /* INSTALL FAIL */

    const failHandler =
      () => {

        setShowPopup(false);
      };

    /* USER CHOICE */

    const userChoiceHandler =
      (e) => {

        if (
          e.detail.outcome !==
          "accepted"
        ) {

          /* USER CANCELLED */

          setShowPopup(false);
        }

      };

    pwa.addEventListener(
      "pwa-install-available-event",
      availableHandler
    );

    pwa.addEventListener(
      "pwa-install-success-event",
      successHandler
    );

    pwa.addEventListener(
      "pwa-install-fail-event",
      failHandler
    );

    pwa.addEventListener(
      "pwa-user-choice-result-event",
      userChoiceHandler
    );

    return () => {

      pwa.removeEventListener(
        "pwa-install-available-event",
        availableHandler
      );

      pwa.removeEventListener(
        "pwa-install-success-event",
        successHandler
      );

      pwa.removeEventListener(
        "pwa-install-fail-event",
        failHandler
      );

      pwa.removeEventListener(
        "pwa-user-choice-result-event",
        userChoiceHandler
      );
    };

  }, []);

  /* =========================
     OPEN INSTALL POPUP
  ========================= */

  const handleInstallClick =
    () => {

      setShowPopup(true);

    };

  /* =========================
     START INSTALL
  ========================= */

  const startInstallation =
    () => {

      /* SHOW NATIVE INSTALL DIALOG */

      pwaRef.current?.showDialog();

    };

  /* =========================
     OPEN APP
  ========================= */

  const openApp = () => {

    window.location.reload();

  };

  /* =========================
     CLOSE
  ========================= */

  const closePopup =
    () => {

      setShowPopup(false);

    };

  /* =========================
     HIDE BUTTON
  ========================= */

  if (
    !canInstall &&
    !installed
  ) {

    return (

      <pwa-install
        ref={pwaRef}
        manual-chrome
        manual-apple
        use-local-storage
        manifest-url="/manifest.json"
        style={{ display: "none" }}
      ></pwa-install>

    );
  }

  return (

    <>

      {/* INSTALL BUTTON */}

      {!installed && (

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

      {/* HIDDEN PWA INSTALL */}

      <pwa-install
        ref={pwaRef}
        manual-chrome
        manual-apple
        use-local-storage
        manifest-url="/manifest.json"
        style={{ display: "none" }}
      ></pwa-install>

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
            animation: "fadeIn 0.3s ease",
          }}
        >

          {/* CARD */}

          <div
            style={{
              width: "100%",
              maxWidth: "360px",
              background:
                "#f7f7f7",
              borderRadius: "28px",
              padding: "30px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow:
                "0 25px 60px rgba(0,0,0,0.35)",
              animation: "popupShow 0.35s ease",
            }}
          >

            {/* GLOW */}

            <div
              style={{
                position: "absolute",
                width: "200px",
                height: "200px",
                background:
                  installed
                    ? "rgba(34,197,94,0.12)"
                    : "rgba(20,184,166,0.12)",
                borderRadius: "50%",
                top: "-80px",
                right: "-80px",
                filter: "blur(40px)",
              }}
            />

            {/* CLOSE */}

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
                color: "#555",
                fontSize: "22px",
                cursor: "pointer",
                zIndex: 2,
              }}
            >
              ×
            </button>

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
                boxShadow:
                  installed
                    ? "0 15px 35px rgba(34,197,94,0.35)"
                    : "0 15px 35px rgba(20,184,166,0.35)",
                animation:
                  installed
                    ? "bounceIn 0.6s ease"
                    : "none",
              }}
            >
              {installed
                ? "✅"
                : "📱"}
            </div>

            {/* TITLE */}

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

            {/* INSTALLED SUCCESS */}

            {installed && (

              <>

                <p
                  style={{
                    color:
                      "#4b5563",
                    lineHeight:
                      "1.7",
                    fontSize:
                      "15px",
                    marginBottom:
                      "24px",
                    animation:
                      "fadeInUp 0.5s ease",
                  }}
                >
                  App Installed
                  Successfully! 🎉
                  <br />
                  Enjoy the premium
                  app experience.
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
                    boxShadow:
                      "0 12px 30px rgba(34,197,94,0.25)",
                    animation:
                      "fadeInUp 0.5s ease",
                  }}
                >
                  🚀 Open App
                </button>

              </>

            )}

            {/* DEFAULT INSTALL */}

            {!installed && (

              <>

                <p
                  style={{
                    color:
                      "#4b5563",
                    lineHeight:
                      "1.7",
                    fontSize:
                      "15px",
                    marginBottom:
                      "24px",
                  }}
                >
                  Install NexXcart
                  for faster access
                  and smoother app
                  experience 🚀
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
                    boxShadow:
                      "0 12px 30px rgba(20,184,166,0.25)",
                  }}
                >
                  📥 Install Now
                </button>

              </>

            )}

          </div>

        </div>

      )}

      {/* ANIMATIONS */}

      <style>
        {`

          @keyframes popupShow {

            from {

              opacity: 0;

              transform:
                scale(0.9)
                translateY(20px);

            }

            to {

              opacity: 1;

              transform:
                scale(1)
                translateY(0);

            }
          }

          @keyframes fadeIn {

            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes fadeInUp {

            from {

              opacity: 0;

              transform:
                translateY(20px);

            }

            to {

              opacity: 1;

              transform:
                translateY(0);

            }
          }

          @keyframes bounceIn {

            0% {

              transform:
                scale(0.3);

              opacity: 0;

            }

            50% {

              transform:
                scale(1.05);

            }

            70% {

              transform:
                scale(0.9);

            }

            100% {

              transform:
                scale(1);

              opacity: 1;

            }
          }

        `}
      </style>

    </>
  );
};

export default InstallPWA;