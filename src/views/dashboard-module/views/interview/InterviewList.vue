<template>
  <PageHeader
    title="List of interviews"
    page="Interviews"
    :rightButton="[{ route: 'interview.add', label: 'Create' }]"
  />

  <div class="page-body">
    <Table
      :get-data="getData"
      :data-structure="{ title: 'Title', date: 'Date', status: 'Status' }"
      :normalizer="(arr: any) => {
        return arr.map((data: any) => {
          return {
            id: data.id,
            title: data.title,
            date: data.date,
            status: data.status,
          }
        })
      }"
      edit-route="interview.edit"
      :delete-data="deleteInterview"
    />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';

import { getInterviews, deleteInterview } from '../../stores/services/interview.service';

const getData = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string
) => {
  return await getInterviews(limit, page, search, status);
};
</script>
