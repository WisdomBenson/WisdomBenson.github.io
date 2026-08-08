export const profile = {
  name: "Wisdom Benson",
  mark: "WHB",
  descriptor: "Quantum Physics Researcher & Philosophical Writer",
  affiliation: "Howard University",
  email: "wisdom.benson@bison.howard.edu",
  phone: "+1 984-312-9015",
  location: "Silver Spring, Maryland",
  portrait: "/assets/wisdom-benson-portrait.jpeg",
  resume: "/wisdom-benson-resume.pdf",
  links: {
    github: "https://github.com/WisdomBenson",
    linkedin: "https://www.linkedin.com/in/wisdom-benson-228461247",
    researchGate: "https://www.researchgate.net/profile/Wisdom-Benson",
    philPeople: "https://philpeople.org/profiles/wisdom-benson",
    googleScholar: "https://scholar.google.com/scholar?q=%22Wisdom+Benson%22",
    philPapers: "https://philpapers.org/rec/BENREA-14",
    audiomack: "https://audiomack.com/search?q=Wisdom%20Benson",
  },
} as const

export const affiliations = [
  { label: "Howard University", note: "Physics PhD researcher", active: true },
  { label: "APS Physics", note: "Student Ambassador", active: true },
  { label: "NCCU", note: "MSc Physics alumnus", active: false },
  { label: "PhilPeople", note: "Philosophy profile", active: true },
] as const

export const education = [
  {
    period: "2024—2029",
    school: "Howard University",
    degree: "PhD in Physics",
    detail: "First-principles modeling of finite semiconductor nanostructures for quantum sensing, computing, and storage.",
  },
  {
    period: "2022—2024",
    school: "North Carolina Central University",
    degree: "MSc in Physics",
    detail: "Synthesis and optical characterization of triple-cation tin-lead alloy perovskite thin films.",
  },
  {
    period: "2017—2021",
    school: "University of Nigeria, Nsukka",
    degree: "BSc in Physics, Honors",
    detail: "Density-functional-theory research on methylammonium lead iodide perovskite.",
  },
] as const

export const experience = [
  {
    period: "2024—Present",
    role: "Graduate Research & Teaching Assistant",
    place: "Howard University",
    detail: "Quantum ESPRESSO and WEST/PDEP-GW workflows on SDSC Expanse and Argonne CNM resources; electronic structure, phonons, passivation, and frontier levels in ZnO quantum dots.",
  },
  {
    period: "2022—2024",
    role: "Graduate Research & Teaching Assistant",
    place: "North Carolina Central University",
    detail: "Perovskite thin-film synthesis, optical characterization, statistical analysis, practical laboratory teaching, and undergraduate mentoring.",
  },
] as const

export const conferences = [
  {
    year: "2026",
    venue: "MRS Spring Meeting & Exhibit",
    title: "Quantifying Surface-Driven Band-Edge Control in ZnO Quantum Dots Using the GW Approximation and Density Functional Theory",
    detail: "Symposium QT03 · Presented April 29, 2026",
    href: "https://www.mrs.org/docs/default-source/meetings-events/spring-meetings/2026/2026-mrs-spring-meeting-program.pdf",
  },
  {
    year: "2026",
    venue: "APS Global Physics Summit",
    title: "Spectroscopic Characterization and Modeling and Simulation of Zinc Oxide and Zinc Sulfide Quantum Dots",
    detail: "First author · Presented by PI Prabhakar Misra · March 20, 2026",
    href: "https://meetings-archive.aps.org/smt/2026/mar-y17/8/",
  },
  {
    year: "2025",
    venue: "APS Global Physics Summit",
    title: "Spin-Orbit Coupling and Piezoelectric Properties of Zinc Oxide Quantum Dots Using First-Principles Calculations",
    detail: "Coauthor · Presented by Prabhakar Misra · March 18, 2025",
  },
  {
    year: "2024",
    venue: "PREM",
    title: "Investigating the Optical Properties of Multiple-Cation Tin-Lead Alloy Perovskite Thin Films",
    detail: "Presented April 2024",
  },
  {
    year: "2023",
    venue: "Triangle Student Research Competition",
    title: "Mixed-Cation Tin-Lead Alloy Perovskites for Photovoltaic Applications: Bandgap Tuning & Photoluminescence Mapping",
    detail: "Poster presentation · North Carolina Central University · November 2023",
    href: "https://www.researchgate.net/publication/375279550_Wisdom_TSRC_2023_Poster",
  },
] as const
