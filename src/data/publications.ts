export type PublicationCategory =
  | "journal-articles"
  | "conference-posters"
  | "book-chapters-thesis"

export type PublicationType =
  | "Peer-Reviewed Journal"
  | "Conference Poster"
  | "Book Chapter"
  | "Master's Thesis"

export type Publication = {
  id: string
  category: PublicationCategory
  type: PublicationType
  title: string
  authors: string[]
  venue: string
  year: number
  doi?: string
  recordUrl: string
  keywords: string[]
  bibtex: string
}

const doiUrl = (doi: string) => `https://doi.org/${doi}`

export const publications = [
  {
    id: "benson-2026-zno-dft",
    category: "journal-articles",
    type: "Peer-Reviewed Journal",
    title:
      "Electronic properties of zinc oxide quantum dot: Insights from first-principles calculations using density functional theory",
    authors: ["W. Benson", "C. Adams", "B. Baral", "P. Misra"],
    venue: "AIP Advances 16(2), 025236",
    year: 2026,
    doi: "10.1063/5.0303211",
    recordUrl: doiUrl("10.1063/5.0303211"),
    keywords: ["ZnO quantum dots", "density functional theory", "spin-orbit coupling", "DFPT"],
    bibtex: `@article{benson2026zno,
  author = {Benson, Wisdom and Adams, Chase and Baral, Basanta and Misra, Prabhakar},
  title = {Electronic properties of zinc oxide quantum dot: Insights from first-principles calculations using density functional theory},
  journal = {AIP Advances},
  volume = {16},
  number = {2},
  pages = {025236},
  year = {2026},
  doi = {10.1063/5.0303211}
}`,
  },
  {
    id: "benson-2026-tin-lead-perovskites",
    category: "journal-articles",
    type: "Peer-Reviewed Journal",
    title:
      "Enhanced stability and near-IR tunability in tin–lead perovskites via multi-cation engineering",
    authors: ["W. H. Benson", "K. E. Adesina", "T. O. Fowodu", "G. M. Smart"],
    venue: "Journal of Physics and Chemistry of Solids 211, 113511",
    year: 2026,
    doi: "10.1016/j.jpcs.2025.113511",
    recordUrl: doiUrl("10.1016/j.jpcs.2025.113511"),
    keywords: ["tin–lead perovskites", "photoluminescence", "near infrared", "cation engineering"],
    bibtex: `@article{benson2026perovskites,
  author = {Benson, Wisdom H. and Adesina, Kolawole E. and Fowodu, Temitope O. and Smart, Godwin M.},
  title = {Enhanced stability and near-{IR} tunability in tin--lead perovskites via multi-cation engineering},
  journal = {Journal of Physics and Chemistry of Solids},
  volume = {211},
  pages = {113511},
  year = {2026},
  doi = {10.1016/j.jpcs.2025.113511}
}`,
  },
  {
    id: "benson-2025-romantic-exclusivity",
    category: "journal-articles",
    type: "Peer-Reviewed Journal",
    title:
      "Romantic Exclusivity as Structural Necessity: A Kantian–Scheler–Schopenhauer Synthesis in Contemporary Discourse",
    authors: ["W. H. Benson"],
    venue: "Philosophies 10(5), 102",
    year: 2025,
    doi: "10.3390/philosophies10050102",
    recordUrl: doiUrl("10.3390/philosophies10050102"),
    keywords: ["Kant", "Scheler", "Schopenhauer", "metaphysics", "philosophy of love"],
    bibtex: `@article{benson2025romantic,
  author = {Benson, Wisdom Hackqmah},
  title = {Romantic Exclusivity as Structural Necessity: A {Kantian--Scheler--Schopenhauer} Synthesis in Contemporary Discourse},
  journal = {Philosophies},
  volume = {10},
  number = {5},
  pages = {102},
  year = {2025},
  doi = {10.3390/philosophies10050102}
}`,
  },
  {
    id: "weinor-2023-mhd",
    category: "journal-articles",
    type: "Peer-Reviewed Journal",
    title:
      "Analysis of a Steady MHD Mixed Convection Fluid Flow in a Microchannel within Permeable Walls with Suction and Injection Parameters",
    authors: ["G. O. Weinor", "K. E. Adesina", "G. M. Smart", "E. K. A. Wie-Addo", "W. Benson"],
    venue: "Open Access Library Journal 10(7), 1–9",
    year: 2023,
    doi: "10.4236/oalib.1110363",
    recordUrl: doiUrl("10.4236/oalib.1110363"),
    keywords: ["magnetohydrodynamics", "mixed convection", "microchannel", "permeable walls"],
    bibtex: `@article{weinor2023mhd,
  author = {Weinor, Glory Oyintombra and Adesina, Kolawole Emmanuel and Smart, Godwin Micah and Wie-Addo, Emmanuel Kofi Asuako and Benson, Wisdom},
  title = {Analysis of a Steady {MHD} Mixed Convection Fluid Flow in a Microchannel within Permeable Walls with Suction and Injection Parameters},
  journal = {Open Access Library Journal},
  volume = {10},
  number = {7},
  pages = {1--9},
  year = {2023},
  doi = {10.4236/oalib.1110363}
}`,
  },
  {
    id: "benson-2023-tsrc-poster",
    category: "conference-posters",
    type: "Conference Poster",
    title:
      "Mixed-Cation Tin-Lead Alloy Perovskites for Photovoltaic Applications: Bandgap Tuning & Photoluminescence Mapping",
    authors: ["W. Benson"],
    venue: "Triangle Student Research Competition (TSRC), North Carolina Central University",
    year: 2023,
    doi: "10.13140/RG.2.2.12618.54720",
    recordUrl: doiUrl("10.13140/RG.2.2.12618.54720"),
    keywords: ["tin–lead perovskites", "photovoltaics", "photoluminescence mapping", "bandgap tuning"],
    bibtex: `@conference{benson2023tsrc,
  author = {Benson, Wisdom},
  title = {Mixed-Cation Tin-Lead Alloy Perovskites for Photovoltaic Applications: Bandgap Tuning \& Photoluminescence Mapping},
  booktitle = {Triangle Student Research Competition},
  address = {North Carolina Central University, Durham, North Carolina},
  month = {November},
  year = {2023},
  doi = {10.13140/RG.2.2.12618.54720},
  note = {Conference poster}
}`,
  },
  {
    id: "benson-2025-nanoelectronics",
    category: "book-chapters-thesis",
    type: "Book Chapter",
    title:
      "Advanced computational studies of quantum dots for optoelectronic, sensing, and computing applications",
    authors: ["W. Benson", "S. Bandopadhyay", "C. Adams", "B. Baral", "P. Misra"],
    venue: "Nanoelectronics, CRC Press, pp. 169–197",
    year: 2025,
    doi: "10.1201/9781003512899-8",
    recordUrl: doiUrl("10.1201/9781003512899-8"),
    keywords: ["quantum dots", "nanoelectronics", "optoelectronics", "sensing", "computing"],
    bibtex: `@incollection{benson2025nanoelectronics,
  author = {Benson, Wisdom and Bandopadhyay, Saumika and Adams, Chase and Baral, Basanta and Misra, Prabhakar},
  title = {Advanced computational studies of quantum dots for optoelectronic, sensing, and computing applications},
  booktitle = {Nanoelectronics},
  publisher = {CRC Press},
  pages = {169--197},
  year = {2025},
  doi = {10.1201/9781003512899-8}
}`,
  },
  {
    id: "benson-2024-masters-thesis",
    category: "book-chapters-thesis",
    type: "Master's Thesis",
    title:
      "Synthesis and Optical Characterization of Lead-Tin Alloy Perovskites for Photovoltaic Applications",
    authors: ["W. Benson"],
    venue: "North Carolina Central University",
    year: 2024,
    recordUrl: "https://www.proquest.com/docview/3176103303",
    keywords: ["lead–tin perovskites", "photovoltaics", "optical characterization", "master's thesis"],
    bibtex: `@mastersthesis{benson2024perovskites,
  author = {Benson, Wisdom},
  title = {Synthesis and Optical Characterization of Lead-Tin Alloy Perovskites for Photovoltaic Applications},
  school = {North Carolina Central University},
  year = {2024},
  note = {ProQuest publication 31237299}
}`,
  },
] as const satisfies readonly Publication[]

export const publicationCounts = {
  all: publications.length,
  "journal-articles": publications.filter((item) => item.category === "journal-articles").length,
  "conference-posters": publications.filter((item) => item.category === "conference-posters").length,
  "book-chapters-thesis": publications.filter((item) => item.category === "book-chapters-thesis").length,
} as const
