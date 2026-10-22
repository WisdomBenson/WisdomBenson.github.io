export const profile = {
  name: "Wisdom Benson",
  mark: "WHB",
  descriptor: "I study quantum physics and write about philosophy.",
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
    detail: "I model finite semiconductor nanostructures from first principles. I study their possible uses in quantum sensing, computing, and storage.",
  },
  {
    period: "2022—2024",
    school: "North Carolina Central University",
    degree: "MSc in Physics",
    detail: "I made triple-cation tin-lead alloy perovskite thin films and measured their optical properties.",
  },
  {
    period: "2017—2021",
    school: "University of Nigeria, Nsukka",
    degree: "BSc in Physics, Honors",
    detail: "I used density functional theory to study methylammonium lead iodide perovskite.",
  },
] as const

export const experience = [
  {
    period: "2024—Present",
    role: "Graduate Research & Teaching Assistant",
    place: "Howard University",
    detail: "I use Quantum ESPRESSO and WEST/PDEP-GW on SDSC Expanse and Argonne CNM resources. I study electronic structure, phonons, surface passivation, and frontier energy levels in ZnO quantum dots.",
  },
  {
    period: "2022—2024",
    role: "Graduate Research & Teaching Assistant",
    place: "North Carolina Central University",
    detail: "I made perovskite thin films, measured their optical properties, and analyzed the data. I also taught laboratory classes and mentored undergraduate students.",
  },
] as const

export const conferences = [
  {
    year: "2026",
    venue: "MRS Spring Meeting & Exhibit",
    title: "Quantifying Surface-Driven Band-Edge Control in ZnO Quantum Dots Using the GW Approximation and Density Functional Theory",
    detail: "I presented this work at Symposium QT03 on April 29, 2026.",
    href: "https://www.mrs.org/docs/default-source/meetings-events/spring-meetings/2026/2026-mrs-spring-meeting-program.pdf",
  },
  {
    year: "2026",
    venue: "APS Global Physics Summit",
    title: "Spectroscopic Characterization and Modeling and Simulation of Zinc Oxide and Zinc Sulfide Quantum Dots",
    detail: "I am the first author. My principal investigator, Prabhakar Misra, presented this work on March 20, 2026.",
    href: "https://meetings-archive.aps.org/smt/2026/mar-y17/8/",
  },
  {
    year: "2025",
    venue: "APS Global Physics Summit",
    title: "Spin-Orbit Coupling and Piezoelectric Properties of Zinc Oxide Quantum Dots Using First-Principles Calculations",
    detail: "I am a coauthor. Prabhakar Misra presented this work on March 18, 2025.",
  },
  {
    year: "2024",
    venue: "PREM",
    title: "Investigating the Optical Properties of Multiple-Cation Tin-Lead Alloy Perovskite Thin Films",
    detail: "I presented this work in April 2024.",
  },
  {
    year: "2023",
    venue: "Triangle Student Research Competition",
    title: "Mixed-Cation Tin-Lead Alloy Perovskites for Photovoltaic Applications: Bandgap Tuning & Photoluminescence Mapping",
    detail: "I presented this poster at North Carolina Central University in November 2023.",
    href: "https://www.researchgate.net/publication/375279550_Wisdom_TSRC_2023_Poster",
  },
] as const
