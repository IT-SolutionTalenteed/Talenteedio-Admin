<template>
  <PageHeader
    :title="id ? 'Edit company' : 'Add company'"
    :page="id ? 'Edit' : 'Add'"
    :breadcrumbs="[{ label: 'Company', route: 'company' }]"
  />

  <div class="page-body">
    <CompanyForm :id="id" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import PageHeader from '@/components/PageHeader.vue';
import CompanyForm from '@/components/forms/CompanyForm.vue';

const route = useRoute();

const id = computed(() => route.params.id as string);
</script>
