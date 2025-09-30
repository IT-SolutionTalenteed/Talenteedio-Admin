<template>
  <PageHeader
    :title="id ? 'Edit user' : 'Add user'"
    :page="id ? 'Edit' : 'Add'"
    :breadcrumbs="[{ label: 'User', route: 'user' }]"
  />

  <div class="page-body">
    <UserForm :id="id" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import PageHeader from '@/components/PageHeader.vue';
import UserForm from '@/components/forms/UserForm.vue';

const route = useRoute();

const id = computed(() => route.params.id as string);
</script>
