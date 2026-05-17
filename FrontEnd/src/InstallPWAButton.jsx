import React, {
  useEffect,
  useState
} from "react";

const InstallPWAButton = () => {

  const [
    deferredPrompt,
    setDeferredPrompt
  ] = useState(null);

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

    }

  }, []);

  /* =========================
     INSTALL EVENTS
  ========================= */

  useEffect(() => {

    const beforeInstallHandler =
      (e) => {

        e.preventDefault();

        setDeferredPrompt(e);

        if (!installed) {

          setShowPopup(true);

        }
      };

    const installedHandler =
      () => {

        setInstalling(false);

        setInstalled(true);

        setProgress(100);

        setShowPopup(true);

        navigator.vibrate?.(200);

        setTimeout(() => {

          setShowPopup(false);

        }, 6000);
      };

    window.addEventListener(
      "beforeinstallprompt",
      beforeInstallHandler
    );

    window.addEventListener(
      "appinstalled",
      installedHandler
    );

    return () => {

      window.removeEventListener(
        "beforeinstallprompt",
        beforeInstallHandler
      );

      window.removeEventListener(
        "appinstalled",
        installedHandler
      );
    };

  }, [installed]);

  /* =========================
     INSTALL APP
  ========================= */

  const installApp = async () => {

    try {

      if (
        !deferredPrompt ||
        installing
      ) return;

      setInstalling(true);

      setProgress(0);

      /* =====================
         FAKE PROGRESS
      ===================== */

      let current = 0;

      const fakeLoader =
        setInterval(() => {

          current +=
            Math.floor(
              Math.random() * 12
            ) + 3;

          if (current >= 90) {

            current = 90;

            clearInterval(
              fakeLoader
            );
          }

          setProgress(current);

        }, 250);

      /* =====================
         REAL INSTALL
      ===================== */

      deferredPrompt.prompt();

      const { outcome } =
        await deferredPrompt.userChoice;

      clearInterval(fakeLoader);

      if (
        outcome === "accepted"
      ) {

        setProgress(100);

      }

      else {

        setInstalling(false);

        setProgress(0);

      }

      setDeferredPrompt(null);

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

  const closePopup = () => {

    setShowPopup(false);

  };

  if (!showPopup) return null;

  return (

    <>

      {/* BACKDROP */}

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
            animation:
              "popupShow 0.35s ease",
          }}
        >

          {/* GLOW */}

          <div
            style={{
              position: "absolute",
              width: "200px",
              height: "200px",
              background:
                "rgba(34,197,94,0.12)",
              borderRadius: "50%",
              top: "-80px",
              right: "-80px",
              filter: "blur(40px)",
            }}
          />

          {/* CLOSE */}

          {!installing && (
            <button
              onClick={closePopup}
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
              borderRadius: "24px",
              background:
                "linear-gradient(135deg,#22c55e,#16a34a)",
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              fontSize: "42px",
              color: "#fff",
              boxShadow:
                "0 15px 35px rgba(34,197,94,0.35)",
            }}
          >
            {installed
              ? "✅"
              : "📱"}
          </div>

          {/* TITLE */}

          <h2
            style={{
              color: "#111827",
              marginBottom: "12px",
              fontSize: "28px",
              fontWeight: "800",
            }}
          >
            NexXcart
          </h2>

          {/* =====================
              INSTALLING UI
          ===================== */}

          {installing && (

            <>

              {/* CIRCLE */}

              <div
                style={{
                  position:
                    "relative",
                  width: "95px",
                  height: "95px",
                  margin:
                    "0 auto 22px",
                }}
              >

                <div
                  style={{
                    width: "95px",
                    height: "95px",
                    borderRadius:
                      "50%",
                    background:
                      `conic-gradient(
                        #22c55e ${
                          progress * 3.6
                        }deg,
                        #e5e7eb 0deg
                      )`,
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    animation:
                      "pulse 1.5s infinite",
                  }}
                >

                  {/* INNER */}

                  <div
                    style={{
                      width: "74px",
                      height: "74px",
                      borderRadius:
                        "50%",
                      background:
                        "#f7f7f7",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      fontWeight:
                        "700",
                      fontSize:
                        "18px",
                      color:
                        "#22c55e",
                    }}
                  >
                    {progress}%
                  </div>

                </div>

              </div>

              {/* TEXT */}

              <h3
                style={{
                  color:
                    "#111827",
                  marginBottom:
                    "10px",
                }}
              >
                Installing App...
              </h3>

              <p
                style={{
                  color:
                    "#6b7280",
                  lineHeight:
                    "1.7",
                  fontSize:
                    "14px",
                  marginBottom:
                    "20px",
                }}
              >
                Preparing premium
                experience for your
                device 🚀
              </p>

              {/* BAR */}

              <div
                style={{
                  width: "100%",
                  height: "10px",
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
                    height: "100%",
                    background:
                      "linear-gradient(90deg,#22c55e,#16a34a)",
                    borderRadius:
                      "999px",
                    transition:
                      "0.25s linear",
                  }}
                />

              </div>

            </>
          )}

          {/* =====================
              INSTALLED
          ===================== */}

          {!installing &&
            installed && (

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
                NexXcart has been
                installed successfully
                🎉
              </p>

              <button
                onClick={openApp}
                style={{
                  width: "100%",
                  border: "none",
                  padding: "15px",
                  borderRadius:
                    "16px",
                  background:
                    "linear-gradient(135deg,#22c55e,#16a34a)",
                  color: "#fff",
                  fontWeight:
                    "700",
                  fontSize:
                    "16px",
                  cursor: "pointer",
                  boxShadow:
                    "0 12px 30px rgba(34,197,94,0.25)",
                }}
              >
                🚀 Open App
              </button>

            </>
          )}

          {/* =====================
              DEFAULT UI
          ===================== */}

          {!installing &&
            !installed && (

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
                for faster access,
                smoother performance
                and app-like experience
                🚀
              </p>

              <button
                onClick={installApp}
                style={{
                  width: "100%",
                  border: "none",
                  padding: "15px",
                  borderRadius:
                    "16px",
                  background:
                    "linear-gradient(135deg,#22c55e,#16a34a)",
                  color: "#fff",
                  fontWeight:
                    "700",
                  fontSize:
                    "16px",
                  cursor: "pointer",
                  boxShadow:
                    "0 12px 30px rgba(34,197,94,0.25)",
                }}
              >
                📥 Install App
              </button>

            </>
          )}

        </div>

      </div>

      {/* =========================
         ANIMATIONS
      ========================= */}

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

          @keyframes pulse {

            0% {
              transform: scale(1);
            }

            50% {
              transform: scale(1.05);
            }

            100% {
              transform: scale(1);
            }
          }

        `}
      </style>

    </>
  );
};

export default InstallPWAButton;