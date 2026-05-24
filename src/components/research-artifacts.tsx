import { useEffect, useMemo, useRef, type CSSProperties } from "react"
import type * as Three from "three"

export type ResearchArtifactKind = "nanocrystal" | "raman" | "perovskite"

type ResearchArtifactProps = {
  kind: ResearchArtifactKind
  compact?: boolean
}

const artifactCopy = {
  nanocrystal: {
    label: "finite ZnO nanocrystal",
    metric: "DFT | DFPT | PDEP-GW",
    caption: "Passivated Zn/O lattice, orbital shell, and surface sites",
  },
  raman: {
    label: "Raman spectra map",
    metric: "532 nm | power sweep",
    caption: "Temperature bands, excitation power, and phonon shifts",
  },
  perovskite: {
    label: "tin-lead perovskite lattice",
    metric: "Sn/Pb | FA/Cs | I/Br",
    caption: "Mixed B-site engineering and halide octahedra",
  },
} satisfies Record<ResearchArtifactKind, { label: string; metric: string; caption: string }>

export function ResearchArtifact({ kind, compact = false }: ResearchArtifactProps) {
  const copy = artifactCopy[kind]

  return (
    <div className={compact ? "artifact-frame artifact-frame-compact" : "artifact-frame"}>
      <div className="artifact-topline">
        <span>{copy.label}</span>
        <span>{copy.metric}</span>
      </div>
      {kind === "raman" ? <RamanArtifact /> : <ThreeResearchArtifact kind={kind} />}
      <div className="artifact-caption">
        <span>{copy.caption}</span>
      </div>
    </div>
  )
}

function ThreeResearchArtifact({ kind }: { kind: Exclude<ResearchArtifactKind, "raman"> }) {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let cleanup: (() => void) | undefined
    let disposed = false
    let animationFrame = 0

    import("three").then((THREE) => {
      if (disposed || !mountRef.current) return

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
      camera.position.set(0, 0.7, kind === "nanocrystal" ? 8.6 : 9.4)

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
      renderer.setClearColor(0xffffff, 0)
      mount.appendChild(renderer.domElement)

      const root = new THREE.Group()
      scene.add(root)

      scene.add(new THREE.HemisphereLight(0xf9f3e5, 0xd4c8aa, 2.7))
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.6)
      keyLight.position.set(2.8, 4.2, 4.8)
      scene.add(keyLight)
      const rimLight = new THREE.DirectionalLight(0xd9f2df, 1.4)
      rimLight.position.set(-3.6, 1.6, -2.8)
      scene.add(rimLight)

      if (kind === "nanocrystal") {
        buildNanocrystal(THREE, root)
      } else {
        buildPerovskite(THREE, root)
      }

      const resize = () => {
        const rect = mount.getBoundingClientRect()
        const width = Math.max(1, Math.floor(rect.width))
        const height = Math.max(1, Math.floor(rect.height))
        renderer.setSize(width, height, false)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
      }

      let frame = 0
      const animate = () => {
        frame += 0.01
        root.rotation.y += reducedMotion ? 0 : kind === "nanocrystal" ? 0.0036 : 0.0028
        root.rotation.x = Math.sin(frame) * (kind === "nanocrystal" ? 0.08 : 0.045)

        root.children.forEach((child, index) => {
          if (child.userData.pulse) {
            child.scale.setScalar(1 + Math.sin(frame * 2 + index) * 0.025)
          }
        })

        renderer.render(scene, camera)
        animationFrame = window.requestAnimationFrame(animate)
      }

      const observer = new ResizeObserver(resize)
      observer.observe(mount)
      resize()
      animate()

      cleanup = () => {
        window.cancelAnimationFrame(animationFrame)
        observer.disconnect()
        if (renderer.domElement.parentElement === mount) {
          mount.removeChild(renderer.domElement)
        }
        renderer.dispose()
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments || object instanceof THREE.Line) {
            object.geometry.dispose()
            disposeMaterial(object.material)
          }
        })
      }
    })

    return () => {
      disposed = true
      if (cleanup) cleanup()
    }
  }, [kind])

  return <div ref={mountRef} className="artifact-canvas" aria-label={artifactCopy[kind].caption} />
}

