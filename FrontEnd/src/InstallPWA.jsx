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
    installing,
    setInstalling
  ] = useState(false);

  const [
    installed,
    setInstalled
  ] = useState(false);

  const [
    progress,
    setProgress
  ] = useState(0);

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

        /* COMPLETE */

        setProgress(100);

        navigator.vibrate?.(200);

        /* SMOOTH DELAY */

        setTimeout(() => {

          setInstalling(false);

          setInstalled(true);

          setCanInstall(false);

        }, 800);

        /* AUTO CLOSE */

        setTimeout(() => {

          setShowPopup(false);

        }, 5000);
      };

    /* INSTALL FAIL */

    const failHandler =
      () => {

        setInstalling(false);

        setProgress(0);
      };

    /* USER CHOICE */

    const userChoiceHandler =
      (e) => {

        if (
          e.detail.outcome !==
          "accepted"
        ) {

          setInstalling(false);

          setProgress(0);
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
    async () => {

      try {

        setInstalling(true);

        setProgress(0);

        /* FAKE LOADER */

        let current = 0;

        const fakeLoader =
          setInterval(() => {

            current +=
              Math.floor(
                Math.random() * 8
              ) + 2;

            /* STOP AT 90 */

            if (current >= 90) {

              current = 90;

              clearInterval(
                fakeLoader
              );
            }

            setProgress(current);

          }, 300);

        /* OPEN INSTALL */

        pwaRef.current?.showDialog();

      }

      catch (error) {

        console.log(error);

        setInstalling(false);

        setProgress(0);
      }
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

      if (!installing) {

        setShowPopup(false);

      }

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

      {/* PWA INSTALL */}

      <pwa-install
        ref={pwaRef}
        manual-chrome
        manual-apple
        use-local-storage
        manifest-url="/manifest.json"
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
            }}
          >

            {/* CLOSE */}

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

            {/* INSTALLING */}

            {installing && (

              <>

                <div
                  style={{
                    position:
                      "relative",
                    width: "95px",
                    height:
                      "95px",
                    margin:
                      "0 auto 22px",
                  }}
                >

                  <div
                    style={{
                      width:
                        "95px",
                      height:
                        "95px",
                      borderRadius:
                        "50%",
                      background:
                        `conic-gradient(
                          #14b8a6 ${
                            progress *
                            3.6
                          }deg,
                          #e5e7eb 0deg
                        )`,
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                    }}
                  >

                    <div
                      style={{
                        width:
                          "74px",
                        height:
                          "74px",
                        borderRadius:
                          "50%",
                        background:
                          "#f7f7f7",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        fontWeight:
                          "700",
                        fontSize:
                          "18px",
                        color:
                          "#14b8a6",
                      }}
                    >
                      {progress}%
                    </div>

                  </div>

                </div>

                <h3
                  style={{
                    marginBottom:
                      "10px",
                  }}
                >
                  Installing...
                </h3>

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
                        "0.25s linear",
                    }}
                  />

                </div>

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
                  App Installed
                  Successfully 🎉
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
                  for better app
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