import Image from "next/image";

export default function LogoAnchor() {
  return (
    <div
      style={{
        position: "absolute",
        top: "14%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none"
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
