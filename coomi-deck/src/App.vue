<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useDataStore } from '@/stores/data'
import StatusBar from '@/components/StatusBar.vue'
import SideNav from '@/components/SideNav.vue'
import CoomiPanel from '@/components/CoomiPanel.vue'
import CommandPalette from '@/components/CommandPalette.vue'

const ui = useUiStore()
const data = useDataStore()

function onKey(e: KeyboardEvent) {
  const mod = e.metaKey || e.ctrlKey
  if (mod && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    ui.togglePalette()
  } else if (mod && e.key.toLowerCase() === 'j') {
    e.preventDefault()
    ui.togglePanel()
  } else if (e.key === 'Escape' && ui.paletteOpen) {
    ui.paletteOpen = false
  }
}

let timer: number | undefined
onMounted(() => {
  ui.setTheme(ui.theme)
  window.addEventListener('keydown', onKey)
  timer = window.setInterval(() => data.tick(), 2400)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  window.clearInterval(timer)
})
</script>

<template>
  <div class="shell">
    <StatusBar />
    <div class="body">
      <SideNav />
      <main class="main">
        <router-view v-slot="{ Component }">
          <component :is="Component" :key="$route.fullPath" />
        </router-view>
      </main>
      <CoomiPanel v-if="!ui.panelHidden" />
    </div>
    <CommandPalette v-if="ui.paletteOpen" />
  </div>
</template>

<style scoped>
.shell {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.body {
  flex: 1;
  display: flex;
  min-height: 0;
}
.main {
  flex: 1;
  min-width: 0;
  background: var(--bg);
}
</style>
