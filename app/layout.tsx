import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AppWrapper } from "@/components/app-wrapper";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "ArduinoLab",
  title: {
    default: "ArduinoLab — Learn electronics & Arduino",
    template: "%s · ArduinoLab",
  },
  description:
    "ArduinoLab — learn electronics and Arduino with visual no-code simulations, gamified missions, and Pi Network rewards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`bg-background ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="w-full overflow-hidden m-0 p-0">
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
