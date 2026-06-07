export type BlogCategory =
  | "Philosophy"
  | "Computational Materials"
  | "Quantum Computing"
  | "ML Research"
  | "OCaml"
  | "CUDA"
  | "Field Notes"

export type BlogPost = {
  slug: string
  title: string
  date: string
  readTime: string
  mode: "Essay" | "Research note" | "Build log" | "Notebook"
  categories: BlogCategory[]
  summary: string
  body: Array<{
    heading: string
    paragraphs: string[]
  }>
}

export const blogCategories: BlogCategory[] = [
  "Philosophy",
  "Computational Materials",
  "Quantum Computing",
  "ML Research",
  "OCaml",
  "CUDA",
  "Field Notes",
]

export const blogPosts: BlogPost[] = [
  {
    slug: "finite-zno-quantum-dots-as-computational-objects",
    title: "Finite ZnO quantum dots as computational objects",
    date: "June 7, 2026",
    readTime: "5 min read",
    mode: "Research note",
    categories: ["Computational Materials", "Quantum Computing"],
    summary:
      "A working note on treating finite oxide nanocrystals as objects with geometry, passivation, symmetry, and boundary-condition choices rather than as small copies of bulk crystals.",
    body: [
      {
        heading: "The modeling problem",
        paragraphs: [
          "A finite ZnO quantum dot is not just a smaller wurtzite crystal. The surface is part of the physics: ligand passivation, dangling-bond removal, dipole control, and basis convergence all change what the electronic gap means.",
          "That is why my workflow keeps geometry, passivation chemistry, phonons, and quasiparticle correction in the same conversation. A result that looks clean in DFT can still be fragile if the surface model is doing unreported work.",
        ],
      },
      {
        heading: "Where this becomes useful",
        paragraphs: [
          "The practical goal is a reliable map between structure and response: which surface motifs shift band edges, which modes survive confinement, and which approximations remain trustworthy as a nanocrystal becomes computationally expensive.",
          "Those maps are useful for optoelectronics, quantum sensing, and any device idea that depends on reproducible finite-size behavior rather than bulk intuition alone.",
        ],
      },
    ],
  },
  {
    slug: "romantic-exclusivity-and-ethical-form",
    title: "Romantic exclusivity and ethical form",
    date: "June 7, 2026",
    readTime: "4 min read",
    mode: "Essay",
    categories: ["Philosophy"],
    summary:
      "A philosophy note on why exclusivity can be argued as a structural commitment rather than reduced to jealousy, possession, or social habit.",
    body: [
      {
        heading: "The deeper claim",
        paragraphs: [
          "The interesting question is not whether people prefer exclusivity. Preferences are too thin for the moral pressure carried by romantic commitment.",
          "The stronger claim is that some forms of intimacy require a structure that protects trust from becoming merely conditional, competitive, or endlessly renegotiated under market-like incentives.",
        ],
      },
      {
        heading: "What needs care",
        paragraphs: [
          "That argument only remains legitimate if exclusivity is not used as domination. A moral form becomes false when one person claims the protection of commitment while denying agency, dignity, or reciprocity to the other.",
          "The point is therefore not possession. It is whether a relationship can sustain a serious promise without dissolving into convenience.",
        ],
      },
    ],
  },
  {
    slug: "ml-surrogates-for-spectroscopy-workflows",
    title: "ML surrogates for spectroscopy workflows",
    date: "June 7, 2026",
    readTime: "6 min read",
    mode: "Notebook",
    categories: ["ML Research", "Computational Materials"],
    summary:
      "A starter notebook on using machine learning to speed Raman and materials workflows without hiding uncertainty or replacing physical interpretation.",
    body: [
      {
        heading: "The attraction",
        paragraphs: [
          "Spectroscopy generates structured data faster than a human can fully annotate it: peak positions, linewidths, temperature dependence, power dependence, and instrument artifacts all move together.",
          "Machine learning can help by building surrogates for repeated fitting, anomaly detection, or fast screening. The danger is pretending that a fast prediction is automatically a physical explanation.",
        ],
      },
      {
        heading: "A better target",
        paragraphs: [
          "The best use case is not replacing the researcher. It is equipping the researcher with calibrated suggestions, uncertainty flags, and reproducible pipelines that make the next physical question sharper.",
          "For Raman work, that means models should expose when heating, confinement, strain, or noise is likely driving an apparent trend.",
        ],
      },
    ],
  },
  {
    slug: "ocaml-for-research-software-that-must-not-lie",
    title: "OCaml for research software that must not lie",
    date: "June 7, 2026",
    readTime: "5 min read",
    mode: "Build log",
    categories: ["OCaml", "Field Notes"],
    summary:
      "A programming note on using strong types and functional design to make scientific workflows harder to misconfigure.",
    body: [
      {
        heading: "Why types matter",
        paragraphs: [
          "Many research bugs do not look dramatic. A unit is wrong, a file is parsed under the wrong assumption, or a convergence flag is treated as success because the pipeline needed to keep moving.",
          "OCaml is appealing because it lets the workflow encode distinctions that would otherwise live only in memory: relaxed versus unrelaxed geometry, raw versus corrected spectra, parsed versus validated inputs.",
        ],
      },
      {
        heading: "The engineering discipline",
        paragraphs: [
          "The goal is not language fashion. The goal is software that makes invalid states harder to express and makes future readers understand what a calculation was allowed to mean.",
          "That discipline is useful in computational materials work because the scientific object and the computational object can drift apart quietly.",
        ],
      },
    ],
  },
  {
    slug: "cuda-notes-for-many-body-materials-pipelines",
    title: "CUDA notes for many-body materials pipelines",
    date: "June 7, 2026",
    readTime: "5 min read",
    mode: "Notebook",
    categories: ["CUDA", "Computational Materials"],
    summary:
      "A practical note on GPU acceleration for expensive electronic-structure workflows, with attention to data movement and reproducibility.",
    body: [
      {
        heading: "The real bottleneck",
        paragraphs: [
          "GPU acceleration is often described as raw speed, but many materials workflows are constrained by data movement, memory pressure, and checkpoint behavior before they are constrained by floating-point throughput.",
          "For GW, BSE, and related many-body workflows, the useful question is where the pipeline can move less, reuse more, and fail transparently when resources are exhausted.",
        ],
      },
      {
        heading: "What I want from CUDA work",
        paragraphs: [
          "A strong CUDA path should leave an audit trail: precision choices, kernel assumptions, memory limits, and restart behavior should be visible enough that performance does not obscure scientific responsibility.",
          "Speed is valuable because it allows better questions. It is not valuable when it only lets a fragile workflow produce more fragile results.",
        ],
      },
    ],
  },
  {
    slug: "materials-first-quantum-computing",
    title: "Materials-first quantum computing",
    date: "June 7, 2026",
    readTime: "4 min read",
    mode: "Essay",
    categories: ["Quantum Computing", "Philosophy"],
    summary:
      "A short argument for treating quantum computing as an institutional and materials problem, not only an algorithmic promise.",
    body: [
      {
        heading: "Beyond the promise layer",
        paragraphs: [
          "Quantum computing is often sold through future capability: speedups, cryptographic disruption, simulation, optimization. Those promises matter, but they can hide the material systems that must survive long enough to make the promise real.",
          "A materials-first view starts with defects, surfaces, phonons, interfaces, and fabrication constraints. The algorithm is not separate from the physical platform that carries it.",
        ],
      },
      {
        heading: "Why the distinction matters",
        paragraphs: [
          "If institutions fund only the promise layer, they may reward demos without strengthening the materials base. If they fund the platform layer, they build knowledge that can survive even when a particular architecture changes.",
          "That is where computational materials research can contribute: it makes the physical constraints legible before they become engineering surprises.",
        ],
      },
    ],
  },
]
