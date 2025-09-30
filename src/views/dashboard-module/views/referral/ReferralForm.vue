<template>
  <PageHeader
    :title="id ? 'Edit referral' : 'Add referral'"
    :page="id ? 'Edit' : 'Add'"
    :breadcrumbs="[{ label: 'Referral', route: 'referral' }]"
  />

  <div class="page-body">
    <ReferralForm :id="id" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import PageHeader from '@/components/PageHeader.vue';
import ReferralForm from '@/components/forms/ReferralForm.vue';

const route = useRoute();

const id = computed(() => route.params.id as string);
</script>
