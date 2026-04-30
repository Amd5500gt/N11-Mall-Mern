import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ErrorPage = () => {
  return (
    <div style={{
      height: "50vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <DotLottieReact
        src="/errorpagecat.lottie" 
        loop
        autoplay
        style={{ width: 200 }}
      />
    </div>
  );
}
export default ErrorPage
