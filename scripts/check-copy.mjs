import { readFileSync, readdirSync } from "node:fs"
import { join, relative } from "node:path"
import ts from "typescript"

// Text integrity checks. Editorial voice and rhythm require human judgment.
const root = process.cwd()
const errors = []
let checked = 0
let longSentences = 0
let longParagraphs = 0
const segmenter = new Intl.Segmenter("en-US", { granularity: "sentence" })

function plain(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "and")
    .replace(/[*_]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function check(file, text) {
  text = plain(text)
  if (!text) return
  checked++
  const where = relative(root, file)
  const sentences = [...segmenter.segment(text)].map(({ segment }) => segment.trim())
  if (sentences.length > 6) longParagraphs++
  for (const sentence of sentences) {
    const count = sentence.split(/\s+/).filter(Boolean).length
    if (count > 25) longSentences++
  }
  if (/[\u200B-\u200D\uFEFF]/u.test(text)) errors.push(`${where}: unexpected invisible character.`)
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === "ui") return [] // Unmodified upstream primitives.
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : /\.(tsx?|mdx)$/.test(path) ? [path] : []
  })
}

for (const file of [...walk(join(root, "src/app")), ...walk(join(root, "src/components")), ...walk(join(root, "src/content"))]) {
  const source = readFileSync(file, "utf8")
  if (file.endsWith(".mdx")) {
    const description = source.match(/description:\s*"([^"]+)"/)
    if (!description?.[1].trim()) errors.push(`${relative(root, file)}: add a page description.`)
    else check(file, description[1])
    // Titles, headings, quotations, equations, and lists keep their own form.
    const body = source.slice(source.indexOf("\n# "))
    for (const block of body.split(/\r?\n\s*\r?\n/)) {
      if (/^(?:#|\$\$|\d+\.|>|<)/.test(block.trim())) continue
      check(file, block)
    }
    continue
  }
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  function visit(node) {
    if (ts.isPropertyAssignment(node) && /^(?:description|descriptor|caption|detail)$/.test(node.name.getText(ast))) {
      if (ts.isStringLiteral(node.initializer)) check(file, node.initializer.text)
    }
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText(ast) === "p") {
      const text = node.children.map((child) => ts.isJsxText(child) ? child.text : "").join(" ")
      // Short interface labels and bibliographic fields are not narrative paragraphs.
      if (plain(text).split(/\s+/).length > 10) check(file, text)
    }
    ts.forEachChild(node, visit)
  }
  visit(ast)
}

if (errors.length) {
  console.error(errors.join("\n"))
  process.exitCode = 1
} else {
  console.log(`Text integrity checks passed for ${checked} prose blocks.`)
  console.log(`Editorial notes: ${longSentences} sentences exceed 25 words; ${longParagraphs} paragraphs exceed six sentences. These are advisory, not publication blockers.`)
  console.log("Review voice, meaning, rhythm, and source fidelity in context. No pronoun quota or formal STE-compliance claim applies.")
}
