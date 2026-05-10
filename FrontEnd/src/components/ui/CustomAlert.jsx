import React from 'react'

const CustomAlert = ({
  message,
  type = "success",
  onClose,
  onShowPage
}) => {

  return (

    <>

      {/* INTERNAL CSS */}

      <style>{`

        .nxc-alert-overlay{
          position:fixed;
          top:0;
          left:0;
          width:100%;
          height:100vh;

          display:flex;
          justify-content:center;
          align-items:center;

          background:rgba(0,0,0,0.55);

          z-index:99999;

          animation:nxcAlertFade 0.3s ease;
        }

        .nxc-alert-box{
          width:90%;
          max-width:380px;

          background:#ffffff;

          border-radius:22px;

          padding:30px 25px;

          text-align:center;

          box-shadow:
          0 10px 40px rgba(0,0,0,0.25);

          animation:nxcAlertPop 0.3s ease;
        }

        .nxc-alert-box.success{
          border-top:6px solid #22c55e;
        }

        .nxc-alert-box.error{
          border-top:6px solid #ef4444;
        }

        .nxc-alert-box.warning{
          border-top:6px solid #f59e0b;
        }

        .nxc-alert-title{
          font-size:26px;
          font-weight:700;

          color:#111827;

          margin-bottom:12px;
        }

        .nxc-alert-message{
          font-size:15px;

          color:#6b7280;

          line-height:1.6;

          margin-bottom:25px;
        }

        /* BUTTON WRAPPER */

        .nxc-alert-btns{
          display:flex;
          gap:12px;
        }

        /* COMMON BUTTON */

        .nxc-alert-btn{
          flex:1;

          height:50px;

          border:none;

          border-radius:14px;

          cursor:pointer;

          font-size:15px;
          font-weight:700;

          transition:0.3s;
        }

        /* OK BUTTON */

        .nxc-alert-btn.ok{
          color:#ffffff;

          background:
          linear-gradient(
            90deg,
            #2563eb,
            #7c3aed
          );
        }

        /* CANCEL BUTTON */

        .nxc-alert-btn.cancel{
          background:#f3f4f6;
          color:#111827;
        }

        .nxc-alert-btn:hover{
          transform:translateY(-2px);
          opacity:0.95;
        }

        @keyframes nxcAlertFade{

          from{
            opacity:0;
          }

          to{
            opacity:1;
          }

        }

        @keyframes nxcAlertPop{

          from{
            opacity:0;

            transform:
            scale(0.8)
            translateY(20px);
          }

          to{
            opacity:1;

            transform:
            scale(1)
            translateY(0);
          }

        }

        @media(max-width:480px){

          .nxc-alert-box{
            padding:25px 18px;
          }

          .nxc-alert-title{
            font-size:22px;
          }

        }

      `}</style>

      {/* ALERT */}

      <div className="nxc-alert-overlay">

        <div className={`nxc-alert-box ${type}`}>

          <h2 className="nxc-alert-title">

            {type === "success"
              ? "Success"
              : type === "error"
              ? "Error"
              : "Warning"}

          </h2>

          <p className="nxc-alert-message">
            {message}
          </p>

          {/* BUTTONS */}

          <div className="nxc-alert-btns">

            {/* CANCEL */}

            <button
              className="nxc-alert-btn cancel"
              onClick={onClose}
            >

              Cancel

            </button>

            {/* OK */}

            <button
              className="nxc-alert-btn ok"

              onClick={() => {

                onClose()

                onShowPage()

              }}
            >

              OK

            </button>

          </div>

        </div>

      </div>

    </>

  )
}

export default CustomAlert