import React from 'react'
import { Link } from 'react-router-dom';

const PageForward = ({
  authMode,
  switchMode
}) => {

  if (authMode === "forgotPassword") {
    return null;
  }

  return (

    <span className="page-forward">

      {authMode === "login" ? (

        <>
          Don't have an account?{" "}

          <Link
          to="#"
            type="button"
            className="auth-switch-btn"
            onClick={() => switchMode("register")}
          >
            Register
          </Link>
        </>

      ) : (

        <>
          Already have an account?{" "}

          <Link
          to="#"
            type="button"
            className="auth-switch-btn"
            onClick={() => switchMode("login")}
          >
            Login
          </Link>
        </>

      )}

    </span>

  );

};

export default PageForward;