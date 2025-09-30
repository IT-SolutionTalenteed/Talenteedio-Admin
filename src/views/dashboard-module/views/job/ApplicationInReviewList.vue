<template>
  <PageHeader title="List of applications" page="Applications" />

  <div class="page-body">
    <Table
      :get-data="getData"
      :data-structure="{
        jobTitle: 'Job title',
        talent: 'Talent',
        referral: 'Referral',
        createdAt: 'Created at'
      }"
      :normalizer="(arr: any) => {
          return arr.map((data: any) => {
            return {
              id: data.id,
              jobTitle: data.job.title,
              talent: data.talent?.user?.name ?? data.talent?.user?.email,
              referral: data.referral?.user?.name ?? data.referral?.user?.email,
              createdAt: formatDate(data.createdAt),
            }
          })
        }"
      edit-route="job.application-in-review.detail"
      :delete-data="deleteApplication"
    />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';

import { getApplications, deleteApplication } from '../../stores/services/application.service';

import { formatDate } from '@/views/dashboard-module/helpers';

const getData = async (limit: number | null, page: number | null) => {
  return await getApplications(limit, page, 'in_review');
};
</script>
