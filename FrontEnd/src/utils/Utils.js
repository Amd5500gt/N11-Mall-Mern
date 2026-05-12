import toast from "react-hot-toast";

// 🔊 PREMIUM SOUND SYSTEM
const playBeep = (type = "success") => {
  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    // 🎵 SOUND TYPES
    if (type === "success") {
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        1200,
        ctx.currentTime + 0.15
      );

      filter.type = "lowpass";
      filter.frequency.value = 1800;
    } else {
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(300, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        180,
        ctx.currentTime + 0.2
      );

      filter.type = "bandpass";
      filter.frequency.value = 500;
    }

    gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + 0.25
    );

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.25);
  } catch (err) {
    console.log("Audio blocked by browser");
  }
};

// 🎨 COMMON TOAST STYLE
const commonStyle = {
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  borderRadius: "18px",
  padding: "14px 18px",
  fontWeight: "600",
  letterSpacing: "0.4px",
  minWidth: "280px",
  boxShadow: "0 8px 35px rgba(0,0,0,0.35)",
  border: "1px solid rgba(255,255,255,0.08)",
};

// 🚀 SUCCESS TOAST
export const handleSuccess = (msg) => {
  playBeep("success");

  toast.success(msg || "Success!", {
    duration: 2500,
    position: "top-right",
    icon: "✨",

    style: {
      ...commonStyle,
      background:
        "linear-gradient(135deg, rgba(0,255,170,0.18), rgba(0,150,255,0.12))",
      color: "#d7fff3",
      border: "1px solid rgba(0,255,170,0.28)",
      boxShadow: "0 0 25px rgba(0,255,170,0.22)",
    },
  });
};

// ❌ ERROR TOAST
export const handleError = (msg) => {
  playBeep("error");

  toast.error(msg || "Something went wrong!", {
    duration: 3000,
    position: "top-right",
      icon: "💀",

    style: {
      ...commonStyle,
      background:
        "linear-gradient(135deg, rgba(255,0,90,0.18), rgba(255,80,80,0.12))",
      color: "#ffe2e8",
      border: "1px solid rgba(255,0,90,0.28)",
      boxShadow: "0 0 25px rgba(255,0,90,0.22)",
    },
  });
};

// ⏳ LOADING / PROMISE TOAST
export const handlePromise = async (promise) => {
  return toast.promise(
    promise,
    {
      loading: "Processing...",

      success: (res) => {
        playBeep("success");
        return res?.message || "Completed Successfully!";
      },

      error: (err) => {
        playBeep("error");
        return err?.message || "Request Failed!";
      },
    },

    {
      position: "top-right",

      style: {
        ...commonStyle,
        background:
          "linear-gradient(135deg, rgba(20,20,20,0.92), rgba(40,40,40,0.88))",
        color: "#ffffff",
      },

      success: {
        duration: 2500,
        icon: "🚀",
      },

      error: {
        duration: 3000,
        icon: "💀",
      },
    }
  );
};

// 🌟 OPTIONAL CUSTOM TOAST
export const handleCustom = (msg) => {
  toast(msg, {
    position: "top-center",
    duration: 2500,
    icon: "🔥",

    style: {
      ...commonStyle,
      background:
        "linear-gradient(135deg, rgba(120,0,255,0.18), rgba(0,180,255,0.12))",
      color: "#f5f5ff",
      border: "1px solid rgba(140,100,255,0.25)",
      boxShadow: "0 0 30px rgba(140,100,255,0.2)",
    },
  });
};