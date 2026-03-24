"use client";

import { submitAudit } from "@/lib/api";
import type { KernelState } from "@/lib/types";

type Props = {
  email: string;
  setEmail: (v: string) => void;
  url: string;
  setUrl: (v: string) => void;
  state: KernelState;
  setState: (v: KernelState) => void;
};

export default function Kernel({
  email,
  setEmail,
  url,
  setUrl,
  state,
  setState
}: Props) {
  const disabled = state === "success";

  const handleSubmit = async () => {
    if (!email || !url) return;

    setState("transitioning");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("url", url);
    formData.append("language", "EN");

    try {
      await submitAudit(formData);
      setState("success");
    } catch {
      setState("idle");
    }
  };

  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 520,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    transform:
      state === "transitioning"
        ? "scale(0.98)"
        : state === "success"
        ? "scale(0.99)"
        : "scale(1)",
    transition: "transform 0.4s ease"
  };

  const baseStyle: React.CSSProperties = {
    height: 44,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#111827",
    padding: "0 12px",
    fontSize: 14,
    color: "#e5eefb",
    outline: "none",
    width: "100%",
    opacity: disabled ? 0.6 : 1,
    transition: "all 0.2s ease"
  };

  return (
    <main
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 32
      }}
    >
      <div style={containerStyle}>
        <input
          placeholder="your@email.com"
          value={email}
          disabled={disabled}
          onChange={(e) => setEmail(e.target.value)}
          style={baseStyle}
        />

        <input
          placeholder="paste url"
          value={url}
          disabled={disabled}
          onChange={(e) => setUrl(e.target.value)}
          style={baseStyle}
        />

        <button
          onClick={handleSubmit}
          disabled={disabled}
          style={{
            ...baseStyle,
            cursor: disabled ? "default" : "pointer",
            background: "#0f172a"
          }}
        >
          Analyze
        </button>

        {state === "success" && (
          <div
            style={{
              marginTop: 12,
              fontSize: 11,
              opacity: 0.6,
              textAlign: "center",
              lineHeight: 1.5
            }}
          >
            Submission received.<br />
            Check your email.
          </div>
        )}
      </div>
    </main>
  );
}
