<template>
  <PageHeader
    title="Application detail"
    page="Detail"
    :breadcrumbs="[
      { label: 'Job', route: 'job.list' },
      { label: 'Application', route: { name: 'job.application', params: { job: jobId } } }
    ]"
  />

  <div class="page-body">
    <div class="card">
      <div class="card-header"><h3 class="card-title">Application content</h3></div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6 mb-4">
            <h4>Job</h4>
            <a :href="jobUrl + application.job.id" target="_blank" rel="noopener noreferrer">{{
              application.job.title
            }}</a>
          </div>
          <div class="col-md-6 mb-4">
            <h4>Talent name</h4>
            <div>{{ application.talent.user.name }}</div>
          </div>
          <div class="col-md-6 mb-4">
            <h4>Talent email</h4>
            <div>{{ application.talent.user.email }}</div>
          </div>
          <div class="col-md-6 mb-4" v-if="application.talent.contact?.phoneNumber">
            <h4>Talent number</h4>
            <div>{{ application.talent.contact?.phoneNumber }}</div>
          </div>
          <div class="col-md-6 mb-4">
            <h4>Status</h4>
            <div>{{ getApplicationStatus(application.status) }}</div>
          </div>
          <div class="col-md-6 mb-4" v-if="application.lm">
            <h4>LM</h4>
            <RouterLink
              :to="{ name: 'lm.pdf', params: { id: application.lm.id } }"
              target="_blank"
              >{{ application.lm.title }}</RouterLink
            >
          </div>
          <div class="col-md-6 mb-4" v-if="application.cv">
            <h4>CV</h4>
            <a
              v-if="application.cv.file?.fileUrl"
              :href="application.cv.file?.fileUrl"
              target="_blank"
            >
              {{ application.cv.title }}
            </a>
            <RouterLink
              v-else
              :to="{ name: 'cv.pdf', params: { id: application.cv.id } }"
              target="_blank"
              >{{ application.cv.title }}</RouterLink
            >
          </div>
          <div class="col-md-6 mb-4">
            <h4>Created at</h4>
            <div>{{ formatDate(application.createdAt) }}</div>
          </div>
          <div class="col-md-6 mb-4" v-if="application.referral && is('admin')">
            <h4>Referral</h4>
            <div>{{ application.referral.user.name }}</div>
          </div>
          <div class="col-md-6 mb-4" v-if="application.referral_recomandation">
            <h4>Recommandateion</h4>
            <div>{{ application.referral_recomandation }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import PageHeader from '@/components/PageHeader.vue';

import { getApplication } from '../../stores/services/application.service';
import { formatDate, getApplicationStatus } from '../../helpers';

import { useAuthStore } from '@/views/auth-module/stores/auth.store';

const authStore = useAuthStore();

const { is } = authStore;

const router = useRouter();
const route = useRoute();

const id = computed(() => route.params.id as string);
const jobId = computed(() => route.params.job as string);

const application = ref<any>((await getApplication(id.value))?.data?.result);

if (!application.value) {
  router.push({ name: 'job.application-in-review' });
}

const jobUrl = import.meta.env.VITE_HOST_URL + '/job/detail/';
</script>

<style scoped></style>
