import katex from "katex"

export function MathExpression({ expression, display = false }: { expression: string; display?: boolean }) {
  return (
    <span
      aria-label={expression}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(expression, {
          displayMode: display,
          throwOnError: false,
          strict: "warn",
        }),
      }}
    />
  )
}
