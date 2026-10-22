import type { Metadata } from "next"

import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://wisdombenson.github.io"),
  title: {
    default: "Wisdom Benson — Quantum Physics & Philosophy",
    template: "%s — Wisdom Benson",
  },
  description:
    "I study quantum materials with first-principles methods. I also write about value, personhood, and metaphysics.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Wisdom Benson — Quantum Physics & Philosophy",
    description: "I study quantum materials through computation and spectroscopy. I also write about philosophical metaphysics.",
    images: ["/assets/social-preview.png"],
    type: "website",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
