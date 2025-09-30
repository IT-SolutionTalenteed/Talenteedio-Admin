<template>
  <PageHeader
    title="List of applications"
    page="Application"
    :breadcrumbs="[{ label: 'Job', route: 'job.list' }]"
  />

  <div class="page-body">
    <Table
      :get-data="getData"
      :data-structure="{
        talent: 'Talent',
        referral: 'Referral',
        status: 'Status',
        createdAt: 'Created at'
      }"
      :normalizer="(arr: any) => {
            return arr.map((data: any) => {
              return {
                id: data.id,
                talent: data.talent?.user?.name ?? data.talent?.user?.email,
                referral: data.referral?.user?.name ?? data.referral?.user?.email,
                status: getApplicationStatus(data.status),
                createdAt: formatDate(data.createdAt),
              }
            })
          }"
      edit-route="job.application.detail"
      :delete-data="deleteApplication"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';

import { getApplications, deleteApplication } from '../../stores/services/application.service';
import { getApplicationStatus, formatDate } from '../../helpers';

const route = useRoute();

const jobId = computed(() => route.params.job as string);

const getData = async (limit: number | null, page: number | null) => {
  return await getApplications(limit, page, undefined, jobId.value);
};
</script>
