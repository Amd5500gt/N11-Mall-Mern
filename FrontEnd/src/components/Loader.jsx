import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loader = () => {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <DotLottieReact
        src="/loading.lottie"   // public folder me daal
        loop
        autoplay
        style={{ width: 200 }}
      />
    </div>
  );
}
export default Loader