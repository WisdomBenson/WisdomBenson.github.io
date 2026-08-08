export type PublicationDomain = "quantum" | "modeling" | "philosophy"

export type Publication = {
  id: string
  title: string
  authors: string
  venue: string
  year: number
  kind: string
  domain: PublicationDomain
  abstract: string
  tags: string[]
  doi?: string
  href: string
  pdf?: string
  scholar: string
  philPeople?: string
  bibtex: string
}

const scholarSearch = (title: string) =>
  `https://scholar.google.com/scholar?q=${encodeURIComponent(`"${title}"`)}`

export const publications: Publication[] = [
  {
    id: "zno-dft-2026",
    title: "Electronic properties of zinc oxide quantum dot: Insights from first-principles calculations using density functional theory",
    authors: "W. Benson, C. Adams, B. Baral, and P. Misra",
    venue: "AIP Advances 16, 025236",
    year: 2026,
    kind: "Article · First author",
    domain: "modeling",
    abstract: "A first-principles study of finite ZnO quantum dots connecting size, surface structure, passivation, and electronic states to the resulting band-edge response.",
    tags: ["ZnO quantum dots", "DFT", "Electronic structure"],
    doi: "10.1063/5.0303211",
    href: "https://doi.org/10.1063/5.0303211",
    scholar: scholarSearch("Electronic properties of zinc oxide quantum dot"),
    bibtex: `@article{benson2026zno,
  author = {Benson, Wisdom and Adams, C. and Baral, B. and Misra, Prabhakar},
  title = {Electronic properties of zinc oxide quantum dot: Insights from first-principles calculations using density functional theory},
  journal = {AIP Advances},
  volume = {16},
  pages = {025236},
  year = {2026},
  doi = {10.1063/5.0303211}
}`,
  },
  {
    id: "perovskite-2026",
    title: "Enhanced stability and near-IR tunability in tin-lead perovskites via multi-cation engineering",
    authors: "W. H. Benson, K. E. Adesina, T. O. Fowodu, and G. M. Smart",
    venue: "Journal of Physics and Chemistry of Solids 211, 113511",
    year: 2026,
    kind: "Article · First author",
    domain: "quantum",
    abstract: "An experimental study of mixed-cation tin-lead perovskite films that relates compositional engineering to near-infrared optical response and material stability.",
    tags: ["Perovskites", "Near-IR", "Thin films"],
    doi: "10.1016/j.jpcs.2025.113511",
    href: "https://doi.org/10.1016/j.jpcs.2025.113511",
    scholar: scholarSearch("Enhanced stability and near-IR tunability in tin-lead perovskites"),
    bibtex: `@article{benson2026perovskites,
  author = {Benson, Wisdom H. and Adesina, K. E. and Fowodu, T. O. and Smart, G. M.},
  title = {Enhanced stability and near-IR tunability in tin-lead perovskites via multi-cation engineering},
  journal = {Journal of Physics and Chemistry of Solids},
  volume = {211},
  pages = {113511},
  year = {2026},
  doi = {10.1016/j.jpcs.2025.113511}
}`,
  },
  {
    id: "romantic-exclusivity-2025",
    title: "Romantic exclusivity as structural necessity: A Kantian-Scheler-Schopenhauer synthesis in contemporary discourse",
    authors: "W. H. Benson",
    venue: "Philosophies 10(5), 102",
    year: 2025,
    kind: "Article · Sole author",
    domain: "philosophy",
    abstract: "A philosophical account of romantic exclusivity developed through Kantian respect, Schelerian value, and Schopenhauerian metaphysics, with attention to contemporary discourse.",
    tags: ["Metaphysics", "Ethics", "Philosophy of love"],
    doi: "10.3390/philosophies10050102",
    href: "https://doi.org/10.3390/philosophies10050102",
    pdf: "https://www.mdpi.com/2409-9287/10/5/102/pdf",
    scholar: scholarSearch("Romantic exclusivity as structural necessity"),
    philPeople: "https://philpeople.org/profiles/wisdom-benson",
    bibtex: `@article{benson2025romantic,
  author = {Benson, Wisdom H.},
  title = {Romantic Exclusivity as Structural Necessity: A Kantian--Scheler--Schopenhauer Synthesis in Contemporary Discourse},
  journal = {Philosophies},
  volume = {10},
  number = {5},
  pages = {102},
  year = {2025},
  doi = {10.3390/philosophies10050102}
}`,
  },
  {
    id: "nanoelectronics-2026",
    title: "Advanced computational studies of quantum dots for optoelectronic, sensing, and computing applications",
    authors: "W. Benson, S. Bandopadhyay, C. Adams, B. Baral, and P. Misra",
    venue: "Nanoelectronics, CRC Press, pp. 169–197",
    year: 2026,
    kind: "Book chapter · First author",
    domain: "modeling",
    abstract: "A chapter surveying computational approaches to quantum dots and their implications for optoelectronics, sensing, and emerging computing platforms.",
    tags: ["Quantum dots", "Nanoelectronics", "Computational physics"],
    doi: "10.1201/9781003512899-8",
    href: "https://doi.org/10.1201/9781003512899-8",
    scholar: scholarSearch("Advanced computational studies of quantum dots"),
    bibtex: `@incollection{benson2026nanoelectronics,
  author = {Benson, Wisdom and Bandopadhyay, S. and Adams, C. and Baral, B. and Misra, Prabhakar},
  title = {Advanced computational studies of quantum dots for optoelectronic, sensing, and computing applications},
  booktitle = {Nanoelectronics},
  publisher = {CRC Press},
  pages = {169--197},
  year = {2026},
  doi = {10.1201/9781003512899-8}
}`,
  },
  {
    id: "masters-thesis-2024",
    title: "Synthesis and optical characterization of lead-tin alloy perovskites for photovoltaic applications",
    authors: "W. Benson",
    venue: "North Carolina Central University · ProQuest",
    year: 2024,
    kind: "Master’s thesis",
    domain: "quantum",
    abstract: "Graduate research on the synthesis and optical characterization of lead-tin alloy perovskites for photovoltaic applications.",
    tags: ["Perovskites", "Photovoltaics", "Spectroscopy"],
    href: "https://www.proquest.com/docview/3176103303",
    scholar: scholarSearch("Synthesis and optical characterization of lead-tin alloy perovskites"),
    bibtex: `@mastersthesis{benson2024perovskites,
  author = {Benson, Wisdom},
  title = {Synthesis and Optical Characterization of Lead-Tin Alloy Perovskites for Photovoltaic Applications},
  school = {North Carolina Central University},
  year = {2024},
  note = {ProQuest publication 31237299}
}`,
  },
  {
    id: "mhd-2023",
    title: "Analysis of a steady MHD mixed convection fluid flow in a microchannel within permeable walls with suction and injection parameters",
    authors: "W. Benson et al.",
    venue: "Open Access Library Journal 10(07), 1–9",
    year: 2023,
    kind: "Article · Coauthor",
    domain: "modeling",
    abstract: "A mathematical treatment of steady magnetohydrodynamic mixed-convection flow in a permeable microchannel under suction and injection boundary conditions.",
    tags: ["MHD", "Fluid dynamics", "Mathematical modeling"],
    doi: "10.4236/oalib.1110363",
    href: "https://www.oalib.com/articles/6798430",
    scholar: scholarSearch("Analysis of a steady MHD mixed convection fluid flow in a microchannel"),
    bibtex: `@article{benson2023mhd,
  author = {Benson, Wisdom and others},
  title = {Analysis of a Steady MHD Mixed Convection Fluid Flow in a Microchannel within Permeable Walls with Suction and Injection Parameters},
  journal = {Open Access Library Journal},
  volume = {10},
  number = {7},
  pages = {1--9},
  year = {2023},
  doi = {10.4236/oalib.1110363}
}`,
  },
]
