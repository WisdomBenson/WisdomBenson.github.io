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
