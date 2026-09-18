export type AccentHex = string

export interface MicroService {
  id: string
  name: string
  short: string
  color: string
  endpoint: string
  responsibility: string
  exampleInput: string
  exampleOutput: string
}

export interface ToolDef {
  id: string
  fn: string
  params: string
  what: string
  endpoint: string
  executedBy: string
  serviceId: string
  color: string
}

export interface AgentDef {
  id: string
  name: string
  color: string
  role: string
  toolIds?: string[]
  traits?: string[]
}

export interface RequestCase {
  id: string
  label: string
  long: string
  steps: { tool: string; needed: boolean }[]
  why: string
}

export interface TraceEvent {
  t: string
  actor: string
  actorColor: string
  action: string
  detail?: string
}
