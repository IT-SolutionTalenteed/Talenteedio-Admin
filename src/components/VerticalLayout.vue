<template>
  <Aside />

  <div class="page-wrapper" :key="route.fullPath">
    <div class="page-content container-xl d-flex flex-column flex-grow-1">
      <Suspense @resolve="isLoading = false">
        <RouterView />

        <template #fallback>
          <Loader />
        </template>
      </Suspense>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

import Aside from '@/components/Aside.vue';
import Footer from '@/components/Footer.vue';
import Loader from '@/components/Loader.vue';

import useGlobalStore from '@/stores/global.store';

const globalStore = useGlobalStore();
const { isLoading } = storeToRefs(globalStore);

const route = useRoute();

isLoading.value = true;
</script>

<style lang="scss">
.page-wrapper,
.page-content {
  height: 100%;
  overflow: hidden;

  .page-body {
    overflow: hidden auto;

    .card.flex-grow-1 {
      overflow: hidden auto;
    }

    .row.flex-grow-1 {
      overflow: hidden;

      .col-md-8,
      .col-md-4 {
        overflow: auto;
        height: 100%;
      }
    }
  }
}

.page-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

@media (min-width: 992px) {
  .navbar-expand-lg.navbar-vertical ~ .navbar,
  .navbar-expand-lg.navbar-vertical ~ .page-wrapper {
    margin-left: 18rem;
  }
  .navbar-vertical.navbar-expand-lg {
    width: 18rem;
  }
}
</style>
