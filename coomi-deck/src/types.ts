/* 领域类型 —— 对齐 A2A 任务生命周期与第 1 轮实体模型 */

export type ThemeId = 'tower' | 'ink' | 'bridge' | 'paper'

export type A2AState =
  | 'submitted'
  | 'working'
  | 'input-required'
  | 'completed'
  | 'failed'
  | 'canceled'

export interface Agent {
  id: string
  name: string
  kind: '内置' | 'CLI'
  status: 'online' | 'busy' | 'offline'
  current?: string
  skills: string[]
  lastActive: string
}

export type ApprovalType = 'workflow' | 'resource' | 'agent-request' | 'incident'

export interface Approval {
  id: number
  type: ApprovalType
  title: string
  source: string
  agent: string
  waitMin: number
  summary: string
}

export interface ResolvedApproval extends Approval {
  resolution: string
}

export interface RunningTask {
  id: number
  title: string
  flow?: string
  agent: string
  progress: number
  state: A2AState
}

export interface TaskRow {
  id: number
  title: string
  source: string
  agent: string
  state: A2AState
  time: string
  duration: string
}

export interface PanelMessage {
  id: number
  from: 'user' | 'coomi'
  text: string
  card?: { taskId: number; label: string }
}

export interface FlowNode {
  id: string
  name: string
  agent?: string
  state: A2AState
  note?: string
}

export interface WorkflowRun {
  id: number
  flow: string
  title: string
  agent: string
  state: A2AState
  progress: number
  elapsed: string
  nodes: FlowNode[]
  log: string[]
}

export interface AdHocTask {
  id: number
  title: string
  agent: string
  state: A2AState
  progress: number
  elapsed: string
}

export const STATE_META: Record<A2AState, { label: string; cls: string; dot: string }> = {
  submitted: { label: '排队中', cls: 'b-muted', dot: 'muted' },
  working: { label: '运行中', cls: 'b-accent', dot: 'working' },
  'input-required': { label: '等待审批', cls: 'b-human', dot: 'human' },
  completed: { label: '已完成', cls: 'b-ok', dot: 'ok' },
  failed: { label: '失败', cls: 'b-danger', dot: 'danger' },
  canceled: { label: '已取消', cls: 'b-muted', dot: 'muted' },
}
