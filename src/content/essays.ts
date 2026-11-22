type EssayEntry = {
  type: "Essay" | "Peer-reviewed article"
  title: string
  description: string
  href: string
  readingTimeMinutes?: number
}

export const essays: readonly EssayEntry[] = [
  {
    type: "Peer-reviewed article",
    title: "Romantic exclusivity as structural necessity",
    description: "The original article in Philosophies 10(5), 102 (2025): a Kantian–Scheler–Schopenhauer synthesis of romantic exclusivity.",
    href: "/assets/articles/philosophies-10-00102.pdf",
  },
  {
    type: "Essay",
    title: "What a model leaves out: From quantum dots to the future of work",
    description: "Controlling a physical system differs fundamentally from understanding it.",
    readingTimeMinutes: 3,
    href: "/thought-lab/model-and-meaning/",
  },
  {
    type: "Essay",
    title: "AI in our workplace",
    description: "An argument for giving workers AI tools and keeping them connected to the value they help create.",
    readingTimeMinutes: 2,
    href: "/thought-lab/ai-in-our-workplace/",
  },
  {
    type: "Essay",
    title: "AI utopia or dystopia? The answer will be written in employment contracts",
    description: "How employment contracts, access to AI tools, and institutional incentives shape the future of work.",
    readingTimeMinutes: 7,
    href: "/thought-lab/ai-utopia-or-dystopia/",
  },
]
