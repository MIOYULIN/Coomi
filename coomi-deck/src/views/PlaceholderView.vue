<script setup lang="ts">
const props = defineProps<{ points?: string[] }>()
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1 class="page-title">{{ $route.meta.title }}</h1>
        <div class="page-sub">本页面将在第 4 轮「关键界面」逐个细化</div>
      </div>
    </div>
    <div class="card placeholder">
      <div class="badge b-accent">规划中</div>
      <ul v-if="$route.meta.points" class="points">
        <li v-for="p in ($route.meta.points as string[])" :key="p">{{ p }}</li>
      </ul>
      <p class="note">骨架、导航与主题系统已就位，可先体验四套主题下的整体气质。</p>
    </div>
  </div>
</template>

<style scoped>
.placeholder {
  padding: 28px;
}
.points {
  margin: 16px 0 0;
  padding-left: 18px;
  color: var(--text-2);
  font-size: 13px;
  line-height: 2;
}
.note {
  margin: 18px 0 0;
  color: var(--text-3);
  font-size: 12px;
}
</style>
