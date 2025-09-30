<template>
  <PageHeader title="Reference" page="Reference" />

  <div class="page-body">
    <Table
      :get-data="getData"
      :data-structure="{
        talentEmail: 'Talent email',
        talentFullName: 'Talent full name',
        job: 'Job',
        referral: 'Referral full name',
        createdAt: 'Created at'
      }"
      :normalizer="(arr: any) =>
        { return arr.map((data: any) => { return { id: data.id, talentEmail: data.talentEmail,
        talentFullName: data.talentFullName, referral: `${data.referral.user.firstname}
        ${data.referral.user.lastname}`, job: data.job.title, createdAt: formatDate(data.createdAt) } }) }"
      :key="tableKey"
      :canDelete="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';

import { getReferreds as getData } from '../../stores/services/referred.service';
import { formatDate } from '@/views/dashboard-module/helpers';

const tableKey = ref(0);
</script>

<style scoped lang="scss"></style>
