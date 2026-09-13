<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Command, Zap } from 'lucide-vue-next'
import { useUiStore, THEMES } from '@/stores/ui'
import { useDataStore } from '@/stores/data'

interface Cmd {
  id: string
  label: string
  hint?: string
  run: () => void
}

const ui = useUiStore()
const data = useDataStore()
const router = useRouter()
const query = ref('')
const active = ref(0)
const inputEl = ref<HTMLInputElement>()

const commands: Cmd[] = [
  { id: 'dispatch', label: '派发新任务', hint: '选择代理 / 工作流，描述问题与目标', run: () => {} },
  { id: 'go-console', label: '前往 · 控制台', run: () => router.push('/') },
  { id: 'go-tasks', label: '前往 · 任务', run: () => router.push('/tasks') },
  { id: 'go-workflows', label: '前往 · 工作流', run: () => router.push('/workflows') },
  { id: 'go-prompts', label: '前往 · 提示词', run: () => router.push('/prompts') },
  { id: 'go-agents', label: '前往 · 代理', run: () => router.push('/agents') },
  { id: 'go-resources', label: '前往 · 资源', run: () => router.push('/resources') },
  { id: 'go-gallery', label: '前往 · 组件样张', run: () => router.push('/gallery') },
  { id: 'approve-next', label: '批准下一项待办', hint: '收件箱最上方一张卡片', run: () => {
    const first = data.approvals[0]
    if (first) data.resolve(first.id, '已批准')
  } },
  ...THEMES.map((t) => ({
    id: `theme-${t.id}`,
    label: `切换主题 · ${t.name}`,
    hint: t.desc,
    run: () => ui.setTheme(t.id),
  })),
]

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = q
    ? commands.filter((c) => c.label.toLowerCase().includes(q) || c.hint?.toLowerCase().includes(q))
    : commands
  return list.slice(0, 9)
})

watch(filtered, () => (active.value = 0))
watch(
  () => ui.paletteOpen,
  async (open) => {
    if (open) {
      query.value = ''
      await nextTick()
      inputEl.value?.focus()
    }
  },
  { immediate: true },
)

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    active.value = Math.min(filtered.value.length - 1, active.value + 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    active.value = Math.max(0, active.value - 1)
  } else if (e.key === 'Enter') {
    const cmd = filtered.value[active.value]
    if (cmd) {
      cmd.run()
      ui.paletteOpen = false
    }
  }
}
</script>

<template>
  <div class="overlay" @click.self="ui.paletteOpen = false">
    <div class="palette">
      <div class="input-wrap">
        <Command :size="14" class="lead" />
        <input
          ref="inputEl"
          v-model="query"
          class="cmd-input"
          placeholder="输入命令或搜索…"
          @keydown="onKey"
        />
        <kbd>esc</kbd>
      </div>
      <div class="list">
        <button
          v-for="(c, i) in filtered"
          :key="c.id"
          class="row"
          :class="{ on: i === active }"
          @mouseenter="active = i"
          @click="c.run(); ui.paletteOpen = false"
        >
          <Zap v-if="c.id === 'dispatch' || c.id === 'approve-next'" :size="13" class="ic" />
          <Check v-else-if="c.id.startsWith('theme')" :size="13" class="ic" />
          <span v-else class="ic spacer" />
          <span class="label">{{ c.label }}</span>
          <span v-if="c.hint" class="hint">{{ c.hint }}</span>
        </button>
        <div v-if="filtered.length === 0" class="empty">没有匹配的命令</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.42);
  display: flex;
  justify-content: center;
  padding-top: 15vh;
  z-index: 100;
}
.palette {
  width: 520px;
  max-height: 380px;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-2);
  overflow: hidden;
  height: fit-content;
}
.input-wrap {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
}
.lead {
  color: var(--text-3);
  flex: none;
}
.cmd-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--text);
  font-family: var(--font-ui);
  font-size: 14px;
}
.cmd-input:focus {
  outline: none;
  box-shadow: none;
}
kbd {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-3);
  background: var(--fill-strong);
  border-radius: 4px;
  padding: 2px 6px;
}
.list {
  overflow-y: auto;
  padding: 6px;
}
.row {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  height: 34px;
  padding: 0 10px;
  border: none;
  border-radius: var(--r-md);
  background: transparent;
  color: var(--text-2);
  font-family: var(--font-ui);
  font-size: 13px;
  cursor: pointer;
  text-align: left;
}
.row.on {
  background: var(--accent-soft);
  color: var(--accent);
}
.ic {
  flex: none;
  opacity: 0.8;
}
.spacer {
  width: 13px;
}
.label {
  font-weight: 500;
}
.hint {
  margin-left: auto;
  font-size: 11px;
  color: var(--text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.empty {
  padding: 22px;
  text-align: center;
  color: var(--text-3);
  font-size: 12px;
}
</style>
