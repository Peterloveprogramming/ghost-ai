import { NODE_COLORS, type CanvasEdge, type CanvasNode, type CanvasShape } from "@/types/canvas"

export interface CanvasTemplate {
  id: string
  name: string
  description: string
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

// Fixed template ids are remapped to fresh ids at import time (see
// canvas.tsx's handleImportTemplate), so collisions across imports and with
// createCanvasNodeId's runtime ids are never a concern here.
interface TemplateNodeSpec {
  id: string
  label: string
  shape: CanvasShape
  color: string
  x: number
  y: number
  width: number
  height: number
}

function node({ id, label, shape, color, x, y, width, height }: TemplateNodeSpec): CanvasNode {
  return {
    id,
    type: "canvasNode",
    position: { x, y },
    width,
    height,
    data: { label, shape, color },
  }
}

function edge(source: string, target: string): CanvasEdge {
  return {
    id: `${source}->${target}`,
    type: "canvasEdge",
    source,
    target,
  }
}

const NEUTRAL = NODE_COLORS[0].fill
const BLUE = NODE_COLORS[1].fill
const PURPLE = NODE_COLORS[2].fill
const ORANGE = NODE_COLORS[3].fill
const GREEN = NODE_COLORS[6].fill
const TEAL = NODE_COLORS[7].fill

const MICROSERVICES: CanvasTemplate = {
  id: "microservices",
  name: "Microservices",
  description: "An API gateway routing to independent services backed by their own data stores.",
  nodes: [
    node({ id: "client", label: "Client", shape: "circle", color: NEUTRAL, x: 200, y: 0, width: 100, height: 100 }),
    node({ id: "gateway", label: "API Gateway", shape: "hexagon", color: BLUE, x: 170, y: 160, width: 160, height: 100 }),
    node({ id: "users", label: "Users Service", shape: "rectangle", color: PURPLE, x: 0, y: 320, width: 160, height: 80 }),
    node({ id: "orders", label: "Orders Service", shape: "rectangle", color: PURPLE, x: 200, y: 320, width: 160, height: 80 }),
    node({ id: "billing", label: "Billing Service", shape: "rectangle", color: PURPLE, x: 400, y: 320, width: 160, height: 80 }),
    node({ id: "users-db", label: "Users DB", shape: "cylinder", color: GREEN, x: 20, y: 460, width: 120, height: 110 }),
    node({ id: "orders-db", label: "Orders DB", shape: "cylinder", color: GREEN, x: 220, y: 460, width: 120, height: 110 }),
    node({ id: "billing-db", label: "Billing DB", shape: "cylinder", color: GREEN, x: 420, y: 460, width: 120, height: 110 }),
  ],
  edges: [
    edge("client", "gateway"),
    edge("gateway", "users"),
    edge("gateway", "orders"),
    edge("gateway", "billing"),
    edge("users", "users-db"),
    edge("orders", "orders-db"),
    edge("billing", "billing-db"),
  ],
}

const CI_CD_PIPELINE: CanvasTemplate = {
  id: "ci-cd-pipeline",
  name: "CI/CD Pipeline",
  description: "A linear build, test, and deploy pipeline from a source commit to production.",
  nodes: [
    node({ id: "commit", label: "Git Commit", shape: "circle", color: NEUTRAL, x: 0, y: 40, width: 100, height: 100 }),
    node({ id: "build", label: "Build", shape: "rectangle", color: BLUE, x: 160, y: 50, width: 160, height: 80 }),
    node({ id: "test", label: "Test", shape: "rectangle", color: ORANGE, x: 380, y: 50, width: 160, height: 80 }),
    node({ id: "approval", label: "Approval Gate", shape: "diamond", color: PURPLE, x: 600, y: 30, width: 180, height: 140 }),
    node({ id: "staging", label: "Deploy: Staging", shape: "pill", color: TEAL, x: 840, y: 32, width: 160, height: 56 }),
    node({ id: "production", label: "Deploy: Production", shape: "pill", color: GREEN, x: 840, y: 120, width: 160, height: 56 }),
  ],
  edges: [
    edge("commit", "build"),
    edge("build", "test"),
    edge("test", "approval"),
    edge("approval", "staging"),
    edge("approval", "production"),
  ],
}

const EVENT_DRIVEN_SYSTEM: CanvasTemplate = {
  id: "event-driven-system",
  name: "Event-Driven System",
  description: "Producers publish events onto a broker that fans out to independent consumers.",
  nodes: [
    node({ id: "producer-a", label: "Order Service", shape: "rectangle", color: BLUE, x: 0, y: 0, width: 160, height: 80 }),
    node({ id: "producer-b", label: "Inventory Service", shape: "rectangle", color: BLUE, x: 0, y: 140, width: 160, height: 80 }),
    node({ id: "broker", label: "Event Broker", shape: "hexagon", color: ORANGE, x: 240, y: 50, width: 160, height: 100 }),
    node({ id: "consumer-a", label: "Notifications", shape: "rectangle", color: PURPLE, x: 480, y: -20, width: 160, height: 80 }),
    node({ id: "consumer-b", label: "Analytics", shape: "rectangle", color: PURPLE, x: 480, y: 100, width: 160, height: 80 }),
    node({ id: "consumer-c", label: "Audit Log", shape: "rectangle", color: PURPLE, x: 480, y: 220, width: 160, height: 80 }),
    node({ id: "audit-db", label: "Audit DB", shape: "cylinder", color: GREEN, x: 720, y: 210, width: 120, height: 110 }),
  ],
  edges: [
    edge("producer-a", "broker"),
    edge("producer-b", "broker"),
    edge("broker", "consumer-a"),
    edge("broker", "consumer-b"),
    edge("broker", "consumer-c"),
    edge("consumer-c", "audit-db"),
  ],
}

export const CANVAS_TEMPLATES: CanvasTemplate[] = [MICROSERVICES, CI_CD_PIPELINE, EVENT_DRIVEN_SYSTEM]
