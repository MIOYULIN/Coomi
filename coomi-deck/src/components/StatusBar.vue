<script setup lang="ts">
import { computed } from 'vue'
import { RefreshCw } from 'lucide-vue-next'
import { useUiStore, THEMES } from '@/stores/ui'
import { useDataStore } from '@/stores/data'

const ui = useUiStore()
const data = useDataStore()

const incidentText = computed(() =>
  data.incidentCount > 0 ? `${data.incidentCount} 异常` : null,
)
</script>

<template>
  <header class="statusbar">
    <div class="group">
      <span class="item"><i class="dot live" />{{ data.onlineAgents }} 代理在线</span>
      <span class="sep" />
      <span class="item">{{ data.busyAgents }} 任务运行中</span>
      <template v-if="incidentText">
        <span class="sep" />
        <span class="item incident"><i class="dot danger" />{{ incidentText }}</span>
      </template>
    </div>

    <div class="group">
      <span class="item sync">
        <RefreshCw :size="12" />
        CoomiLink · {{ data.syncMinutesAgo }} 分钟前
      </span>
      <span class="sep" />
      <div class="themes" title="切换主题">
        <button
          v-for="t in THEMES"
          :key="t.id"
          class="swatch"
          :class="{ on: ui.theme === t.id }"
          :title="`${t.name} — ${t.desc}`"
          :style="{ '--sw-bg': t.bg, '--sw-accent': t.accent }"
          @click="ui.setTheme(t.id)"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
.statusbar {
  height: 38px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  font-size: 12px;
  color: var(--text-2);
  position: relative;
  z-index: 30;
}
.group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-variant-numeric: tabular-nums;
}
.item.incident {
  color: var(--danger);
  font-weight: 500;
}
.sync {
  color: var(--text-3);
}
.sync svg {
  color: var(--ok);
}
.sep {
  width: 1px;
  height: 14px;
  background: var(--border-strong);
}
.themes {
  display: flex;
  gap: 6px;
  align-items: center;
}
.swatch {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid var(--border-strong);
  background: linear-gradient(135deg, var(--sw-bg) 55%, var(--sw-accent) 55%);
  cursor: pointer;
  padding: 0;
  transition: transform var(--dur-1) var(--ease), box-shadow var(--dur-1) var(--ease);
}
.swatch:hover {
  transform: scale(1.15);
}
.swatch.on {
  box-shadow: 0 0 0 2px var(--bg), 0 0 0 3.5px var(--accent);
}
</style>
