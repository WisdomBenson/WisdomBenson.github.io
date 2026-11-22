export type Point = { x: number; y: number }
export type LandmarkFrame = {
  landmarks?: readonly Point[]
  matrix?: readonly number[]
  aspect: number
}
type Features = [number, number, number, number, number, number, number]
export type TrainingSample = { input: Features; target: Point }
export type ValidationPoint = { target: Point; prediction: Point; error: number }

const EYES = [
  { iris: 468, corners: [33, 133], upper: [159, 158], lower: [145, 153] },
  { iris: 473, corners: [362, 263], upper: [386, 385], lower: [374, 380] },
]

function eyeOffset(landmarks: readonly Point[], aspect: number, eye: typeof EYES[number]) {
  const [a, b] = eye.corners.map(index => landmarks[index])
  const iris = landmarks[eye.iris]
  if (!a || !b || !iris) return null
  const dx = (b.x - a.x) * aspect
  const dy = b.y - a.y
  const width = Math.hypot(dx, dy)
  if (width < 0.0001) return null

  const horizontal = (point: Point) => ((point.x - a.x) * aspect * dx + (point.y - a.y) * dy) / width
  const vertical = (point: Point) => (-(point.x - a.x) * aspect * dy + (point.y - a.y) * dx) / width
  const lid = (indices: number[]) => indices.reduce((sum, i) => sum + vertical(landmarks[i]), 0) / indices.length
  const top = lid(eye.upper)
  const aperture = lid(eye.lower) - top
  if (aperture < width * 0.05) return null
  return { x: horizontal(iris) / width - 0.5, y: (vertical(iris) - top) / aperture - 0.5 }
}

function headPose(matrix: readonly number[] | undefined) {
  if (matrix?.length !== 16 || !matrix.every(Number.isFinite)) return null
  // The affine matrix's last row is [0, 0, 0, 1]. Accept either storage order.
  const rowMajorError = Math.hypot(matrix[12], matrix[13], matrix[14])
  const columnMajorError = Math.hypot(matrix[3], matrix[7], matrix[11])
  const columnMajor = columnMajorError <= rowMajorError
  const x = columnMajor ? matrix[8] : matrix[2]
  const y = columnMajor ? matrix[9] : matrix[6]
  const z = matrix[10]
  if (Math.hypot(x, y, z) < 1e-6) return null
  return { yaw: Math.atan2(x, z), pitch: Math.atan2(-y, Math.hypot(x, z)) }
}

export function extractFeatures(frame: LandmarkFrame): Features | null {
  const { landmarks, matrix, aspect } = frame
  if (!landmarks || landmarks.length < 478 || !Number.isFinite(aspect) || aspect <= 0) return null
  const left = eyeOffset(landmarks, aspect, EYES[0])
  const right = eyeOffset(landmarks, aspect, EYES[1])
  const pose = headPose(matrix)
  if (!left || !right || !pose) return null

  const irisX = (left.x + right.x) / 2
  const irisY = (left.y + right.y) / 2
  const { yaw, pitch } = pose
  const input: Features = [1, irisX, irisY, yaw, pitch, irisX * yaw, irisY * pitch]
  return input.every(Number.isFinite) ? input : null
}

export function fitRidge(samples: readonly TrainingSample[]) {
  const columns = 7
  const means = Array.from({ length: columns }, (_, i) =>
    i ? samples.reduce((sum, sample) => sum + sample.input[i], 0) / samples.length : 0)
  const scales = means.map((mean, i) => i
    ? Math.max(0.002, Math.sqrt(samples.reduce((sum, sample) => sum + (sample.input[i] - mean) ** 2, 0) / samples.length))
    : 1)
  const normalize = (input: Features) => input.map((value, i) => (value - means[i]) / scales[i])

  // Accumulate XᵀX and both coordinate columns of XᵀY in one small system.
  const system = means.map(() => Array<number>(columns + 2).fill(0))
  for (const { input, target } of samples) {
    const row = normalize(input)
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < columns; j++) system[i][j] += row[i] * row[j]
      system[i][columns] += row[i] * target.x
      system[i][columns + 1] += row[i] * target.y
    }
  }
  for (let i = 1; i < columns; i++) system[i][i] += 0.8

  // Gauss–Jordan elimination with partial pivoting. Leave the intercept unpenalized.
  for (let i = 0; i < columns; i++) {
    let pivot = i
    for (let j = i + 1; j < columns; j++) {
      if (Math.abs(system[j][i]) > Math.abs(system[pivot][i])) pivot = j
    }
    ;[system[i], system[pivot]] = [system[pivot], system[i]]
    const divisor = system[i][i]
    for (let j = i; j < columns + 2; j++) system[i][j] /= divisor
    for (let row = 0; row < columns; row++) {
      if (row === i) continue
      const factor = system[row][i]
      for (let j = i; j < columns + 2; j++) system[row][j] -= factor * system[i][j]
    }
  }

  return (input: Features): Point => normalize(input).reduce((point, value, i) => ({
    x: point.x + value * system[i][columns],
    y: point.y + value * system[i][columns + 1],
  }), { x: 0, y: 0 })
}

export function median(values: readonly number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  const i = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[i - 1] + sorted[i]) / 2 : sorted[i]
}

export function validationGrade(error: number) {
  return error <= 150 ? "Good" : error <= 240 ? "Fair" : "Poor"
}

export function createOneEuroFilter() {
  let previous: { raw: Point; estimate: Point; velocity: Point; time: number } | undefined
  const blend = (last: number, next: number, hz: number, dt: number) => {
    const rate = 2 * Math.PI * hz * dt
    return last + (next - last) * rate / (1 + rate)
  }

  return {
    reset() { previous = undefined },
    update(raw: Point, time: number) {
      if (!previous || time - previous.time > 250) {
        previous = { raw, estimate: raw, velocity: { x: 0, y: 0 }, time }
        return raw
      }

      const dt = Math.max(0.001, (time - previous.time) / 1000)
      const velocity = {
        x: blend(previous.velocity.x, (raw.x - previous.raw.x) / dt, 1, dt),
        y: blend(previous.velocity.y, (raw.y - previous.raw.y) / dt, 1, dt),
      }
      const estimate = {
        x: blend(previous.estimate.x, raw.x, 1.2 + 0.012 * Math.abs(velocity.x), dt),
        y: blend(previous.estimate.y, raw.y, 1.2 + 0.012 * Math.abs(velocity.y), dt),
      }
      previous = { raw, estimate, velocity, time }
      return estimate
    },
  }
}
