import Link from "next/link";

export default function LegalAnchor() {
  return (
    <Link
      href="/impressum"
      style={{
        position: "absolute",
        bottom: 24,
        right: 32,
        fontSize: 11,
        color: "#9fb3c8",
        opacity: 0.5
      }}
    >
      Impressum
    </Link>
  );
}
