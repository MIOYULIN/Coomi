import { createRouter, createWebHashHistory } from 'vue-router'

const ConsoleView = () => import('@/views/ConsoleView.vue')
const TasksView = () => import('@/views/TasksView.vue')
const AgentsView = () => import('@/views/AgentsView.vue')
const SettingsView = () => import('@/views/SettingsView.vue')
const GalleryView = () => import('@/views/GalleryView.vue')
const PlaceholderView = () => import('@/views/PlaceholderView.vue')

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'console', component: ConsoleView, meta: { title: '控制台' } },
    { path: '/tasks', name: 'tasks', component: TasksView, meta: { title: '任务' } },
    {
      path: '/workflows',
      name: 'workflows',
      component: PlaceholderView,
      meta: { title: '工作流', points: ['工作流列表与运行统计', 'DAG 编排器（Vue Flow 画布）', '节点配置：代理 / 提示词模板 / 审批门', '版本管理与单节点试运行'] },
    },
    {
      path: '/prompts',
      name: 'prompts',
      component: PlaceholderView,
      meta: { title: '提示词', points: ['任务模板库：问题 + 目标 + 资源约束', '方法论偏好：常驻注入、单次可停用', '版本历史与使用记录（迭代可溯源）', '模板变量槽与默认代理'] },
    },
    { path: '/agents', name: 'agents', component: AgentsView, meta: { title: '代理' } },
    {
      path: '/resources',
      name: 'resources',
      component: PlaceholderView,
      meta: { title: '资源', points: ['服务器 / 密钥 / GPU / API 额度', '使用指令：口述用法 → Coomi 精炼为提示词', '审批策略：人工审 / 自动放行规则', '占用状态与释放时间线'] },
    },
    { path: '/settings', name: 'settings', component: SettingsView, meta: { title: '设置' } },
    { path: '/gallery', name: 'gallery', component: GalleryView, meta: { title: '组件样张' } },
  ],
})
