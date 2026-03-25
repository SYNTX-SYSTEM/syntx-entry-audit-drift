import Image from "next/image";

export default function LogoAnchor() {
  return (
    <div
      style={{
        position: "fixed",
        top: "14%",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 100
      }}
    >
      <Image
        src="/logo.png"
        alt="SYNTX"
        width={72}
        height={72}
        style={{
          opacity: 0.85
        }}
      />
    </div>
  );
}
