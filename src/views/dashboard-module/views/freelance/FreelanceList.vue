<template>
  <PageHeader
    title="List of freelances"
    page="Freelances"
    :rightButton="[{ route: 'freelance.add', label: 'Create' }]"
  />

  <div class="page-body">
    <Table
      :get-data="getFreelances"
      :data-structure="{ name: 'Name', email: 'Email', title: 'Title', createdAt: 'Created at' }"
      :normalizer="(arr: any) => {
          return arr.map((data: any) => {
            return {
              id: data.id,
              name: data.user?.name,
              email: data.user?.email,
              title: data.title,
              createdAt: formatDate(data.createdAt),
            }
          })
        }"
      edit-route="freelance.edit"
      cv-route="cv"
      lm-route="lm"
      :delete-data="deleteFreelance"
    />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';

import { getFreelances, deleteFreelance } from '../../stores/services/freelance.service';

import { formatDate } from '@/views/dashboard-module/helpers';
</script>