function buildNanocrystal(THREE: typeof Three, root: Three.Group) {
  const zincMaterial = new THREE.MeshStandardMaterial({ color: 0x2d6a47, roughness: 0.52, metalness: 0.12 })
  const oxygenMaterial = new THREE.MeshStandardMaterial({ color: 0xd8b35d, roughness: 0.62, metalness: 0.05 })
  const ligandMaterial = new THREE.MeshStandardMaterial({ color: 0xeee8d7, roughness: 0.72, metalness: 0.02 })
  const zincGeometry = new THREE.SphereGeometry(0.105, 24, 16)
  const oxygenGeometry = new THREE.SphereGeometry(0.082, 24, 16)
  const ligandGeometry = new THREE.SphereGeometry(0.066, 18, 12)
  const nodes: Three.Vector3[] = []

  for (let x = -3; x <= 3; x += 1) {
    for (let y = -3; y <= 3; y += 1) {
      for (let z = -3; z <= 3; z += 1) {
        const jitter = ((x * 19 + y * 11 + z * 7) % 5) * 0.018
        const position = new THREE.Vector3(x * 0.47 + jitter, y * 0.42 - jitter, z * 0.4)
        if (position.length() > 1.72 || (x + y + z) % 2 === 0) continue
        nodes.push(position)
        const atom = new THREE.Mesh((x + y + z) % 3 === 0 ? zincGeometry : oxygenGeometry, (x + y + z) % 3 === 0 ? zincMaterial : oxygenMaterial)
        atom.position.copy(position)
        atom.userData.pulse = position.length() > 1.28
        root.add(atom)
      }
    }
  }

  const bondPoints: number[] = []
  nodes.forEach((a, index) => {
    for (let next = index + 1; next < nodes.length; next += 1) {
      const b = nodes[next]
      const distance = a.distanceTo(b)
      if (distance > 0.46 && distance < 0.68) {
        bondPoints.push(a.x, a.y, a.z, b.x, b.y, b.z)
      }
    }
  })

  const bondGeometry = new THREE.BufferGeometry()
  bondGeometry.setAttribute("position", new THREE.Float32BufferAttribute(bondPoints, 3))
  root.add(new THREE.LineSegments(bondGeometry, new THREE.LineBasicMaterial({ color: 0x7c8b76, transparent: true, opacity: 0.24 })))

  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.95, 2),
    new THREE.MeshBasicMaterial({ color: 0x86ad94, transparent: true, opacity: 0.11, wireframe: true }),
  )
  root.add(shell)

  const orbitalA = new THREE.Mesh(
    new THREE.TorusGeometry(2.12, 0.012, 8, 128),
    new THREE.MeshBasicMaterial({ color: 0xd8b35d, transparent: true, opacity: 0.5 }),
  )
  orbitalA.rotation.x = Math.PI / 2.9
  root.add(orbitalA)

  const orbitalB = orbitalA.clone()
  orbitalB.rotation.y = Math.PI / 2.7
  orbitalB.rotation.z = Math.PI / 5
  root.add(orbitalB)

  nodes
    .filter((node) => node.length() > 1.38)
    .slice(0, 14)
    .forEach((node, index) => {
      const direction = node.clone().normalize()
      const start = node.clone().add(direction.clone().multiplyScalar(0.08))
      const end = node.clone().add(direction.clone().multiplyScalar(0.46 + (index % 3) * 0.045))
      root.add(cylinderBetween(THREE, start, end, 0.012, ligandMaterial))
      const ligand = new THREE.Mesh(ligandGeometry, ligandMaterial)
      ligand.position.copy(end)
      ligand.userData.pulse = true
      root.add(ligand)
    })
}

