import type { Metadata } from "next"
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://wisdombenson.github.io"),
  title: {
    default: "Wisdom Benson — Quantum Physics & Philosophy",
    template: "%s — Wisdom Benson",
  },
  description:
    "Wisdom Benson studies quantum materials with first-principles methods and writes on value, personhood, and metaphysical structure.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Wisdom Benson — Quantum Physics & Philosophy",
    description: "Research across quantum materials, computation, spectroscopy, and philosophical metaphysics.",
    images: ["/assets/social-preview.png"],
    type: "website",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
