<template>
  <PageHeader
    title="Company permision"
    page="Permission"
    :breadcrumbs="[{ label: 'Company', route: 'company' }]"
  />

  <div class="page-body">
    <div class="row">
      <div class="col-md-4">
        <form class="card" @submit.prevent="save">
          <div class="card-body">
            <TextInput
              label="Title"
              :required="true"
              placeholder="Add permission Title"
              class="mb-4"
              v-model="permission.title"
            />
            <TextInput
              label="Number of job per year"
              :required="true"
              placeholder="Add number of job per year"
              class="mb-4"
              v-model="permission.numberOfJobsPerYear"
              type="number"
            />
            <TextInput
              label="Number of article per year"
              :required="true"
              placeholder="Add number of article per year"
              class="mb-4"
              v-model="permission.numberOfArticlesPerYear"
              type="number"
            />
            <TextInput
              label="Job validity (in days)"
              :required="true"
              placeholder="Add job validity days"
              class="mb-4"
              v-model="permission.validityPeriodOfAJob"
              type="number"
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
          :data-structure="{ title: 'Title' }"
          :normalizer="(arr: any) => {
                return arr.map((data: any) => {
                  return {
                    id: data.id,
                    title: data.title,
                  }
                })
              }"
          :edit-action="setCurrent"
          :delete-data="removeData"
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
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import {
  createPermission as create,
  updatePermission as update,
  getPermissions as getData,
  deletePermission as remove,
  getPermission as getOne
} from '../../stores/services/company-permission.service';

const isSaveLoading = ref(false);
const isDataLoading = ref(false);

const initialValue = {
  id: undefined,
  title: '',
  numberOfJobsPerYear: undefined,
  numberOfArticlesPerYear: undefined,
  validityPeriodOfAJob: undefined
};

const permission = ref(structuredClone(initialValue));

const reset = () => {
  permission.value = structuredClone(initialValue);
};

const tableKey = ref(0);

const save = async () => {
  isSaveLoading.value = true;

  if (permission.value.id) {
    const { data } = await update(permission.value);

    if (data?.result?.id) {
      reset();
      tableKey.value += 1;
    }
  } else {
    const { data } = await create(permission.value);

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
    permission.value = data.result;
  }

  isDataLoading.value = false;
};

const removeData = async (id?: string) => {
  await remove(id);
  reset();
};
</script>

<style scoped lang="scss"></style>
