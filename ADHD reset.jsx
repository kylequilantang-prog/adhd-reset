import React, { useState, useEffect, useRef } from "react";
import { Wind, Eye, ArrowLeft, Vibrate, VibrateOff } from "lucide-react";

export default function App() {
  const [screen, setScreen] = useState("home"); // home | breathing | grounding
  const [hapticOn, setHapticOn] = useState(true);

  // Inject Google Fonts once
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300&family=DM+Sans:wght@400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // Load haptic preference
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage?.get?.("haptic_pref");
        if (res?.value === "off") setHapticOn(false);
      } catch (e) {}
    })();
  }, []);

  const toggleHaptic = async () => {
    const next = !hapticOn;
    setHapticOn(next);
    try {
      await window.storage?.set?.("haptic_pref", next ? "on" : "off");
    } catch (e) {}
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(ellipse at top, #d8e9e3 0%, #c9dde4 45%, #b8cdd8 100%)",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        color: "#2d4a4a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Soft grain overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.35,
          mixBlendMode: "overlay",
          pointerEvents: "none",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.08 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 480,
          margin: "0 auto",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {screen === "home" && (
          <Home
            go={setScreen}
            hapticOn={hapticOn}
            toggleHaptic={toggleHaptic}
          />
        )}
        {screen === "breathing" && (
          <Breathing back={() => setScreen("home")} hapticOn={hapticOn} />
        )}
        {screen === "grounding" && (
          <Grounding back={() => setScreen("home")} hapticOn={hapticOn} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------- HOME ------------------------------- */

function Home({ go, hapticOn, toggleHaptic }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "32px 24px 40px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 56,
        }}
      >
        <div
          style={{
            fontFamily: "'Fraunces', serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 22,
            letterSpacing: "0.02em",
            color: "#3d5757",
          }}
        >
          reset
        </div>
        <button
          onClick={toggleHaptic}
          aria-label="Toggle haptics"
          style={{
            background: "rgba(255,255,255,0.4)",
            border: "1px solid rgba(61,87,87,0.15)",
            borderRadius: 999,
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: "#3d5757",
            backdropFilter: "blur(8px)",
          }}
        >
          {hapticOn ? <Vibrate size={14} /> : <VibrateOff size={14} />}
          <span>{hapticOn ? "haptic on" : "haptic off"}</span>
        </button>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 300,
            fontSize: 44,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: 0,
            color: "#1f3838",
          }}
        >
          breathe
          <br />
          <em style={{ fontWeight: 300 }}>or notice.</em>
        </h1>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            lineHeight: 1.6,
            color: "#5a7575",
            marginTop: 16,
            maxWidth: 320,
          }}
        >
          Pick one. Your nervous system will follow.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          flex: 1,
        }}
      >
        <BigButton
          onClick={() => go("breathing")}
          icon={<Wind size={28} strokeWidth={1.4} />}
          title="Box Breathing"
          subtitle="4 · 4 · 6 · 4 — reset the system"
          accent="#a8c5bd"
        />
        <BigButton
          onClick={() => go("grounding")}
          icon={<Eye size={28} strokeWidth={1.4} />}
          title="5 — 4 — 3 — 2 — 1"
          subtitle="anchor in your senses"
          accent="#b6c8d6"
        />
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "#7a9090",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginTop: 32,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        you're already doing the work
      </div>
    </div>
  );
}

function BigButton({ onClick, icon, title, subtitle, accent }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        textAlign: "left",
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.7)",
        borderRadius: 24,
        padding: "28px 24px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        cursor: "pointer",
        transition: "transform 200ms ease, box-shadow 200ms ease",
        transform: pressed ? "scale(0.98)" : "scale(1)",
        boxShadow: pressed
          ? "0 4px 12px rgba(45,74,74,0.08)"
          : "0 8px 28px rgba(45,74,74,0.12)",
        fontFamily: "inherit",
        color: "inherit",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#1f3838",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 400,
            fontSize: 22,
            color: "#1f3838",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#5a7575",
            marginTop: 4,
          }}
        >
          {subtitle}
        </div>
      </div>
    </button>
  );
}

/* ----------------------------- BREATHING ----------------------------- */

