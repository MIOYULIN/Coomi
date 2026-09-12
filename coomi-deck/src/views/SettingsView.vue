<script setup lang="ts">
import { Check, MonitorSmartphone, Keyboard, RefreshCw, Bell, SlidersHorizontal } from 'lucide-vue-next'
import { useUiStore, THEMES } from '@/stores/ui'

const ui = useUiStore()

const upcoming = [
  { icon: SlidersHorizontal, label: '通用', desc: '密度、语言、启动行为' },
  { icon: RefreshCw, label: 'CoomiLink 同步', desc: 'Git 私有仓库 / 自建 NAS，冲突提示' },
  { icon: Keyboard, label: '快捷键', desc: '全局快捷键与键盘流自定义' },
  { icon: Bell, label: '通知', desc: '打扰策略：什么值得打断你' },
]
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1 class="page-title">设置</h1>
        <div class="page-sub">外观已可用，其余板块第 4 轮细化</div>
      </div>
    </div>

    <section class="section">
      <div class="section-label">外观 · 四套主题原型</div>
      <div class="themes">
        <button
          v-for="t in THEMES"
          :key="t.id"
          class="theme-card card"
          :class="{ on: ui.theme === t.id }"
          @click="ui.setTheme(t.id)"
        >
          <span class="preview" :style="{ background: t.bg }">
            <i class="bar" :style="{ background: t.accent }" />
            <i class="bar short" :style="{ background: t.human }" />
            <i class="block" :style="{ borderColor: t.accent }" />
          </span>
          <span class="t-row">
            <span class="t-name">{{ t.name }}</span>
            <Check v-if="ui.theme === t.id" :size="14" class="t-check" />
          </span>
          <span class="t-desc">{{ t.desc }}</span>
        </button>
      </div>
      <p class="hint">
        <MonitorSmartphone :size="13" />
        「蓝白」与 Coomi Android 移动端的设计令牌逐值对齐：#2d61c6 品牌蓝、#d47458 点缀橙、16px 卡片圆角与药丸按钮。
      </p>
    </section>

    <section class="section">
      <div class="section-label">即将推出</div>
      <div class="upcoming">
        <div v-for="u in upcoming" :key="u.label" class="up card">
          <component :is="u.icon" :size="15" class="up-ic" />
          <div>
            <div class="up-label">{{ u.label }}</div>
            <div class="up-desc">{{ u.desc }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.section {
  margin-bottom: 26px;
}
.section .section-label {
  display: block;
  margin-bottom: 12px;
}
.themes {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.theme-card {
  padding: 12px;
  cursor: pointer;
  text-align: left;
  font-family: var(--font-ui);
  transition: border-color var(--dur-1) var(--ease), box-shadow var(--dur-1) var(--ease);
}
.theme-card:hover {
  border-color: var(--border-strong);
}
.theme-card.on {
  border-color: var(--accent-border);
  box-shadow: var(--ring);
}
.preview {
  display: block;
  height: 64px;
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
  padding: 10px;
}
.preview .bar {
  display: block;
  height: 6px;
  width: 60%;
  border-radius: 99px;
  margin-bottom: 6px;
}
.preview .bar.short {
  width: 38%;
}
.preview .block {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 22px;
  height: 14px;
  border: 1.5px solid;
  border-radius: 4px;
  background: transparent;
}
.t-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
}
.t-name {
  font-weight: 600;
  font-size: 13px;
  color: var(--text);
}
.t-check {
  color: var(--accent);
}
.t-desc {
  display: block;
  font-size: 11px;
  color: var(--text-3);
  margin-top: 3px;
  line-height: 1.5;
}
.hint {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 12px 0 0;
  font-size: 12px;
  color: var(--text-3);
}
.upcoming {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.up {
  display: flex;
  gap: 11px;
  align-items: flex-start;
  padding: 14px 16px;
}
.up-ic {
  color: var(--text-3);
  margin-top: 2px;
  flex: none;
}
.up-label {
  font-weight: 600;
  font-size: 13px;
}
.up-desc {
  font-size: 12px;
  color: var(--text-3);
  margin-top: 2px;
}
</style>
