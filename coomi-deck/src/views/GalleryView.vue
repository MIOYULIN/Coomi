<script setup lang="ts">
import { Check, Plus, X } from 'lucide-vue-next'
import { STATE_META, type A2AState } from '@/types'

const states = Object.keys(STATE_META) as A2AState[]
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1 class="page-title">组件样张</h1>
        <div class="page-sub">切换四套主题，检查每个原语在其中的表现</div>
      </div>
    </div>

    <div class="grid">
      <section class="card box">
        <div class="section-label">按钮</div>
        <div class="row">
          <button class="btn btn-primary"><Check />批准</button>
          <button class="btn btn-ghost"><Plus />新建</button>
          <button class="btn btn-human">总是放行此类</button>
          <button class="btn btn-danger-ghost"><X />终止</button>
        </div>
        <div class="row">
          <button class="btn btn-primary btn-sm">小按钮</button>
          <button class="btn btn-ghost btn-sm">小按钮</button>
        </div>
      </section>

      <section class="card box">
        <div class="section-label">A2A 任务状态</div>
        <div class="row wrap">
          <span v-for="s in states" :key="s" class="badge" :class="STATE_META[s].cls">
            <i class="dot" :class="STATE_META[s].dot" />{{ STATE_META[s].label }}
          </span>
        </div>
        <div class="row wrap">
          <span class="badge b-human">审批</span>
          <span class="badge b-human">资源申请</span>
          <span class="badge b-human">代理请求</span>
          <span class="badge b-danger">异常</span>
          <span class="badge b-muted">内置</span>
        </div>
      </section>

      <section class="card box">
        <div class="section-label">表单</div>
        <input class="input" placeholder="@ 资源 · # 模板 · 直接说事儿" />
        <div class="row">
          <button class="chip on">运行中</button>
          <button class="chip">等待审批</button>
          <button class="chip">已完成</button>
        </div>
      </section>

      <section class="card box">
        <div class="section-label">排版与数字</div>
        <h2 class="h2">控制台 / Console</h2>
        <p class="body">
          Coomi 只描述问题与目标，方案设计交给专业代理。冷蓝 = 机器流转，暖橙 = 人工决策点。
        </p>
        <p class="mono-sample mono">#128 · working · 65% · 18:32 · zcode · a2a://agent/zcode</p>
      </section>

      <section class="card box">
        <div class="section-label">DAG 节点（编排器预览）</div>
        <div class="dag">
          <div class="node done">
            <i class="dot ok" />拉取反馈数据
            <span class="port in" /><span class="port out" />
          </div>
          <div class="edge" />
          <div class="node run">
            <i class="dot working" />归因分析 · zcode
            <span class="port in" /><span class="port out" />
          </div>
          <div class="edge human-edge" />
          <div class="node gate">
            <i class="dot human" />审批门 · 批次规划
            <span class="port in" /><span class="port out" />
          </div>
        </div>
      </section>

      <section class="card box">
        <div class="section-label">进度与表面层级</div>
        <div class="progress"><i style="width: 65%" /></div>
        <div class="surfaces">
          <span class="sf s1">surface</span>
          <span class="sf s2">surface-2</span>
          <span class="sf s3">fill-strong</span>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.box {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.box .section-label {
  margin-bottom: 2px;
}
.row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.row.wrap {
  flex-wrap: wrap;
}
.h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 650;
  letter-spacing: -0.01em;
}
.body {
  margin: 0;
  color: var(--text-2);
  font-size: 13px;
  line-height: 1.7;
}
.mono-sample {
  margin: 0;
  font-size: 12px;
  color: var(--text-3);
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 9px 12px;
}
.dag {
  display: flex;
  align-items: center;
  gap: 0;
  overflow-x: auto;
  padding: 6px 0;
}
.node {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  background: var(--surface-2);
  border: 1px solid var(--border-strong);
  border-radius: var(--r-md);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
.node.run {
  border-color: var(--accent-border);
  box-shadow: var(--glow, none);
}
.node.gate {
  border-color: var(--human-border);
}
.port {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--border-strong);
  top: 50%;
  transform: translateY(-50%);
}
.port.in { left: -4px; }
.port.out { right: -4px; background: var(--text-3); }
.edge {
  width: 34px;
  height: 2px;
  background: var(--border-strong);
  flex: none;
}
.human-edge {
  background: repeating-linear-gradient(90deg, var(--human) 0 5px, transparent 5px 10px);
}
.surfaces {
  display: flex;
  gap: 8px;
}
.sf {
  flex: 1;
  text-align: center;
  font-size: 11px;
  color: var(--text-3);
  padding: 14px 0;
  border-radius: var(--r-md);
  border: 1px solid var(--border);
}
.s1 { background: var(--surface); }
.s2 { background: var(--surface-2); }
.s3 { background: var(--fill-strong); }
</style>
