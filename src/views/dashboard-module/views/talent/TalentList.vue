<template>
  <PageHeader
    title="List of talents"
    page="Talents"
    :rightButton="[{ route: 'talent.add', label: 'Create' }]"
  />

  <div class="page-body">
    <Table
      :get-data="getTalents"
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
      edit-route="talent.edit"
      cv-route="cv"
      lm-route="lm"
      :delete-data="deleteTalent"
    />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';

import { getTalents, deleteTalent } from '../../stores/services/talent.service';

import { formatDate } from '@/views/dashboard-module/helpers';
</script>