function Breathing({ back, hapticOn }) {
  const PHASES = [
    { name: "inhale", duration: 4000 },
    { name: "hold", duration: 4000 },
    { name: "exhale", duration: 6000 },
    { name: "hold", duration: 4000 },
  ];
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [duration, setDuration] = useState(3); // minutes
  const [elapsed, setElapsed] = useState(0); // seconds
  const startRef = useRef(null);
  const phaseTimeoutRef = useRef(null);
  const tickRef = useRef(null);

  const totalSeconds = duration * 60;
  const remaining = Math.max(0, totalSeconds - elapsed);
  const phase = PHASES[phaseIdx];

  const buzz = (ms = 30) => {
    if (hapticOn && navigator.vibrate) navigator.vibrate(ms);
  };

  useEffect(() => {
    if (!running) return;
    buzz(40);
    phaseTimeoutRef.current = setTimeout(() => {
      setPhaseIdx((i) => (i + 1) % PHASES.length);
    }, phase.duration);
    return () => clearTimeout(phaseTimeoutRef.current);
    // eslint-disable-next-line
  }, [running, phaseIdx]);

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now() - elapsed * 1000;
    tickRef.current = setInterval(() => {
      const sec = Math.floor((Date.now() - startRef.current) / 1000);
      setElapsed(sec);
      if (sec >= totalSeconds) stop(true);
    }, 250);
    return () => clearInterval(tickRef.current);
    // eslint-disable-next-line
  }, [running]);

  const start = () => {
    setElapsed(0);
    setPhaseIdx(0);
    setRunning(true);
  };
  const stop = (completed = false) => {
    setRunning(false);
    clearTimeout(phaseTimeoutRef.current);
    clearInterval(tickRef.current);
    if (completed && hapticOn && navigator.vibrate)
      navigator.vibrate([60, 80, 60]);
  };

  const fmt = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // circle scale based on phase
  const scaleFor = (p) => {
    if (p.name === "inhale") return 1;
    if (p.name === "exhale") return 0.55;
    if (phaseIdx === 1) return 1; // hold after inhale
    return 0.55; // hold after exhale
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "24px 24px 40px",
      }}
    >
      <BackBar onBack={back} label="box breathing" />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
        }}
      >
        {/* Breathing orb */}
        <div
          style={{
            width: 280,
            height: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* outer ring */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: "1px solid rgba(61,87,87,0.18)",
            }}
          />
          {/* breathing circle */}
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 30%, #e8f1ed 0%, #a8c5bd 60%, #7fa89d 100%)",
              transform: `scale(${running ? scaleFor(phase) : 0.75})`,
              transition: `transform ${
                running ? phase.duration : 800
              }ms cubic-bezier(0.4, 0, 0.2, 1)`,
              boxShadow:
                "0 12px 40px rgba(127,168,157,0.35), inset 0 -8px 20px rgba(127,168,157,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: 28,
                color: "#1f3838",
                textAlign: "center",
              }}
            >
              {running ? phase.name : "ready"}
            </div>
          </div>
        </div>

        {/* Time */}
        <div
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 300,
            fontSize: 32,
            color: "#3d5757",
            letterSpacing: "0.02em",
          }}
        >
          {running ? fmt(remaining) : fmt(totalSeconds)}
        </div>

        {/* Duration picker (only when stopped) */}
        {!running && (
          <div style={{ display: "flex", gap: 12 }}>
            {[1, 3, 5].map((m) => (
              <button
                key={m}
                onClick={() => setDuration(m)}
                style={{
                  background:
                    duration === m
                      ? "rgba(127,168,157,0.9)"
                      : "rgba(255,255,255,0.55)",
                  color: duration === m ? "#fff" : "#3d5757",
                  border: "1px solid rgba(61,87,87,0.15)",
                  borderRadius: 999,
                  padding: "10px 20px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                }}
              >
                {m} min
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action button */}
      <button
        onClick={running ? () => stop(false) : start}
        style={{
          background: running
            ? "rgba(255,255,255,0.55)"
            : "linear-gradient(135deg, #7fa89d 0%, #5e8a7f 100%)",
          color: running ? "#3d5757" : "#fff",
          border: "1px solid rgba(255,255,255,0.7)",
          borderRadius: 999,
          padding: "20px",
          fontFamily: "'Fraunces', serif",
          fontSize: 18,
          fontStyle: "italic",
          fontWeight: 400,
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          boxShadow: running
            ? "none"
            : "0 8px 24px rgba(94,138,127,0.35)",
          transition: "all 200ms ease",
        }}
      >
        {running ? "end session" : "begin"}
      </button>
    </div>
  );
}

/* ---------------------------- GROUNDING ---------------------------- */

function Grounding({ back, hapticOn }) {
  const STEPS = [
    {
      n: 5,
      sense: "see",
      prompt: "Find 5 things you can see.",
      hint: "Big things. Small things. Look up. Look down.",
      color: "#b6c8d6",
    },
    {
      n: 4,
      sense: "feel",
      prompt: "Find 4 things you can feel.",
      hint: "Your feet on the ground. Fabric on skin. Air.",
      color: "#c4c8d8",
    },
    {
      n: 3,
      sense: "hear",
      prompt: "Find 3 things you can hear.",
      hint: "Close your eyes if you can. Layer by layer.",
      color: "#c8c0d4",
    },
    {
      n: 2,
      sense: "smell",
      prompt: "Find 2 things you can smell.",
      hint: "Or 2 scents you like, if nothing's around.",
      color: "#d4c0c8",
    },
    {
      n: 1,
      sense: "taste",
      prompt: "Find 1 thing you can taste.",
      hint: "Even just the inside of your mouth counts.",
      color: "#d4c8b8",
    },
  ];
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  const step = STEPS[idx];

  const buzz = (ms = 25) => {
    if (hapticOn && navigator.vibrate) navigator.vibrate(ms);
  };

  const tap = () => {
    if (count + 1 < step.n) {
      // still more to find in this sense
      buzz(20);
      setCount(count + 1);
    } else {
      // last one for this sense — advance
      if (idx < STEPS.length - 1) {
        if (hapticOn && navigator.vibrate) navigator.vibrate([30, 50, 30]);
        setIdx(idx + 1);
        setCount(0);
      } else {
        if (hapticOn && navigator.vibrate) navigator.vibrate([40, 80, 40, 80, 40]);
        setDone(true);
      }
    }
  };

  const restart = () => {
    setIdx(0);
    setCount(0);
    setDone(false);
  };

  const remaining = step.n - count;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "24px 24px 40px",
      }}
    >
      <BackBar onBack={back} label="5 — 4 — 3 — 2 — 1" />

      {!done ? (
        <>
          {/* progress dots — overall sense progress */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginBottom: 24,
            }}
          >
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === idx ? 24 : 8,
                  height: 8,
                  borderRadius: 999,
                  background:
                    i < idx
                      ? "rgba(61,87,87,0.65)"
                      : i === idx
                      ? "rgba(61,87,87,0.65)"
                      : "rgba(61,87,87,0.18)",
                  transition: "all 300ms ease",
                }}
              />
            ))}
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
              textAlign: "center",
            }}
          >
            {/* Big tappable circle with remaining count */}
            <button
              onClick={tap}
              key={`${idx}-${count}`}
              style={{
                width: 240,
                height: 240,
                borderRadius: "50%",
                border: "none",
                background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.75) 0%, ${step.color} 70%)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#1f3838",
                boxShadow: `0 12px 40px ${step.color}80`,
                animation: "tapPulse 400ms ease-out",
                fontFamily: "inherit",
                padding: 0,
              }}
            >
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 300,
                  fontSize: 110,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                {remaining}
              </div>
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: 14,
                  color: "#3d5757",
                  marginTop: 4,
                  letterSpacing: "0.05em",
                }}
              >
                tap when found
              </div>
            </button>

            {/* Found-so-far pips */}
            <div
              style={{
                display: "flex",
                gap: 10,
                minHeight: 14,
              }}
            >
              {Array.from({ length: step.n }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background:
                      i < count
                        ? step.color
                        : "rgba(61,87,87,0.15)",
                    border:
                      i < count
                        ? "1px solid rgba(61,87,87,0.25)"
                        : "1px solid rgba(61,87,87,0.1)",
                    transition: "all 300ms ease",
                    transform: i < count ? "scale(1)" : "scale(0.9)",
                  }}
                />
              ))}
            </div>

            <div>
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: 13,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#7a9090",
                  marginBottom: 10,
                }}
              >
                things you can {step.sense}
              </div>
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 300,
                  fontSize: 24,
                  color: "#1f3838",
                  lineHeight: 1.3,
                  letterSpacing: "-0.01em",
                  maxWidth: 320,
                  margin: "0 auto",
                }}
              >
                {step.prompt}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#5a7575",
                  marginTop: 10,
                  maxWidth: 280,
                  marginInline: "auto",
                  lineHeight: 1.5,
                }}
              >
                {step.hint}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 30%, #e8f1ed 0%, #a8c5bd 100%)",
              boxShadow: "0 12px 40px rgba(127,168,157,0.35)",
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 300,
                fontSize: 36,
                color: "#1f3838",
                letterSpacing: "-0.02em",
              }}
            >
              <em>you're here.</em>
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#5a7575",
                marginTop: 12,
                maxWidth: 280,
                lineHeight: 1.6,
              }}
            >
              Notice what shifted. Even a little is something.
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button
              onClick={restart}
              style={{
                background: "rgba(255,255,255,0.55)",
                color: "#3d5757",
                border: "1px solid rgba(61,87,87,0.15)",
                borderRadius: 999,
                padding: "14px 28px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                cursor: "pointer",
                backdropFilter: "blur(12px)",
              }}
            >
              again
            </button>
            <button
              onClick={back}
              style={{
                background: "linear-gradient(135deg, #8ba6b8 0%, #6b8a9d 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "14px 28px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              done
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes tapPulse {
          0% { transform: scale(0.94); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ----------------------------- SHARED ----------------------------- */

function BackBar({ onBack, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
      }}
    >
      <button
        onClick={onBack}
        aria-label="Back"
        style={{
          background: "rgba(255,255,255,0.55)",
          border: "1px solid rgba(61,87,87,0.15)",
          borderRadius: "50%",
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#3d5757",
          backdropFilter: "blur(8px)",
        }}
      >
        <ArrowLeft size={18} strokeWidth={1.6} />
      </button>
      <div
        style={{
          fontFamily: "'Fraunces', serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: 18,
          color: "#3d5757",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </div>
    </div>
  );
}
