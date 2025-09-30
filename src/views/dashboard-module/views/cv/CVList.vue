<template>
  <PageHeader
    title="List of cvs"
    page="CVs"
    :breadcrumbs="is('talent') ? [] : [{ label: 'Talents', route: 'talent' }]"
    :rightButton="is('talent') ? [{ route: 'cv.add', label: 'Create' }] : []"
  />

  <div class="page-body">
    <Table
      :get-data="getData"
      :data-structure="{ title: 'Title', type: 'Type', createdAt: 'Created at' }"
      :normalizer="(arr: any) => {
          return arr.map((data: any) => {
            return {
              id: data.id,
              title: data.title,
              downloadUrl: data.file?.fileUrl,
              type: data.file?.fileUrl ? 'Custom CV' : 'Solution Talenteed CV',
              createdAt: formatDate(data.createdAt),
            }
          })
        }"
      edit-route="cv.edit"
      :delete-data="deleteCV"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';

import { getCVs, deleteCV } from '../../stores/services/cv.service';

import { useAuthStore } from '@/views/auth-module/stores/auth.store';

import { formatDate } from '@/views/dashboard-module/helpers';

const authStore = useAuthStore();

const { is } = authStore;

const getData = async (limit: number | null, page: number | null, search: string | null) => {
  return await getCVs(limit, page, search, useRoute()?.query?.talent_id as string | undefined);
};
</script>
