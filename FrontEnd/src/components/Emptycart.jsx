import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const EmptyCart = () => {
  return (
    <div style={{
      height: "50vh",
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
    </div>
  );
}
export default EmptyCart
