<template>
  <PageHeader
    title="List of events"
    page="Events"
    :rightButton="[{ route: 'event.add', label: 'Create' }]"
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
      edit-route="event.edit"
      :delete-data="deleteEvent"
    />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';

import { getEvents, deleteEvent } from '../../stores/services/event.service';

const getData = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string
) => {
  return await getEvents(limit, page, search, status);
};
</script>
