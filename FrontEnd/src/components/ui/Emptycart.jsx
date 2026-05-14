import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { FaCircleArrowRight } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const EmptyCart = () => {
  const navigate = useNavigate()
  return (
    <div style={{
      height: "60vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <DotLottieReact
        src="/empty.lottie"  
        loop
        autoplay
        style={{ width: 200 }}
      />
      <div>
           <h1
            style={{
              fontSize: "24px",
              fontWeight: "800",
              color: "#0f172a",
              marginBottom: "12px",
              letterSpacing: "-0.5px",
            }}
          >
            Your Cart is Empty
          </h1>

          {/* Button */}

          <button
            onClick={() => navigate("/")}
            style={{
              border: "none",
              outline: "none",
              background:
                "linear-gradient(135deg,#f34df1,#8b5cf6)",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: "14px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            Continue Shopping
            <FaCircleArrowRight size={18} />
          </button>

      </div>
    </div>
  );
}
export default EmptyCart
