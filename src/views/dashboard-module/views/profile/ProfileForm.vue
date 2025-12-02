<template>
  <PageHeader title="Profile" page="Profile" />

  <div class="page-body">
    <UserForm :id="user!.id" class="mb-4" />
    <CompanyForm v-if="is('company')" :id="user!.company!.id" />
    <ReferralForm v-if="is('referral')" :id="user!.referral!.id" />
    <TalentForm v-if="is('talent')" :id="user!.talent!.id" />
    <ConsultantForm v-if="is('consultant')" :id="user!.consultant!.id" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import PageHeader from '@/components/PageHeader.vue';
import UserForm from '@/components/forms/UserForm.vue';
import CompanyForm from '@/components/forms/CompanyForm.vue';
import ReferralForm from '@/components/forms/ReferralForm.vue';
import TalentForm from '@/components/forms/TalentForm.vue';
import ConsultantForm from '@/components/forms/ConsultantForm.vue';

import { useAuthStore } from '@/views/auth-module/stores/auth.store';

const authStore = useAuthStore();
const { is } = authStore;
const { user } = storeToRefs(authStore);
</script>

<style scoped></style>
