import "./globals.css";
import LogoAnchor from "@/components/LogoAnchor";
import LanguageSwitch from "@/components/LanguageSwitch";
import { FieldProvider } from "@/app/system/FieldProvider";

export const metadata = {
  title: "SYNTX",
  description: "Semantic Entry Layer"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LogoAnchor />
        <LanguageSwitch />
        <FieldProvider>
          {children}
        </FieldProvider>
      </body>
    </html>
  );
}
