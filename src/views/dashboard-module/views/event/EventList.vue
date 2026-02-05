<template>
  <PageHeader
    title="List of events"
    page="Events"
    :rightButton="is('admin') || is('company') ? [{ route: 'event.add', label: 'Create' }] : []"
  />

  <div class="page-body">
    <Table
      :get-data="getData"
      :data-structure="{ title: 'Title', company: 'Company', date: 'Date', status: 'Status' }"
      :normalizer="(arr: any) => {
        return arr.map((data: any) => {
          return {
            id: data.id,
            title: data.title,
            company: data.company?.company_name || 'Admin',
            date: data.date,
            status: data.status,
          }
        })
      }"
      :edit-route="is('admin') || is('company') ? 'event.edit' : ''"
      :can-delete="is('admin') || is('company')"
      :delete-data="deleteEvent"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';

import { getEvents, deleteEvent } from '../../stores/services/event.service';
import { useAuthStore } from '@/views/auth-module/stores/auth.store';

const authStore = useAuthStore();
const { is } = authStore;
const { user } = storeToRefs(authStore);

const getData = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string
) => {
  return await getEvents(
    limit, 
    page, 
    search, 
    status,
    is('company') ? user.value!.company!.id : undefined
  );
};
</script>
