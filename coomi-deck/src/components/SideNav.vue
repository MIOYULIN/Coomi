<script setup lang="ts">
import {
  LayoutDashboard,
  ListChecks,
  Workflow,
  ScrollText,
  Bot,
  Database,
  Settings,
  Command,
  PanelRight,
} from 'lucide-vue-next'
import { useUiStore } from '@/stores/ui'
import logo from '@/assets/brand/logo-256.png'

const ui = useUiStore()

const nav = [
  { to: '/', label: '控制台', icon: LayoutDashboard },
  { to: '/tasks', label: '任务', icon: ListChecks },
  { to: '/workflows', label: '工作流', icon: Workflow },
  { to: '/prompts', label: '提示词', icon: ScrollText },
  { to: '/agents', label: '代理', icon: Bot },
  { to: '/resources', label: '资源', icon: Database },
  { to: '/settings', label: '设置', icon: Settings },
]
</script>

<template>
  <nav class="sidenav">
    <div class="brand">
      <span class="mark"><img :src="logo" alt="Coomi" width="20" height="20" /></span>
      <span class="name">Coomi Deck</span>
      <span class="badge b-muted ver">原型</span>
    </div>

    <div class="items">
      <router-link
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        class="item"
        exact-active-class="on"
      >
        <component :is="item.icon" :size="15" />
        {{ item.label }}
      </router-link>
    </div>

    <div class="foot">
      <button class="tool" @click="ui.togglePalette()">
        <Command :size="14" />
        <span>命令面板</span>
        <kbd>⌘K</kbd>
      </button>
      <button class="tool" :class="{ on: !ui.panelHidden }" @click="ui.togglePanel()">
        <PanelRight :size="14" />
        <span>Coomi 面板</span>
        <kbd>⌘J</kbd>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.sidenav {
  width: 196px;
  flex: none;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 12px 10px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px 14px;
}
.mark {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: #ffffff;
  border: 1px solid var(--border);
  overflow: hidden;
  flex: none;
}
.mark img {
  width: 20px;
  height: 20px;
  display: block;
}
.name {
  font-weight: 650;
  font-size: 13px;
  letter-spacing: -0.01em;
}
.ver {
  margin-left: auto;
  height: 17px;
  font-size: 10px;
}
.items {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.item {
  display: flex;
  align-items: center;
  gap: 9px;
  height: 32px;
  padding: 0 10px;
  border-radius: var(--r-md);
  color: var(--text-2);
  font-size: 13px;
  font-weight: 450;
  transition: all var(--dur-1) var(--ease);
}
.item:hover {
  background: var(--fill);
  color: var(--text);
}
.item.on {
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 550;
}
.foot {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-top: 1px solid var(--border);
  padding-top: 10px;
}
.tool {
  display: flex;
  align-items: center;
  gap: 9px;
  height: 30px;
  padding: 0 10px;
  border: none;
  border-radius: var(--r-md);
  background: transparent;
  color: var(--text-3);
  font-family: var(--font-ui);
  font-size: 12px;
  cursor: pointer;
  transition: all var(--dur-1) var(--ease);
}
.tool:hover {
  background: var(--fill);
  color: var(--text);
}
.tool.on {
  color: var(--accent);
}
.tool kbd {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-3);
  background: var(--fill-strong);
  border-radius: 4px;
  padding: 1px 5px;
}
</style>
