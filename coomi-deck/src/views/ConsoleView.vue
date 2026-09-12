<script setup lang="ts">
import { computed } from 'vue'
import { Inbox, RotateCcw, SkipForward, Zap } from 'lucide-vue-next'
import { useDataStore } from '@/stores/data'
import { useUiStore } from '@/stores/ui'
import { STATE_META, type A2AState } from '@/types'
import ApprovalCard from '@/components/ApprovalCard.vue'
import logo from '@/assets/brand/logo-256.png'

const data = useDataStore()
const ui = useUiStore()

const run = computed(() => data.selectedRun)

const DOT: Record<A2AState, string> = {
  submitted: 'muted',
  working: 'working',
  'input-required': 'human',
  completed: 'ok',
  failed: 'danger',
  canceled: 'muted',
}
</script>

<template>
  <div class="console">
    <div class="page-head">
      <div>
        <h1 class="page-title">控制台</h1>
        <div class="page-sub">9 月 12 日 · 周五</div>
      </div>
      <div class="head-right">
        <div class="today">
          <span><b class="mono">{{ data.stats.done }}</b> 完成</span>
          <span><b class="mono human">{{ data.stats.approvals }}</b> 人工审批</span>
          <span><b class="mono accent">{{ data.stats.auto }}</b> 自动放行</span>
        </div>
        <button class="btn btn-primary" @click="ui.togglePalette()"><Zap :size="14" />快速派发</button>
      </div>
    </div>

    <div class="garden">
      <!-- 左侧主体：运行中的工作流 -->
      <div class="col left">
        <div class="section-label">运行中的工作流 · {{ data.runs.length }}</div>
        <article
          v-for="r in data.runs"
          :key="r.id"
          class="run card"
          :class="{ sel: r.id === data.selectedRunId }"
          @click="data.selectRun(r.id)"
        >
          <header class="r-top">
            <span class="badge" :class="STATE_META[r.state].cls">{{ STATE_META[r.state].label }}</span>
            <span class="flow">{{ r.flow }}</span>
            <span class="mono meta">#{{ r.id }} · {{ r.elapsed }}</span>
          </header>
          <div class="r-title">{{ r.title }}</div>
          <div class="dagstrip">
            <template v-for="(n, i) in r.nodes" :key="n.id">
              <div class="n" :class="n.state">
                <i class="dot" :class="DOT[n.state]" />{{ n.name }}
              </div>
              <div
                v-if="i < r.nodes.length - 1"
                class="link"
                :class="{ human: r.nodes[i + 1].state === 'input-required' }"
              />
            </template>
          </div>
          <div class="r-foot">
            <div class="progress"><i :style="{ width: r.progress + '%' }" /></div>
            <span class="mono pct">{{ r.progress }}%</span>
          </div>
        </article>

        <div class="section-label gap">单次任务 · {{ data.adHoc.length }}</div>
        <div class="adhoc">
          <article v-for="t in data.adHoc" :key="t.id" class="ad card">
            <div class="ad-top">
              <i class="dot" :class="DOT[t.state]" />
              <span class="ad-title">{{ t.title }}</span>
              <span class="mono meta">#{{ t.id }}</span>
            </div>
            <div class="ad-meta">{{ t.agent }} · {{ t.elapsed }}</div>
            <div class="progress"><i :style="{ width: t.progress + '%' }" /></div>
          </article>
        </div>
      </div>

      <!-- 右侧主体：工作流详情 + 待审批清单 -->
      <div class="col right">
        <section v-if="run" class="card detail">
          <header class="d-head">
            <span class="badge" :class="STATE_META[run.state].cls">{{ STATE_META[run.state].label }}</span>
            <span class="d-title">{{ run.flow }}</span>
            <span class="mono meta">#{{ run.id }}</span>
          </header>
          <div class="d-sub">{{ run.title }} · {{ run.agent }} · 已运行 <span class="mono">{{ run.elapsed }}</span></div>

          <div class="steps">
            <div v-for="(n, i) in run.nodes" :key="n.id" class="step" :class="n.state">
              <div class="s-rail">
                <i class="s-dot" />
                <i v-if="i < run.nodes.length - 1" class="s-line" />
              </div>
              <div class="s-body">
                <div class="s-name">
                  {{ n.name }}
                  <span v-if="n.agent" class="mono s-agent">{{ n.agent }}</span>
                </div>
                <div class="s-note">{{ n.note ?? STATE_META[n.state].label }}</div>
                <div v-if="n.state === 'failed'" class="s-actions">
                  <button class="btn btn-primary btn-sm"><RotateCcw />重试此节点</button>
                  <button class="btn btn-ghost btn-sm"><SkipForward />跳过</button>
                </div>
                <div v-else-if="n.state === 'input-required'" class="s-actions">
                  <span class="s-hint">↓ 在下方待审批清单中决策</span>
                </div>
              </div>
            </div>
          </div>

          <div class="section-label log-label">实时日志</div>
          <div class="logbox mono">
            <div v-for="(line, i) in run.log" :key="i" class="logline">{{ line }}</div>
            <div v-if="run.state === 'working'" class="logline caret">▍</div>
          </div>
        </section>

        <div class="appr-head">
          <span class="section-label"><Inbox :size="11" style="vertical-align: -1px" /> 待审批 · {{ data.approvals.length }}</span>
        </div>
        <ApprovalCard v-for="a in data.approvals" :key="a.id" :item="a" />
        <div v-if="data.approvals.length === 0" class="empty card">
          <img class="mascot" :src="logo" alt="Coomi" width="64" height="64" />
          <p class="empty-title">收件箱已清空</p>
          <p class="empty-sub">自动化在跑，没有需要你决策的事</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.console {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 24px 0;
  overflow: hidden;
}
.page-head {
  flex: none;
}
.head-right {
  display: flex;
  align-items: center;
  gap: 18px;
}
.today {
  display: flex;
  gap: 14px;
  font-size: 12px;
  color: var(--text-3);
}
.today b {
  font-size: 14px;
  font-weight: 650;
  color: var(--text);
}
.today b.human {
  color: var(--human);
}
.today b.accent {
  color: var(--accent);
}
.garden {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 16px;
}
.col {
  min-height: 0;
  overflow-y: auto;
  padding: 2px 2px 32px;
}
.col > .section-label {
  display: block;
  margin-bottom: 10px;
}
.section-label.gap {
  margin-top: 20px;
}

