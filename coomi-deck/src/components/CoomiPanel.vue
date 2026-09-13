<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { Send, X } from 'lucide-vue-next'
import { useDataStore } from '@/stores/data'
import { useUiStore } from '@/stores/ui'
import logo from '@/assets/brand/logo-256.png'

const data = useDataStore()
const ui = useUiStore()
const draft = ref('')
const listEl = ref<HTMLElement>()
const dragging = ref(false)

function send() {
  const text = draft.value.trim()
  if (!text) return
  data.sendMessage(text)
  draft.value = ''
}

function startDrag(e: PointerEvent) {
  dragging.value = true
  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'col-resize'
  const el = e.currentTarget as HTMLElement
  el.setPointerCapture(e.pointerId)
  const move = (ev: PointerEvent) => ui.setPanelWidth(window.innerWidth - ev.clientX)
  const up = () => {
    dragging.value = false
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerup', up)
  }
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerup', up)
}

watch(
  () => data.messages.length,
  async () => {
    await nextTick()
    listEl.value?.scrollTo({ top: listEl.value.scrollHeight, behavior: 'smooth' })
  },
)
</script>

<template>
  <aside class="panel" :class="{ dragging }" :style="{ width: ui.panelWidth + 'px' }">
    <div class="resizer" title="拖动调整宽度" @pointerdown="startDrag" />
    <header class="head">
      <span class="avatar"><img :src="logo" alt="Coomi" width="24" height="24" /></span>
      <div class="who">
        <div class="name">Coomi</div>
        <div class="state"><i class="dot live" />在线 · 调度中</div>
      </div>
      <button class="close" title="收起面板 ⌘J" @click="ui.togglePanel()"><X :size="14" /></button>
    </header>

    <div ref="listEl" class="msgs">
      <div v-for="m in data.messages" :key="m.id" class="msg" :class="m.from">
        <div class="bubble">
          <p>{{ m.text }}</p>
          <div v-if="m.card" class="mini-card">
            <i class="dot working" />
            <span class="mono">{{ m.card.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <footer class="input-row">
      <input
        v-model="draft"
        class="input"
        placeholder="@ 资源 · # 模板 · 直接说事儿"
        @keydown.enter="send"
      />
      <button class="btn btn-primary send" @click="send"><Send :size="13" /></button>
    </footer>
  </aside>
</template>

<style scoped>
.panel {
  position: relative;
  flex: none;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border-left: 1px solid var(--border);
  min-height: 0;
}
.resizer {
  position: absolute;
  left: -3px;
  top: 0;
  bottom: 0;
  width: 7px;
  cursor: col-resize;
  z-index: 20;
}
.resizer::after {
  content: '';
  position: absolute;
  left: 3px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: transparent;
  transition: background var(--dur-1) var(--ease);
}
.resizer:hover::after,
.panel.dragging .resizer::after {
  background: var(--accent);
}
.head {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
}
.avatar {
  width: 28px;
  height: 28px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: #ffffff;
  border: 1px solid var(--border);
  overflow: hidden;
  flex: none;
}
.avatar img {
  width: 24px;
  height: 24px;
  display: block;
}
.who {
  flex: 1;
}
.name {
  font-weight: 600;
  font-size: 13px;
}
.state {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--text-3);
}
.close {
  border: none;
  background: transparent;
  color: var(--text-3);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--r-sm);
}
.close:hover {
  background: var(--fill);
  color: var(--text);
}
.msgs {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.msg {
  display: flex;
}
.msg.user {
  justify-content: flex-end;
}
.bubble {
  max-width: 88%;
  padding: 8px 11px;
  border-radius: var(--r-lg);
  font-size: 12.5px;
  line-height: 1.55;
}
.msg.user .bubble {
  background: var(--accent-soft);
  color: var(--text);
  border-bottom-right-radius: var(--r-sm);
}
.msg.coomi .bubble {
  background: var(--fill);
  border-bottom-left-radius: var(--r-sm);
}
.bubble p {
  margin: 0;
}
.mini-card {
  margin-top: 7px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 9px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  font-size: 11.5px;
  color: var(--text-2);
}
.input-row {
  display: flex;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid var(--border);
}
.send {
  width: 32px;
  flex: none;
  padding: 0;
  justify-content: center;
}
</style>
