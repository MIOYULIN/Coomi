import { defineStore } from 'pinia'
import type { ThemeId } from '@/types'

export interface ThemeMeta {
  id: ThemeId
  name: string
  desc: string
  bg: string
  accent: string
  human: string
}

export const THEMES: ThemeMeta[] = [
  { id: 'paper', name: '蓝白', desc: 'Coomi Android 移动端的蓝白语言（默认）', bg: '#f4f5f7', accent: '#2d61c6', human: '#d47458' },
  { id: 'tower', name: '静塔', desc: '中性近黑 · 工程控制台', bg: '#0e1013', accent: '#5b8def', human: '#e08a6d' },
  { id: 'ink', name: '暖墨', desc: '暖调深色 · 书房质感', bg: '#161310', accent: '#82a5cf', human: '#dc9269' },
  { id: 'bridge', name: '舰桥', desc: '深海军蓝 · 数据可视化取向', bg: '#090d18', accent: '#4f8dff', human: '#e49a6f' },
]

const stored = (typeof localStorage !== 'undefined' && localStorage.getItem('deck-theme')) as ThemeId | null
const storedWidth = typeof localStorage !== 'undefined' ? Number(localStorage.getItem('deck-panel-width')) : 0
const narrowWindow = typeof window !== 'undefined' && window.innerWidth < 1380

export const PANEL_MIN = 264
export const PANEL_MAX = 560

export const useUiStore = defineStore('ui', {
  state: () => ({
    theme: (stored ?? 'paper') as ThemeId,
    panelHidden: narrowWindow,
    panelWidth: storedWidth >= PANEL_MIN ? Math.min(storedWidth, PANEL_MAX) : 328,
    paletteOpen: false,
  }),
  actions: {
    setTheme(id: ThemeId) {
      this.theme = id
      document.documentElement.dataset.theme = id
      localStorage.setItem('deck-theme', id)
    },
    togglePanel() {
      this.panelHidden = !this.panelHidden
    },
    setPanelWidth(px: number) {
      this.panelWidth = Math.round(Math.min(PANEL_MAX, Math.max(PANEL_MIN, px)))
      localStorage.setItem('deck-panel-width', String(this.panelWidth))
    },
    togglePalette() {
      this.paletteOpen = !this.paletteOpen
    },
  },
})
