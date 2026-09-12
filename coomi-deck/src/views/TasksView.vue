<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDataStore } from '@/stores/data'
import { STATE_META, type A2AState } from '@/types'

const data = useDataStore()
const filter = ref<'all' | A2AState>('all')

const filters: { id: 'all' | A2AState; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'working', label: '运行中' },
  { id: 'input-required', label: '等待审批' },
  { id: 'submitted', label: '排队中' },
  { id: 'completed', label: '已完成' },
  { id: 'failed', label: '失败' },
  { id: 'canceled', label: '已取消' },
]

const rows = computed(() =>
  filter.value === 'all' ? data.tasks : data.tasks.filter((t) => t.state === filter.value),
)
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1 class="page-title">任务</h1>
        <div class="page-sub">统一任务流 — Coomi 与各代理的执行都在这一条流里</div>
      </div>
    </div>

    <div class="filters">
      <button
        v-for="f in filters"
        :key="f.id"
        class="chip"
        :class="{ on: filter === f.id }"
        @click="filter = f.id"
      >
        {{ f.label }}
      </button>
    </div>

    <div class="table card">
      <div class="tr th">
        <span>状态</span><span>任务</span><span>来源</span><span>代理</span><span>时间</span><span>用时</span>
      </div>
      <div v-for="t in rows" :key="t.id" class="tr">
        <span class="cell"><span class="badge" :class="STATE_META[t.state].cls">{{ STATE_META[t.state].label }}</span></span>
        <span class="cell title">#{{ t.id }} {{ t.title }}</span>
        <span class="cell dim">{{ t.source }}</span>
        <span class="cell mono dim">{{ t.agent }}</span>
        <span class="cell dim">{{ t.time }}</span>
        <span class="cell mono dim">{{ t.duration }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 7px;
  margin-bottom: 14px;
}
.table {
  overflow: hidden;
}
.tr {
  display: grid;
  grid-template-columns: 96px minmax(0, 1.6fr) minmax(0, 1.4fr) 80px 64px 110px;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  font-size: 12.5px;
}
.tr.th {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--text-3);
  background: var(--fill);
  padding: 8px 16px;
}
.tr:not(.th) + .tr {
  border-top: 1px solid var(--border);
}
.tr:not(.th):hover {
  background: var(--fill);
}
.title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dim {
  color: var(--text-2);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
