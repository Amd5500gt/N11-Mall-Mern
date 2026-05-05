import toast, { Toaster } from 'react-hot-toast';
// 🔊 SOUND (No file needed)
const playBeep = (type = "success") => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  if (type === "success") {
    oscillator.frequency.value = 900; // high pitch
    oscillator.type = "triangle";
  } else {
    oscillator.frequency.value = 300; // low pitch
    oscillator.type = "square";
  }

  gainNode.gain.value = 0.08;

  oscillator.start();

  setTimeout(() => {
    oscillator.stop();
  }, 150);
};

// 🚀 SUCCESS TOAST
export const handleSuccess = (msg) => {
  playBeep("success");

  toast.success(msg, {
    position: "top-right",
    autoClose: 2500,
    icon: "✅",
    theme: "dark",
    style: {
      background: "rgba(0, 255, 150, 0.15)",
      backdropFilter: "blur(12px)",
      color: "#00ffcc",
      padding: "12px 18px",
      border: "1px solid rgba(0,255,150,0.4)",
      borderRadius: "14px",
      boxShadow: "0 0 20px rgba(0,255,150,0.4)",
      fontWeight: "600",
      letterSpacing: "0.4px"
    }
  });
};

export const handlePromise = (promise) => {
  toast.promise(
    promise,
    {
      loading: 'Processing...',
      success: (res) => {
        playBeep("success");
        return res?.message || "Success!";
      },
      error: (err) => {
        playBeep("error");
        return err?.message || "Error!";
      }
    }
  );
};

// ❌ ERROR TOAST
export const handleError = (msg) => {
  playBeep("error");

  toast.error(msg, {
    position: "top-right",
    autoClose: 3000,
    icon: "💀",
    theme: "dark",
    style: {
      background: "rgba(255, 0, 80, 0.15)",
      backdropFilter: "blur(12px)",
      color: "#ff4d6d",
      padding: "12px 18px",
      border: "1px solid rgba(255,0,80,0.4)",
      borderRadius: "14px",
      boxShadow: "0 0 20px rgba(255,0,80,0.4)",
      fontWeight: "600",
      letterSpacing: "0.4px"
    }
  });
};