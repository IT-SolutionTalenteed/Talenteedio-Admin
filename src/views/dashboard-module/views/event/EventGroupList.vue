<template>
  <PageHeader
    title="Event Groups"
    page="Event Groups"
    :rightButton="[{ route: 'event.group.add', label: 'Create Group' }]"
  />

  <div class="page-body">
    <Table
      :get-data="getData"
      :data-structure="{ 
        name: 'Name', 
        description: 'Description',
        status: 'Status',
        eventsCount: 'Events'
      }"
      :normalizer="(arr: any) => {
        return arr.map((data: any) => {
          return {
            id: data.id,
            name: data.name,
            description: data.description?.substring(0, 100) + (data.description?.length > 100 ? '...' : ''),
            status: data.status,
            eventsCount: data.events?.length || 0
          }
        })
      }"
      edit-route="event.group.edit"
      :delete-data="deleteEventGroup"
    />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';

import { getEventGroups, deleteEventGroup } from '../../stores/services/event-group.service';

const getData = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string
) => {
  return await getEventGroups(limit, page, search, status);
};
</script>
