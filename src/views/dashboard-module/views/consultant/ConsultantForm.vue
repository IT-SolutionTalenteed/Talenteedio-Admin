<template>
  <PageHeader
    :title="id ? 'Edit consultant' : 'Add consultant'"
    :page="id ? 'Edit' : 'Add'"
    :breadcrumbs="[{ label: 'Consultant', route: 'consultant' }]"
  />

  <div class="page-body">
    <ConsultantForm :id="id" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import PageHeader from '@/components/PageHeader.vue';
import ConsultantForm from '@/components/forms/ConsultantForm.vue';

const route = useRoute();

const id = computed(() => route.params.id as string);
</script>
