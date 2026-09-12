import type { CanvasShape } from "@/types/canvas"

let counter = 0

// Shape name + timestamp + a counter, so two drops in the same millisecond
// still get distinct ids.
export function createCanvasNodeId(shape: CanvasShape): string {
  counter += 1
  return `${shape}-${Date.now()}-${counter}`
}
