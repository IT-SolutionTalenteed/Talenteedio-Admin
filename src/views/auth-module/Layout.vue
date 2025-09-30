<template>
  <div class="page page-center">
    <div class="container container-tight py-4">
      <div class="text-center mb-4">
        <a href="." class="navbar-brand navbar-brand-autodark"
          ><img src="/talenteed.png" height="50" alt=""
        /></a>
      </div>
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import useGlobalStore from '@/stores/global.store';

const globalStore = useGlobalStore();
const { isLoading } = storeToRefs(globalStore);

onMounted(() => {
  isLoading.value = false;
});
</script>

<style scoped lang="scss"></style>
