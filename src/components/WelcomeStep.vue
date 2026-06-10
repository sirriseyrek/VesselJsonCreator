<template>
  <main class="card welcome-card">
    <h1 class="welcome-title">{{ t('welcome') }}</h1>
    <button class="action-btn" @click="$emit('next')">
      {{ t('startBtn') }}
    </button>
  </main>
</template>

<script setup>
defineProps(['t'])
defineEmits(['next'])
</script>

<style scoped>
.welcome-card { text-align: center; }
.welcome-title { font-size: 2.5rem; margin-bottom: 30px; color: #ffffff; }
</style>