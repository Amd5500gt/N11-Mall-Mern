import React, { useEffect, useState } from 'react'
import { LiaSpinnerSolid } from "react-icons/lia"

const GoogleAuth = ({ authMode }) => {

  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {

    const checkGoogleButton = setInterval(() => {

      const btn =
        document.getElementById("googleBtn");

      if (
        btn &&
        btn.childNodes.length > 0
      ) {

        setGoogleLoaded(true);

        clearInterval(checkGoogleButton);

      }

    }, 300);

    return () => clearInterval(checkGoogleButton);

  }, []);

  if (
    authMode !== "login" &&
    authMode !== "register"
  ) {
    return null;
  }

  return (

    <div >

      {!googleLoaded && (

        <div className="google-loading"
        style={{
        marginTop: "40px",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}>

          <LiaSpinnerSolid
            className="spinner"
            size={30}
          />

        </div>

      )}

      <div
        id="googleBtn"
        style={{
          opacity: googleLoaded ? 1 : 0
        }}
      />

    </div>

  );

};

export default GoogleAuth;