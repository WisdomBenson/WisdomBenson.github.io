# Wisdom Benson — Research Portfolio

A static, dual-domain portfolio for quantum-physics research and philosophical writing. Built with Next.js static export, React 19, Tailwind CSS v4, shadcn/ui primitives, MDX, KaTeX, Lucide, and Framer Motion.

## Local development

```bash
pnpm install
pnpm dev
```

Quality checks:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

The production build is exported to `out/` and deployed to GitHub Pages by `.github/workflows/deploy.yml` whenever `main` is updated.

## Project structure

```text
.
├── .github/workflows/deploy.yml
├── public/
│   ├── assets/
│   │   ├── raman-spectrum-488nm-rt-1400.webp
│   │   ├── wisdom-benson-portrait.jpeg
│   │   └── zno-qd-coordinate-map-1400.webp
│   └── wisdom-benson-resume.pdf
├── src/
│   ├── app/
│   │   ├── thought-lab/
│   │   │   ├── model-and-meaning/page.mdx
│   │   │   └── romantic-exclusivity/page.mdx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── hero-bento.tsx
│   │   ├── publication-hub.tsx
│   │   ├── quantum-visualizer.tsx
│   │   └── ui/
│   ├── content/
│   │   ├── profile.ts
│   │   └── publications.ts
│   └── lib/utils.ts
├── next.config.mjs
└── tailwind.config.mjs
```

Publication details are maintained in `src/content/publications.ts`; profile, CV, and conference records are maintained in `src/content/profile.ts`.
