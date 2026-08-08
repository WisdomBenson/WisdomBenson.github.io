import createMDX from "@next/mdx"

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-math"],
    rehypePlugins: ["rehype-katex"],
  },
})

export default withMDX({
  output: "export",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
})
