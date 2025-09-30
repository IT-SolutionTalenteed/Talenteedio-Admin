<template>
  <PageHeader
    title="List of companies"
    page="Companies"
    :rightButton="[{ route: 'company.add', label: 'Create' }]"
  />

  <div class="page-body">
    <Table
      :get-data="getCompanies"
      :data-structure="{ name: 'Name', email: 'Email', createdAt: 'Created at' }"
      :normalizer="(arr: any) => {
          return arr.map((data: any) => {
            return {
              id: data.id,
              name: data.company_name,
              email: data.contact?.email,
              createdAt: formatDate(data.createdAt),
            }
          })
        }"
      edit-route="company.edit"
      :delete-data="deleteCompany"
    />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';

import { getCompanies, deleteCompany } from '../../stores/services/company.service';

import { formatDate } from '@/views/dashboard-module/helpers';
</script>
