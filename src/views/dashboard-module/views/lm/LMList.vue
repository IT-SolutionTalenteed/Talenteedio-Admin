<template>
  <PageHeader
    title="List of lms"
    page="LMs"
    :breadcrumbs="is('talent') ? [] : [{ label: 'Talents', route: 'talent' }]"
    :rightButton="is('talent') ? [{ route: 'lm.add', label: 'Create' }] : []"
  />

  <div class="page-body">
    <Table
      :get-data="getData"
      :data-structure="{ title: 'Title', createdAt: 'Created at' }"
      :normalizer="(arr: any) => {
          return arr.map((data: any) => {
            return {
              id: data.id,
              title: data.title,
              createdAt: formatDate(data.createdAt),
            }
          })
        }"
      edit-route="lm.edit"
      :delete-data="deleteLM"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';

import { getLMs, deleteLM } from '../../stores/services/lm.service';

import { useAuthStore } from '@/views/auth-module/stores/auth.store';

import { formatDate } from '@/views/dashboard-module/helpers';

const authStore = useAuthStore();

const { is } = authStore;

const getData = async (limit: number | null, page: number | null, search: string | null) => {
  return await getLMs(limit, page, search, useRoute()?.query?.talent_id as string | undefined);
};
</script>
