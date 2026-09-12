import { defineStore } from 'pinia'
import type {
  AdHocTask,
  Agent,
  Approval,
  PanelMessage,
  ResolvedApproval,
  TaskRow,
  WorkflowRun,
} from '@/types'

/* 静态示例数据 —— 原型阶段替代真实引擎数据，场景取自真实使用痛点 */
export const useDataStore = defineStore('data', {
  state: () => ({
    agents: [
      { id: 'coomi', name: 'Coomi 引擎', kind: '内置', status: 'online', current: '调度中', skills: ['调度', '提示词设计', '自动审批', '对话'], lastActive: '刚刚' },
      { id: 'zcode', name: 'zcode', kind: 'CLI', status: 'busy', current: '任务 #128', skills: ['代码', '终端', 'Git', '测试'], lastActive: '1 分钟前' },
      { id: 'codex', name: 'codex', kind: 'CLI', status: 'busy', current: '任务 #131', skills: ['代码', '分析', '长任务'], lastActive: '3 分钟前' },
      { id: 'ci-runner', name: 'ci-runner', kind: 'CLI', status: 'online', current: '空闲', skills: ['构建', '打包', '部署'], lastActive: '1 小时前' },
    ] as Agent[],

    approvals: [
      { id: 1, type: 'workflow', title: '请求发布到生产环境', source: '工作流「发布上线 Coomi Android」· 节点：发布', agent: 'zcode', waitMin: 12, summary: 'v1.4.9 已打包并通过全部 47 项测试，迭代清单已生成。发布后将推送至应用市场，并归档本轮迭代记录保证可溯源。' },
      { id: 2, type: 'resource', title: '训练任务申请 GPU：A100 × 2 · 4 小时', source: '任务「意图分类模型微调（第三批）」', agent: 'codex', waitMin: 3, summary: '用于第三批反馈数据的意图分类微调，预估 3.5 小时，费用约 ¥168，任务结束后自动释放。' },
      { id: 3, type: 'incident', title: '测试未通过：官网构建 2 项失败', source: '任务「修改 Coomi 官网」', agent: 'zcode', waitMin: 1, summary: '快照测试 hero-section 与 download-link 未通过。zcode 已定位为文案结构调整导致的选择器失效，建议更新快照后重试。' },
      { id: 4, type: 'agent-request', title: '请求访问资源：生产服务器密钥 prod-ssh', source: '任务「后台反馈接口扩容」', agent: 'codex', waitMin: 8, summary: '需 SSH 登录生产服务器执行扩容。已附资源使用指令：仅只读操作 + 单次扩容命令，预计 10 分钟内释放。' },
      { id: 5, type: 'workflow', title: '确认迭代清单 v1.4.9 入库', source: '工作流「发布上线 Coomi Android」· 节点：归档', agent: 'Coomi', waitMin: 26, summary: '本轮 14 项变更的迭代清单已整理完毕，确认后归档并同步至手机端，作为下一批次规划的基线。' },
    ] as Approval[],

    resolved: [] as ResolvedApproval[],

    runs: [
      {
        id: 128, flow: '反馈分析→规划批次', title: '拉取后台反馈数据分析 · 第 3 批', agent: 'zcode',
        state: 'working', progress: 65, elapsed: '18:32',
        nodes: [
          { id: 'n1', name: '拉取本周反馈数据', state: 'completed', note: '412 条' },
          { id: 'n2', name: '归因分析', agent: 'zcode', state: 'working', note: '进行中' },
          { id: 'n3', name: '生成批次规划建议', state: 'submitted' },
          { id: 'n4', name: '审批门 · 批次确认', state: 'submitted', note: '等待上游' },
        ],
        log: [
          '[12:58:04] fetch: GET /api/feedback?range=7d → 412 rows',
          '[12:58:11] 归因聚类：37 个簇 → 归并为 6 类',
          '[13:02:45] 高频问题：引擎重启风暴（占 31%）',
          '[13:05:20] 正在交叉比对 v1.4.8 变更清单…',
        ],
      },
      {
        id: 129, flow: '发布上线 Coomi Android', title: 'v1.4.9 发布', agent: 'zcode',
        state: 'input-required', progress: 80, elapsed: '42:05',
        nodes: [
          { id: 'n1', name: '打包构建', state: 'completed', note: 'aab 54.2 MB' },
          { id: 'n2', name: '全量测试', state: 'completed', note: '47/47 通过' },
          { id: 'n3', name: '发布到生产', state: 'input-required', note: '等待你的批准' },
          { id: 'n4', name: '归档迭代清单', state: 'submitted' },
        ],
        log: [
          '[12:31:00] ./gradlew assembleRelease ✓',
          '[12:36:44] 47 项测试全部通过',
          '[12:37:02] → 审批门已触发，等待人工确认',
        ],
      },
      {
        id: 130, flow: '修改 Coomi 官网', title: '首页文案与结构更新', agent: 'zcode',
        state: 'failed', progress: 45, elapsed: '07:15',
        nodes: [
          { id: 'n1', name: '调整文案结构', state: 'completed' },
          { id: 'n2', name: '快照测试', state: 'failed', note: '2 项失败' },
          { id: 'n3', name: '部署预览', state: 'submitted' },
        ],
        log: [
          '[13:06:20] vitest run --update=false',
          '[13:07:01] ✗ hero-section 快照不匹配',
          '[13:07:01] ✗ download-link 选择器失效',
          '[13:07:12] 已生成修复建议 → 等待人工决策',
        ],
      },
    ] as WorkflowRun[],

    adHoc: [
      { id: 131, title: '修改后台面板权限逻辑', agent: 'codex', state: 'working', progress: 12, elapsed: '06:12' },
      { id: 132, title: '官网下载页文案更新', agent: 'zcode', state: 'submitted', progress: 0, elapsed: '排队中' },
    ] as AdHocTask[],

    selectedRunId: 128,

    tasks: [
      { id: 132, title: '官网下载页文案更新', source: '单次派发', agent: 'zcode', state: 'submitted', time: '13:11', duration: '排队中' },
      { id: 131, title: '修改后台面板权限逻辑', source: '单次派发', agent: 'codex', state: 'working', time: '13:05', duration: '06:12' },
      { id: 128, title: '拉取后台反馈数据分析', source: '工作流「反馈分析→规划批次」', agent: 'zcode', state: 'working', time: '12:40', duration: '18:32' },
      { id: 127, title: '修复登录态过期问题', source: '单次派发', agent: 'zcode', state: 'input-required', time: '11:52', duration: '等待 12 分钟' },
      { id: 126, title: '发布上线 Coomi Android v1.4.8', source: '工作流「发布上线」', agent: 'zcode', state: 'completed', time: '昨天', duration: '42:10' },
      { id: 125, title: '后台反馈周报生成', source: '工作流「反馈分析」', agent: 'Coomi', state: 'completed', time: '昨天', duration: '03:48' },
      { id: 124, title: '官网移动端适配修复', source: '单次派发', agent: 'codex', state: 'failed', time: '昨天', duration: '15:20' },
      { id: 123, title: '迭代清单 v1.4.8 归档', source: '工作流「发布上线」', agent: 'Coomi', state: 'completed', time: '2 天前', duration: '01:12' },
      { id: 122, title: 'NAS 同步配置巡检', source: '单次派发', agent: 'Coomi', state: 'canceled', time: '2 天前', duration: '—' },
      { id: 121, title: '意图分类模型微调（第二批）', source: '单次派发', agent: 'codex', state: 'completed', time: '3 天前', duration: '3:42:05' },
    ] as TaskRow[],

    messages: [
      { id: 1, from: 'user', text: '拉一下这周的后台反馈，做归因分析，顺便看看能不能排出下个批次' },
      { id: 2, from: 'coomi', text: '已调用模板 #反馈分析→规划批次，派发给 zcode。归因摘要和批次建议完成后一起给你。', card: { taskId: 128, label: '任务 #128 · 进行中' } },
      { id: 3, from: 'user', text: 'GPU 训练以后让 codex 自己申请，别每次都问我' },
      { id: 4, from: 'coomi', text: '可以。我建议在资源「GPU 集群」上挂自动放行规则：codex 发起、单次 ≤ 4 小时、费用 ≤ ¥200 时自动批准，其余仍走你确认。要在审批卡片上点「总是放行此类」即可生效。' },
    ] as PanelMessage[],

    stats: { done: 14, approvals: 6, auto: 9 },
    syncMinutesAgo: 2,
    templates: ['发布上线 Coomi Android', '反馈分析→规划批次', '修改 Coomi 官网'],
  }),

  getters: {
    onlineAgents: (s) => s.agents.filter((a) => a.status !== 'offline').length,
    busyAgents: (s) => s.agents.filter((a) => a.status === 'busy').length,
    incidentCount: (s) => s.approvals.filter((a) => a.type === 'incident').length,
    selectedRun: (s) => s.runs.find((r) => r.id === s.selectedRunId) ?? s.runs[0],
  },

  actions: {
    resolve(id: number, resolution: string) {
      const idx = this.approvals.findIndex((a) => a.id === id)
      if (idx === -1) return
      const [item] = this.approvals.splice(idx, 1)
      this.resolved.unshift({ ...item, resolution })
    },
    sendMessage(text: string) {
      const nid = Date.now()
      this.messages.push({ id: nid, from: 'user', text })
      setTimeout(() => {
        this.messages.push({
          id: nid + 1,
          from: 'coomi',
          text: '收到。原型阶段暂不真正派发——正式版里我会把问题与目标描述清楚，选好模板与资源后派给合适的代理。',
        })
      }, 600)
    },
    selectRun(id: number) {
      this.selectedRunId = id
    },
    tick() {
      for (const t of [...this.runs, ...this.adHoc]) {
        if (t.state === 'working' && t.progress < 99) {
          t.progress = Math.min(99, t.progress + Math.round(Math.random() * 2))
        }
      }
    },
  },
})
