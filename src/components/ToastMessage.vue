<template>
  <div class="toast-msg" v-if="message">{{ message }}</div>
</template>

<script setup>
defineProps(['message'])
</script>

<style scoped>
.toast-msg {
  position: absolute; bottom: 30px; background-color: #4fc08d; color: #121212;
  padding: 12px 24px; border-radius: 8px; font-weight: 600;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: slideUp 0.3s ease-out;
  text-align: center; max-width: 90%;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>