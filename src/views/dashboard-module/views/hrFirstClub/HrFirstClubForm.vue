<template>
  <PageHeader
    :title="id ? 'Edit hr first club' : 'Add hr first club'"
    :page="id ? 'Edit' : 'Add'"
    :breadcrumbs="[{ label: 'Hr first club', route: 'hr-first-club' }]"
  />

  <div class="page-body">
    <HrFirstClubForm :id="id" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import PageHeader from '@/components/PageHeader.vue';
import HrFirstClubForm from '@/components/forms/HrFirstClubForm.vue';

const route = useRoute();

const id = computed(() => route.params.id as string);
</script>
