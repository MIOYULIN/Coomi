<script setup lang="ts">
import { computed } from 'vue'
import { Check, ChevronRight, RotateCcw, SkipForward, Square, X } from 'lucide-vue-next'
import type { Approval, ApprovalType } from '@/types'
import { useDataStore } from '@/stores/data'

const props = defineProps<{ item: Approval }>()
const data = useDataStore()

const TYPE_META: Record<ApprovalType, { badge: string; cls: string }> = {
  workflow: { badge: '审批', cls: 'b-human' },
  resource: { badge: '资源申请', cls: 'b-human' },
  'agent-request': { badge: '代理请求', cls: 'b-human' },
  incident: { badge: '异常', cls: 'b-danger' },
}

const meta = computed(() => TYPE_META[props.item.type])

const waitText = computed(() => {
  const m = props.item.waitMin
  return m < 1 ? '刚刚' : m < 60 ? `等待 ${m} 分钟` : `等待 ${Math.floor(m / 60)} 小时 ${m % 60} 分`
})
</script>

<template>
  <article class="appr card">
    <header class="top">
      <span class="badge" :class="meta.cls">{{ meta.badge }}</span>
      <h3 class="title">{{ item.title }}</h3>
      <span class="wait mono">{{ waitText }}</span>
    </header>
    <div class="source">{{ item.source }} · {{ item.agent }}</div>
    <p class="summary">{{ item.summary }}</p>

    <footer class="actions">
      <template v-if="item.type === 'workflow'">
        <button class="btn btn-primary btn-sm" @click="data.resolve(item.id, '已批准')"><Check />批准</button>
        <button class="btn btn-ghost btn-sm" @click="data.resolve(item.id, '已拒绝')"><X />拒绝</button>
        <button class="btn btn-ghost btn-sm">详情<ChevronRight /></button>
      </template>
      <template v-else-if="item.type === 'resource'">
        <button class="btn btn-primary btn-sm" @click="data.resolve(item.id, '已批准')"><Check />批准</button>
        <button class="btn btn-human btn-sm" @click="data.resolve(item.id, '已批准 · 此类自动放行')">总是放行此类</button>
        <button class="btn btn-ghost btn-sm" @click="data.resolve(item.id, '已拒绝')"><X />拒绝</button>
      </template>
      <template v-else-if="item.type === 'agent-request'">
        <button class="btn btn-primary btn-sm" @click="data.resolve(item.id, '已授权')"><Check />授权</button>
        <button class="btn btn-ghost btn-sm" @click="data.resolve(item.id, '已拒绝')"><X />拒绝</button>
        <button class="btn btn-ghost btn-sm">详情<ChevronRight /></button>
      </template>
      <template v-else>
        <button class="btn btn-primary btn-sm" @click="data.resolve(item.id, '已重试')"><RotateCcw />重试</button>
        <button class="btn btn-ghost btn-sm" @click="data.resolve(item.id, '已跳过')"><SkipForward />跳过</button>
        <button class="btn btn-danger-ghost btn-sm" @click="data.resolve(item.id, '已终止')"><Square />终止</button>
        <button class="btn btn-ghost btn-sm">日志<ChevronRight /></button>
      </template>
    </footer>
  </article>
</template>

<style scoped>
.appr {
  padding: 13px 15px 12px;
  transition: border-color var(--dur-1) var(--ease);
}
.appr:hover {
  border-color: var(--border-strong);
}
.top {
  display: flex;
  align-items: center;
  gap: 9px;
}
.title {
  margin: 0;
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.005em;
  flex: 1;
  min-width: 0;
}
.wait {
  flex: none;
  font-size: 11px;
  color: var(--text-3);
}
.source {
  margin-top: 5px;
  font-size: 12px;
  color: var(--text-3);
}
.summary {
  margin: 8px 0 0;
  font-size: 12.5px;
  color: var(--text-2);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.actions {
  display: flex;
  gap: 8px;
  margin-top: 11px;
}
</style>
