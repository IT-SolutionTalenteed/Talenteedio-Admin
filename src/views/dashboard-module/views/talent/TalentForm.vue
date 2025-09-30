<template>
  <PageHeader
    :title="id ? 'Edit talent' : 'Add talent'"
    :page="id ? 'Edit' : 'Add'"
    :breadcrumbs="[{ label: 'Talent', route: 'talent' }]"
  />

  <div class="page-body">
    <TalentForm :id="id" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import PageHeader from '@/components/PageHeader.vue';
import TalentForm from '@/components/forms/TalentForm.vue';

const route = useRoute();

const id = computed(() => route.params.id as string);
</script>
