<template>
  <GlobalLoader v-if="isLoading" />

  <Suspense>
    <RouterView />
  </Suspense>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import GlobalLoader from '@/components/GlobalLoader.vue';

import useGlobalStore from '@/stores/global.store';

const globalStore = useGlobalStore();
const { isLoading } = storeToRefs(globalStore);
</script>
