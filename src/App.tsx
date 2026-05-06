import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Copy,
  Moon,
  Palette,
  PanelRightClose,
  PanelRightOpen,
  RotateCcw,
  Sparkles,
  Sun,
  Type,
} from "lucide-react";

type Mode = "light" | "dark";

const presets: Record<Mode, { background: string; text: string; accent: string }> = {
  light: { background: "#f7f8fb", text: "#0f172a", accent: "#7c3aed" },
  dark: { background: "#09090b", text: "#f8fafc", accent: "#8b5cf6" },
};

function hexToRgba(hex: string, alpha: number) {
  const sanitized = hex.replace("#", "");
  const full =
    sanitized.length === 3
      ? sanitized.split("").map((c) => c + c).join("")
      : sanitized;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const systemMode = (): Mode =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";

export default function App() {
  const [mode, setMode] = useState<Mode>(systemMode);
  const [{ background, text, accent }, setColors] = useState(() => presets[systemMode()]);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [domain, setDomain] = useState("sarbu.de");

  const applyPreset = (next: Mode) => {
    setMode(next);
    setColors(presets[next]);
  };

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => applyPreset(media.matches ? "light" : "dark");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const muted = hexToRgba(text, 0.68);
  const isDark = mode === "dark";
  const panelBg = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.88)";
  const panelBorder = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(15, 23, 42, 0.10)";
  const gridLine = hexToRgba(text, 0.04);

  const copyDomain = async () => {
    try {
      await navigator.clipboard.writeText(domain);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <motion.div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        color: text,
        background: `
          radial-gradient(circle at 20% 25%, ${hexToRgba(accent, 0.18)}, transparent 24%),
          radial-gradient(circle at 80% 15%, ${hexToRgba(accent, 0.12)}, transparent 20%),
          radial-gradient(circle at 50% 85%, ${hexToRgba(text, isDark ? 0.06 : 0.04)}, transparent 28%),
          ${background}
        `,
        backgroundSize: "200% 200%",
      }}
      animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
      transition={{ duration: 80, ease: "linear", repeat: Infinity }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.3,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(${gridLine} 1px, transparent 1px), linear-gradient(90deg, ${gridLine} 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(circle at center, black, transparent 82%)",
          WebkitMaskImage: "radial-gradient(circle at center, black, transparent 82%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "44rem",
          height: "44rem",
          transform: "translate(-50%, -50%)",
          borderRadius: "999px",
          filter: "blur(80px)",
          background: hexToRgba(accent, isDark ? 0.12 : 0.08),
          pointerEvents: "none",
        }}
      />

      <main
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "1100px" }}>
          <div
            style={{
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "999px",
                background: accent,
                boxShadow: `0 0 24px ${hexToRgba(accent, 0.8)}`,
              }}
            />
            <span
              style={{
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.36em",
                color: muted,
              }}
            >
              empty page
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            style={{
              margin: 0,
              fontSize: "clamp(3rem, 9vw, 8rem)",
              fontWeight: 600,
              letterSpacing: "-0.06em",
              color: text,
              textShadow: `0 0 38px ${hexToRgba(accent, isDark ? 0.16 : 0.08)}`,
            }}
          >
            {domain}
          </motion.h1>

          <p
            style={{
              marginTop: "24px",
              maxWidth: "760px",
              marginInline: "auto",
              fontSize: "clamp(1rem, 2vw, 1.35rem)",
              lineHeight: 1.6,
              color: muted,
            }}
          >
            This page is intentionally left blank.
          </p>

          {showCopy && (
            <button
              onClick={copyDomain}
              style={{
                marginTop: "32px",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                borderRadius: "999px",
                border: `1px solid ${hexToRgba(accent, 0.34)}`,
                background: hexToRgba(accent, isDark ? 0.14 : 0.1),
                color: text,
                padding: "12px 18px",
                cursor: "pointer",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                fontSize: "14px",
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              Copy domain
            </button>
          )}
        </div>
      </main>

      <button
        onClick={() => setControlsOpen((v) => !v)}
        style={{
          position: "fixed",
          right: 0,
          bottom: "14vh",
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          width: "52px",
          minHeight: "164px",
          borderRadius: "18px 0 0 18px",
          border: `1px solid ${panelBorder}`,
          borderRight: "none",
          background: panelBg,
          color: text,
          padding: "14px 10px",
          cursor: "pointer",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: `0 12px 40px ${hexToRgba("#000000", isDark ? 0.28 : 0.08)}`,
        }}
      >
        {controlsOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
        <span
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontSize: "12px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          Customize
        </span>
      </button>

      {controlsOpen && (
        <>
          <div
            onClick={() => setControlsOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 30,
              background: "rgba(0,0,0,0.2)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
            }}
          />

          <aside
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              zIndex: 40,
              width: "min(420px, 100vw)",
              height: "100vh",
              padding: "16px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: "28px",
                border: `1px solid ${panelBorder}`,
                background: panelBg,
                backdropFilter: "blur(24px) saturate(150%)",
                WebkitBackdropFilter: "blur(24px) saturate(150%)",
                boxShadow: `0 24px 80px ${hexToRgba("#000000", isDark ? 0.34 : 0.12)}`,
                padding: "20px",
                boxSizing: "border-box",
                overflow: "auto",
              }}
            >
              <header
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.25em",
                      color: muted,
                    }}
                  >
                    Controls
                  </div>
                  <h2 style={{ margin: "8px 0 0", fontSize: "28px", fontWeight: 600 }}>
                    Style playground
                  </h2>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => applyPreset(mode)} style={iconButtonStyle(panelBorder, text)}>
                    <RotateCcw size={16} />
                  </button>
                  <button onClick={() => setControlsOpen(false)} style={iconButtonStyle(panelBorder, text)}>
                    <PanelRightClose size={16} />
                  </button>
                </div>
              </header>

              <div style={{ display: "grid", gap: "18px" }}>
                <ControlBlock label="Domain" icon={<Type size={16} />}>
                  <input
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    style={inputStyle(background, isDark, panelBorder, text)}
                  />
                </ControlBlock>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <button
                    onClick={() => applyPreset("light")}
                    style={modeButtonStyle(mode === "light", accent, panelBorder, text)}
                  >
                    <Sun size={16} style={{ marginRight: 8 }} />
                    Light
                  </button>
                  <button
                    onClick={() => applyPreset("dark")}
                    style={modeButtonStyle(mode === "dark", accent, panelBorder, text)}
                  >
                    <Moon size={16} style={{ marginRight: 8 }} />
                    Dark
                  </button>
                </div>

                <ControlBlock label="Background" icon={<Palette size={16} />}>
                  <input
                    type="color"
                    value={background}
                    onChange={(e) => setColors((c) => ({ ...c, background: e.target.value }))}
                    style={colorInputStyle(panelBorder)}
                  />
                </ControlBlock>

                <ControlBlock label="Text" icon={<Type size={16} />}>
                  <input
                    type="color"
                    value={text}
                    onChange={(e) => setColors((c) => ({ ...c, text: e.target.value }))}
                    style={colorInputStyle(panelBorder)}
                  />
                </ControlBlock>

                <ControlBlock label="Accent" icon={<Sparkles size={16} />}>
                  <input
                    type="color"
                    value={accent}
                    onChange={(e) => setColors((c) => ({ ...c, accent: e.target.value }))}
                    style={colorInputStyle(panelBorder)}
                  />
                </ControlBlock>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: `1px solid ${panelBorder}`,
                    borderRadius: "18px",
                    padding: "14px 16px",
                    fontSize: "14px",
                  }}
                >
                  <span>Show copy button</span>
                  <input
                    type="checkbox"
                    checked={showCopy}
                    onChange={(e) => setShowCopy(e.target.checked)}
                  />
                </label>
              </div>
            </div>
          </aside>
        </>
      )}
    </motion.div>
  );
}

