<template>
  <div
    class="modal modal-blur fade"
    id="update-modal"
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
      <form class="modal-content" @submit.prevent="updateJobs">
        <div class="modal-body">
          <div class="modal-title">Update jobs</div>
          <DateInput
            label="Expiration date"
            :required="true"
            placeholder="Expiration date"
            v-model="expirationDate"
          />
        </div>
        <div class="modal-footer">
          <button
            ref="cancelBtn"
            type="button"
            class="btn btn-secondary me-auto"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <SubmitButton
            class="btn btn-danger"
            :loading="isUpdateLoading"
            :disabled="isUpdateLoading"
            >Confirm</SubmitButton
          >
        </div>
      </form>
    </div>
  </div>

  <PageHeader
    title="List of jobs"
    page="Jobs"
    :rightButton="is('admin') || is('company') ? [{ route: 'job.add', label: 'Create' }] : []"
  />

  <div class="page-body">
    <Table
      :get-data="getData"
      :data-structure="{
        title: 'Title',
        status: 'Status',
        owner: 'Owner',
        url: 'Link',
        updatedAt: 'Updated at'
      }"
      :normalizer="(arr: any) => {
        return arr.map((data: any) => {
          return {
            id: data.id,
            title: data.title,
            status: data.status,
            owner: data.company?.user?.email,
            updatedAt: formatDate(data.updatedAt),
            url: `${hostUrl}/job/detail/${data.slug}`,
          }
        })
      }"
      :edit-route="is('admin') || is('company') ? 'job.edit' : ''"
      :can-delete="is('admin')"
      application-route="job.application"
      :delete-data="deleteJob"
      :actions="[
        {
          label: 'Update',
          'data-bs-toggle': 'modal',
          'data-bs-target': '#update-modal'
        }
      ]"
      v-model:includedIds="includedIds"
      v-model:excludedIds="excludedIds"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { VNodeRef } from 'vue';
import { storeToRefs } from 'pinia';

import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import { getJobs, deleteJob, updateMultipleJobs } from '../../stores/services/job.service';

import { useAuthStore } from '@/views/auth-module/stores/auth.store';

import { formatDate } from '@/views/dashboard-module/helpers';
import DateInput from '@/components/inputs/DateInput.vue';

const hostUrl = import.meta.env.VITE_HOST_URL;

const authStore = useAuthStore();
const { is } = authStore;
const { user } = storeToRefs(authStore);

const getData = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string
) => {
  return await getJobs(
    limit,
    page,
    search,
    status,
    is('company') ? user.value!.company!.id : undefined
  );
};

const includedIds = ref([]);
const excludedIds = ref([]);
const expirationDate = ref('');

const isUpdateLoading = ref(false);

const updateJobs = async () => {
  isUpdateLoading.value = true;

  await updateMultipleJobs({
    expirationDate: expirationDate.value,
    includedIds: includedIds.value,
    excludedIds: excludedIds.value
  });

  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });

  cancelBtn.value.dispatchEvent(event);

  includedIds.value = [];
  excludedIds.value = [];

  isUpdateLoading.value = false;
};

const cancelBtn = ref<VNodeRef | undefined>(undefined);
</script>
