<template>
  <PageHeader title="Job type" page="Type" :breadcrumbs="[{ label: 'Job', route: 'job' }]" />

  <div class="page-body">
    <div class="row">
      <div class="col-md-4">
        <form class="card" @submit.prevent="save">
          <div class="card-body">
            <TextInput
              label="Name"
              :required="true"
              placeholder="Add job type name"
              class="mb-4"
              v-model="jobType.name"
            />

            <RadioInput
              label="Status"
              v-model="jobType.status"
              :options="[
                { title: 'Public', value: 'public' },
                { title: 'Draft', value: 'draft' },
                { title: 'Blocked', value: 'blocked' }
              ]"
              name="status"
            />
          </div>
          <div class="card-footer d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-danger" :disabled="isSaveLoading" @click="reset">
              Cancel
            </button>
            <SubmitButton :loading="isSaveLoading"> Save </SubmitButton>
          </div>
        </form>
      </div>
      <div class="col-md-8">
        <Table
          :get-data="getData"
          :data-structure="{ name: 'Name', status: 'Status' }"
          :normalizer="(arr: any) => {
                  return arr.map((data: any) => {
                    return {
                      id: data.id,
                      name: data.name,
                      status: data.status
                    }
                  })
                }"
          :edit-action="setCurrent"
          :delete-data="remove"
          :key="tableKey"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import RadioInput from '@/components/inputs/RadioInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import {
  createJobType as create,
  updateJobType as update,
  getJobTypes as getData,
  deleteJobType as remove,
  getJobType as getOne
} from '../../stores/services/job-type.service';

const isSaveLoading = ref(false);
const isDataLoading = ref(false);

const initialValue = {
  id: undefined,
  name: '',
  status: 'public'
};

const jobType = ref(structuredClone(initialValue));

const reset = () => {
  jobType.value = structuredClone(initialValue);
};

const tableKey = ref(0);

const save = async () => {
  isSaveLoading.value = true;

  if (jobType.value.id) {
    const { data } = await update(jobType.value);

    if (data?.result?.id) {
      reset();
      tableKey.value += 1;
    }
  } else {
    const { data } = await create(jobType.value);

    if (data?.result?.id) {
      reset();
      tableKey.value += 1;
    }
  }

  isSaveLoading.value = false;
};

const setCurrent = async (id: string) => {
  isDataLoading.value = true;
  const { data } = await getOne(id);

  if (data?.result) {
    jobType.value = data.result;
  }

  isDataLoading.value = false;
};
</script>

<style scoped lang="scss"></style>