function buildPerovskite(THREE: typeof Three, root: Three.Group) {
  const pbMaterial = new THREE.MeshStandardMaterial({ color: 0x58645f, roughness: 0.38, metalness: 0.2 })
  const snMaterial = new THREE.MeshStandardMaterial({ color: 0x1f7650, roughness: 0.48, metalness: 0.12 })
  const halideMaterial = new THREE.MeshStandardMaterial({ color: 0xd7aa51, roughness: 0.58, metalness: 0.04 })
  const cationMaterial = new THREE.MeshStandardMaterial({ color: 0xf1e8d1, roughness: 0.78, metalness: 0 })
  const bondMaterial = new THREE.MeshStandardMaterial({ color: 0xa9b199, roughness: 0.7, transparent: true, opacity: 0.52 })
  const centerGeometry = new THREE.SphereGeometry(0.13, 28, 18)
  const halideGeometry = new THREE.SphereGeometry(0.07, 20, 14)
  const cationGeometry = new THREE.SphereGeometry(0.055, 18, 12)

  const offsets = [-0.92, 0.92]
  offsets.forEach((x, xi) => {
    offsets.forEach((y, yi) => {
      offsets.forEach((z, zi) => {
        const origin = new THREE.Vector3(x, y, z)
        const centerMaterial = (xi + yi + zi) % 2 === 0 ? snMaterial : pbMaterial
        const center = new THREE.Mesh(centerGeometry, centerMaterial)
        center.position.copy(origin)
        center.userData.pulse = true
        root.add(center)

        const directions = [
          new THREE.Vector3(0.34, 0, 0),
          new THREE.Vector3(-0.34, 0, 0),
          new THREE.Vector3(0, 0.34, 0),
          new THREE.Vector3(0, -0.34, 0),
          new THREE.Vector3(0, 0, 0.34),
          new THREE.Vector3(0, 0, -0.34),
        ]

        directions.forEach((direction) => {
          const halidePosition = origin.clone().add(direction)
          const halide = new THREE.Mesh(halideGeometry, halideMaterial)
          halide.position.copy(halidePosition)
          root.add(halide)
          root.add(cylinderBetween(THREE, origin, halidePosition, 0.008, bondMaterial))
        })
      })
    })
  })

  for (let x = -1; x <= 1; x += 1) {
    for (let y = -1; y <= 1; y += 1) {
      for (let z = -1; z <= 1; z += 1) {
        if (Math.abs(x) + Math.abs(y) + Math.abs(z) < 2) continue
        const cation = new THREE.Mesh(cationGeometry, cationMaterial)
        cation.position.set(x * 1.36, y * 1.36, z * 1.36)
        root.add(cation)
      }
    }
  }

  const cell = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(3.05, 3.05, 3.05)),
    new THREE.LineBasicMaterial({ color: 0x7a8b70, transparent: true, opacity: 0.22 }),
  )
  root.add(cell)

  const band = new THREE.Mesh(
    new THREE.TorusGeometry(2.3, 0.01, 8, 140),
    new THREE.MeshBasicMaterial({ color: 0xd7aa51, transparent: true, opacity: 0.42 }),
  )
  band.rotation.x = Math.PI / 2.2
  band.rotation.y = Math.PI / 4
  root.add(band)
}

function RamanArtifact() {
  const spectralPaths = useMemo(() => buildSpectralPaths(), [])

  return (
    <div className="artifact-raman" aria-label={artifactCopy.raman.caption}>
      <div className="raman-heatmap" aria-hidden="true">
        {Array.from({ length: 35 }).map((_, index) => (
          <span key={index} style={{ "--cell-index": index } as CSSProperties} />
        ))}
      </div>
      <svg viewBox="0 0 640 360" role="img" aria-label="Stacked Raman spectra across temperature and excitation power">
        <defs>
          <linearGradient id="spectralGradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.32" />
            <stop offset="52%" stopColor="var(--secondary)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.82" />
          </linearGradient>
        </defs>
        <g className="raman-grid" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, index) => (
            <line key={`x-${index}`} x1={70 + index * 70} x2={70 + index * 70} y1="54" y2="295" />
          ))}
          {Array.from({ length: 5 }).map((_, index) => (
            <line key={`y-${index}`} x1="70" x2="588" y1={72 + index * 54} y2={72 + index * 54} />
          ))}
        </g>
        {spectralPaths.map((path, index) => (
          <path key={path} className="raman-curve" d={path} style={{ "--curve-index": index } as CSSProperties} />
        ))}
        <path className="raman-peak-band" d="M355 50 L386 50 L412 296 L322 296 Z" />
        <line className="raman-probe" x1="386" x2="386" y1="50" y2="296" />
        <text x="70" y="330">temperature series</text>
        <text x="421" y="72">E2(high)</text>
        <text x="475" y="330">excitation power</text>
      </svg>
    </div>
  )
}

function buildSpectralPaths() {
  return Array.from({ length: 9 }).map((_, row) => {
    const yBase = 276 - row * 24
    const shift = row * 3.6
    const points = Array.from({ length: 96 }).map((__, index) => {
      const x = 70 + index * 5.45
      const peakA = 38 * Math.exp(-((x - 210 - shift) ** 2) / 2300)
      const peakB = 62 * Math.exp(-((x - 382 - shift * 0.5) ** 2) / 720)
      const peakC = 28 * Math.exp(-((x - 492 + shift * 0.18) ** 2) / 1350)
      const ripple = Math.sin(index * 0.42 + row * 0.7) * 2.6
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${(yBase - peakA - peakB - peakC + ripple).toFixed(1)}`
    })
    return points.join(" ")
  })
}

function cylinderBetween(THREE: typeof Three, start: Three.Vector3, end: Three.Vector3, radius: number, material: Three.Material) {
  const midpoint = start.clone().add(end).multiplyScalar(0.5)
  const direction = end.clone().sub(start)
  const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 8), material)
  cylinder.position.copy(midpoint)
  cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize())
  return cylinder
}

function disposeMaterial(material: Three.Material | Three.Material[]) {
  if (Array.isArray(material)) {
    material.forEach((entry) => entry.dispose())
    return
  }

  material.dispose()
}
