import { readFileSync, readdirSync } from "node:fs"
import { join, relative } from "node:path"
import ts from "typescript"

// Project style checks, not an ASD-STE100 dictionary or compliance validator.
const root = process.cwd()
const errors = []
let checked = 0
const firstPerson = /\b(?:I|me|my|mine)\b/i
const thirdPersonBio = /\bWisdom Benson\s+(?:is|studies|writes|works|examines)\b|\bhis\s+(?:research|work|scholarship|philosophical|publications)\b/i
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

function check(file, text, personal = true) {
  text = plain(text)
  if (!text) return
  checked++
  const where = relative(root, file)
  if (thirdPersonBio.test(text)) errors.push(`${where}: third-person biography: ${text}`)
  if (personal && !firstPerson.test(text)) errors.push(`${where}: use first person: ${text}`)
  const sentences = [...segmenter.segment(text)].map(({ segment }) => segment.trim())
  if (sentences.length > 6) errors.push(`${where}: paragraph has ${sentences.length} sentences (maximum 6).`)
  for (const sentence of sentences) {
    const count = sentence.split(/\s+/).filter(Boolean).length
    if (count > 25) errors.push(`${where}: sentence has ${count} words (maximum 25): ${sentence}`)
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
    if (!description) errors.push(`${relative(root, file)}: add a first-person page description.`)
    else check(file, description[1])
    // Titles, headings, source citations, quotations, equations, and lists keep their own form.
    const body = source.slice(source.indexOf("\n# "))
    for (const block of body.split(/\r?\n\s*\r?\n/)) {
      if (/^(?:#|\$\$|\d+\.|>|<)/.test(block.trim())) continue
      if (/^I (?:first published|develop the argument)/.test(block.trim())) {
        check(file, block.replace(/\[[\s\S]*?\]\([^)]+\)/g, "the source record"))
      } else check(file, block)
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
  console.log(`Copy checks passed for ${checked} prose blocks: first-person voice, sentence and paragraph limits, and text hygiene.`)
  console.log("Manual review is still required for approved vocabulary, meaning, technical terms, and source integrity.")
}
