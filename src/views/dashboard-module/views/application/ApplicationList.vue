<template>
  <PageHeader title="List of applications" page="Application" />

  <div class="page-body">
    <Table
      :get-data="getData"
      :data-structure="{
        jobTitle: 'Job title',
        ...(is('referral') ? { talent: 'Talent' } : {}),
        ...(is('talent') ? { referral: 'Referral' } : {}),
        status: 'Status',
        createdAt: 'Created at'
      }"
      :normalizer="(arr: any) => {
            return arr.map((data: any) => {
              return {
                id: data.id,
                jobTitle: data.job.title,
                talent: data.talent?.user?.name ?? data.talent?.user?.email,
                referral: data.referral?.user?.name ?? data.referral?.user?.email,
                status: getApplicationStatus(data.status),
                createdAt: formatDate(data.createdAt),
              }
            })
          }"
      edit-route="application.detail"
      :delete-data="deleteApplication"
    />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';

import { getApplications, deleteApplication } from '../../stores/services/application.service';
import { getApplicationStatus, formatDate } from '../../helpers';

import { useAuthStore } from '@/views/auth-module/stores/auth.store';

const authStore = useAuthStore();

const { is } = authStore;

const getData = async (limit: number | null, page: number | null) => {
  return await getApplications(limit, page);
};
</script>
