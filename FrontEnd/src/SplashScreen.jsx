import React, {
  useEffect,
  useState
} from "react";

import "./css/SplashScreen.css";

const SplashScreen = ({
  children
}) => {

  const [
    loading,
    setLoading
  ] = useState(true);

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setLoading(false);

      }, 2600);

    return () =>
      clearTimeout(timer);

  }, []);

  if (loading) {

    return (

      <div className="splash-screen">

        {/* GLOW */}

        <div className="splash-glow"></div>

        {/* LOGO */}

        <div className="splash-logo">

          <img
            src="/icon-192.png"
            alt="NexXcart"
          />

        </div>

        {/* TITLE */}

        <h1>

          NexXcart

        </h1>

        {/* LOADER */}

        <div className="splash-loader">

          <span></span>

        </div>

      </div>

    );

  }

  return children;
};

export default SplashScreen;