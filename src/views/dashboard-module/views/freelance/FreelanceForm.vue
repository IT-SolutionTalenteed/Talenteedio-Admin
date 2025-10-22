<template>
  <PageHeader
    :title="id ? 'Edit freelance' : 'Add freelance'"
    :page="id ? 'Edit' : 'Add'"
    :breadcrumbs="[{ label: 'Freelance', route: 'freelance' }]"
  />

  <div class="page-body">
    <FreelanceForm :id="id" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import PageHeader from '@/components/PageHeader.vue';
import FreelanceForm from '@/components/forms/FreelanceForm.vue';

const route = useRoute();

const id = computed(() => route.params.id as string);
</script>
