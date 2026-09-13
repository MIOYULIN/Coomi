<script setup lang="ts">
import { Bot, Plus, Terminal } from 'lucide-vue-next'
import { useDataStore } from '@/stores/data'

const data = useDataStore()

const STATUS_TEXT = { online: '在线', busy: '运行中', offline: '离线' } as const
const STATUS_DOT = { online: 'ok', busy: 'working', offline: 'muted' } as const
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1 class="page-title">代理</h1>
        <div class="page-sub">注册的执行单元 — 能力以 A2A AgentCard 描述</div>
      </div>
      <button class="btn btn-ghost"><Plus :size="14" />注册代理</button>
    </div>

    <div class="agents">
      <article v-for="a in data.agents" :key="a.id" class="agent card">
        <header class="top">
          <span class="avatar" :class="{ builtin: a.kind === '内置' }">
            <Bot v-if="a.kind === '内置'" :size="16" />
            <Terminal v-else :size="15" />
          </span>
          <div class="who">
            <div class="name">{{ a.name }}</div>
            <div class="status">
              <i class="dot" :class="STATUS_DOT[a.status]" />
              {{ STATUS_TEXT[a.status] }} · {{ a.current }}
            </div>
          </div>
          <span class="badge" :class="a.kind === '内置' ? 'b-accent' : 'b-muted'">{{ a.kind }}</span>
        </header>
        <div class="skills">
          <span v-for="s in a.skills" :key="s" class="skill">{{ s }}</span>
        </div>
        <footer class="foot">
          <span class="dim">最近活跃 · {{ a.lastActive }}</span>
          <button class="btn btn-ghost btn-sm">详情</button>
        </footer>
      </article>
    </div>
  </div>
</template>

<style scoped>
.agents {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 14px;
}
.agent {
  padding: 15px 16px 12px;
  transition: border-color var(--dur-1) var(--ease);
}
.agent:hover {
  border-color: var(--border-strong);
}
.top {
  display: flex;
  align-items: center;
  gap: 11px;
}
.avatar {
  width: 34px;
  height: 34px;
  border-radius: var(--r-md);
  display: grid;
  place-items: center;
  background: var(--fill-strong);
  color: var(--text-2);
  flex: none;
}
.avatar.builtin {
  background: var(--accent-soft);
  color: var(--accent);
}
.who {
  flex: 1;
  min-width: 0;
}
.name {
  font-weight: 600;
  font-size: 13.5px;
}
.status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: var(--text-3);
  margin-top: 2px;
}
.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}
.skill {
  font-size: 11px;
  color: var(--text-2);
  background: var(--fill);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  padding: 2px 9px;
}
.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}
.dim {
  font-size: 11.5px;
  color: var(--text-3);
}
</style>