/* ── 左：工作流运行卡片（箱庭） ── */
.run {
  padding: 14px 16px 13px;
  cursor: pointer;
  transition: border-color var(--dur-1) var(--ease), box-shadow var(--dur-1) var(--ease);
  margin-bottom: 12px;
}
.run:hover {
  border-color: var(--border-strong);
}
.run.sel {
  border-color: var(--accent-border);
  box-shadow: var(--ring);
}
.r-top {
  display: flex;
  align-items: center;
  gap: 9px;
}
.flow {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
.meta {
  margin-left: auto;
  font-size: 11px;
  color: var(--text-3);
}
.r-title {
  margin-top: 7px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.005em;
}
.dagstrip {
  display: flex;
  align-items: center;
  gap: 0;
  margin-top: 11px;
  overflow-x: auto;
  padding-bottom: 2px;
}
.n {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 10px;
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  background: var(--fill);
  font-size: 11.5px;
  color: var(--text-3);
  white-space: nowrap;
  flex: none;
}
.n.completed {
  color: var(--text-2);
}
.n.working {
  background: var(--accent-soft);
  border-color: var(--accent-border);
  color: var(--accent);
  font-weight: 500;
}
.n.input-required {
  background: var(--human-soft);
  border-color: var(--human-border);
  color: var(--human);
  font-weight: 500;
}
.n.failed {
  background: var(--danger-soft);
  border-color: var(--danger-border);
  color: var(--danger);
  font-weight: 500;
}
.link {
  width: 22px;
  height: 2px;
  background: var(--border-strong);
  flex: none;
}
.link.human {
  background: repeating-linear-gradient(90deg, var(--human) 0 4px, transparent 4px 8px);
}
.r-foot {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}
.r-foot .progress {
  flex: 1;
}
.pct {
  font-size: 11.5px;
  color: var(--text-2);
}

/* ── 左：单次任务 ── */
.adhoc {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.ad {
  padding: 12px 14px;
  transition: border-color var(--dur-1) var(--ease);
}
.ad:hover {
  border-color: var(--border-strong);
}
.ad-top {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ad-title {
  flex: 1;
  font-size: 12.5px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ad-top .meta {
  margin-left: 0;
}
.ad-meta {
  font-size: 11px;
  color: var(--text-3);
  margin: 6px 0 8px;
}

/* ── 右：工作流详情 ── */
.detail {
  padding: 14px 16px;
  margin-bottom: 14px;
}
.d-head {
  display: flex;
  align-items: center;
  gap: 9px;
}
.d-title {
  font-size: 13.5px;
  font-weight: 650;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.d-head .meta {
  margin-left: 0;
}
.d-sub {
  margin-top: 5px;
  font-size: 12px;
  color: var(--text-3);
}
.steps {
  margin-top: 14px;
}
.step {
  display: flex;
  gap: 11px;
}
.s-rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 12px;
  flex: none;
}
.s-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--border-strong);
  background: var(--surface);
  margin-top: 3px;
  flex: none;
}
.step.completed .s-dot {
  border-color: var(--ok);
  background: var(--ok);
}
.step.working .s-dot {
  border-color: var(--accent);
  background: var(--accent);
  animation: pulse 1.6s var(--ease) infinite;
}
.step.input-required .s-dot {
  border-color: var(--human);
  background: var(--human);
}
.step.failed .s-dot {
  border-color: var(--danger);
  background: var(--danger);
}
.s-line {
  width: 2px;
  flex: 1;
  min-height: 14px;
  background: var(--border);
  margin: 3px 0;
}
.s-body {
  flex: 1;
  min-width: 0;
  padding-bottom: 13px;
}
.step:last-child .s-body {
  padding-bottom: 2px;
}
.s-name {
  font-size: 12.5px;
  font-weight: 550;
  display: flex;
  align-items: center;
  gap: 8px;
}
.s-agent {
  font-size: 10.5px;
  font-weight: 400;
  color: var(--text-3);
  background: var(--fill);
  border-radius: 4px;
  padding: 1px 6px;
}
.s-note {
  font-size: 11.5px;
  color: var(--text-3);
  margin-top: 2px;
}
.step.failed .s-note,
.step.failed .s-name {
  color: var(--danger);
}
.step.input-required .s-note {
  color: var(--human);
}
.s-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
.s-hint {
  font-size: 11px;
  color: var(--human);
}
.log-label {
  display: block;
  margin: 4px 0 8px;
}
.logbox {
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 10px 12px;
  font-size: 11px;
  line-height: 1.8;
  color: var(--text-2);
  max-height: 148px;
  overflow-y: auto;
}
.logline {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.caret {
  color: var(--accent);
  animation: pulse 1s steps(2) infinite;
}
.appr-head {
  margin-bottom: 10px;
}
.empty {
  padding: 34px 20px;
  text-align: center;
}
.mascot {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: #fff;
}
.empty-title {
  margin: 12px 0 0;
  font-size: 14px;
  font-weight: 600;
}
.empty-sub {
  margin: 4px 0 0;
  color: var(--text-3);
  font-size: 12px;
}
</style>