function ControlBlock({
  label,
  icon,
  children,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
          fontSize: "14px",
          fontWeight: 500,
        }}
      >
        {icon}
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

const iconButtonStyle = (borderColor: string, color: string) =>
  ({
    width: "38px",
    height: "38px",
    borderRadius: "999px",
    border: `1px solid ${borderColor}`,
    background: "transparent",
    color,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  }) as const;

const inputStyle = (background: string, isDark: boolean, borderColor: string, color: string) =>
  ({
    width: "100%",
    height: "48px",
    borderRadius: "18px",
    border: `1px solid ${borderColor}`,
    padding: "0 16px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    background: hexToRgba(background, isDark ? 0.25 : 0.75),
    color,
  }) as const;

const colorInputStyle = (borderColor: string) =>
  ({
    width: "100%",
    height: "48px",
    borderRadius: "18px",
    border: `1px solid ${borderColor}`,
    padding: "6px",
    background: "transparent",
    boxSizing: "border-box",
    cursor: "pointer",
  }) as const;

const modeButtonStyle = (active: boolean, accent: string, borderColor: string, color: string) =>
  ({
    height: "48px",
    borderRadius: "18px",
    border: `1px solid ${active ? hexToRgba(accent, 0.45) : borderColor}`,
    background: active ? hexToRgba(accent, 0.12) : "transparent",
    color,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  }) as const;
