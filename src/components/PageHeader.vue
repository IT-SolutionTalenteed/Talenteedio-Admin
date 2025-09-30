<template>
  <!-- Page Header -->
  <div class="page-header d-print-none">
    <div class="row g-2 align-items-center">
      <div class="col">
        <!-- Page pre-title -->
        <div class="d-flex">
          <div class="breadcrumb-item" v-for="breadcrumb in breadcrumbs" :key="breadcrumb.label">
            <RouterLink
              v-if="breadcrumb.route"
              :to="
                typeof breadcrumb.route === 'object' ? breadcrumb.route : { name: breadcrumb.route }
              "
              class="breadcrumb-link"
            >
              {{ breadcrumb.label }}
            </RouterLink>

            <a v-else class="breadcrumb-link" href="javascript:;">
              {{ breadcrumb.label }}
            </a>
          </div>

          <div class="breadcrumb-item active" aria-current="page">
            <span>{{ page }}</span>
          </div>
        </div>

        <h2 class="page-title">{{ title }}</h2>
      </div>

      <!-- Page title actions -->
      <div class="col-auto ms-auto d-print-none">
        <template v-for="btn in rightButton" :key="btn.label">
          <RouterLink
            v-if="btn.route"
            :to="typeof btn.route === 'object' ? btn.route : { name: btn.route }"
            :class="btn.className ? btn.className : 'btn btn-primary'"
            class="me-2 my-2"
          >
            <i class="me-2 fs-4" :class="btn.icon ? btn.icon : 'bi bi-plus'"></i>
            {{ btn.label }}
          </RouterLink>
          <button
            v-else
            :class="btn.className ? btn.className : 'btn btn-primary'"
            class="me-2 my-2"
            @click="() => btn.action && btn.action()"
          >
            <i class="me-2 fs-4" :class="btn.icon ? btn.icon : 'bi bi-plus'"></i>
            {{ btn.label }}
          </button>
        </template>
      </div>
    </div>
  </div>
  <!-- End Page Header -->
</template>

<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';

interface Link {
  route?: RouteLocationRaw;
  label: string;
  icon?: string;
  action?: Function;
  className?: string;
}

interface Props {
  breadcrumbs?: Link[];
  title: string;
  page: string | string[];
  rightButton?: Link[];
  tabs?: Link[];
}

withDefaults(defineProps<Props>(), {
  breadcrumbs: () => [],
  tabs: () => []
});
</script>

<style lang="scss" scoped>
.breadcrumb-item + .breadcrumb-item::before {
  float: left;
  padding: 0 5px;
  content: '/';
}
</style>
