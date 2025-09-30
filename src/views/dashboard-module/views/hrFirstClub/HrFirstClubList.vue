<template>
  <PageHeader
    title="List of hr first clubs"
    page="Hr first clubs"
    :rightButton="[{ route: 'hr-first-club.add', label: 'Create' }]"
  />

  <div class="page-body">
    <Table
      :get-data="getHrFirstClubs"
      :data-structure="{
        name: 'Name',
        email: 'Email',
        companyName: 'Company name',
        fuction: 'Function',
        createdAt: 'Created at'
      }"
      :normalizer="(arr: any) => {
          return arr.map((data: any) => {
            return {
              id: data.id,
              name: data.user?.name,
              email: data.user?.email,
              companyName: data.companyName,
              fuction: data.function,
              createdAt: formatDate(data.createdAt),
            }
          })
        }"
      edit-route="hr-first-club.edit"
      :delete-data="deleteHrFirstClub"
    />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';

import { getHrFirstClubs, deleteHrFirstClub } from '../../stores/services/hr-first-club.service';

import { formatDate } from '@/views/dashboard-module/helpers';
</script>
