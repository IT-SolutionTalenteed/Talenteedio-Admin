<template>
  <PageHeader title="Value" page="Value" />

  <div class="page-body">
    <div class="row flex-grow-1">
      <div class="col-md-4">
        <form class="card" @submit.prevent="save">
          <div class="card-body">
            <TextInput
              label="Title"
              :required="true"
              placeholder="Add value title"
              class="mb-4"
              v-model="value.title"
            />

            <RadioInput
              label="Status"
              v-model="value.status"
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
      <div class="col-md-8 d-flex">
        <Table
          :get-data="getData"
          :data-structure="{ title: 'Title', status: 'Status' }"
          :normalizer="(arr: any) => {
                return arr.map((data: any) => {
                  return {
                    id: data.id,
                    title: data.title,
                    status: data.status
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
import RadioInput from '@/components/inputs/RadioInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import {
  createValue as create,
  updateValue as update,
  getValues as getData,
  deleteValue as remove,
  getValue as getOne
} from '../../stores/services/value.service';

const isSaveLoading = ref(false);
const isDataLoading = ref(false);

const initialValue = {
  id: undefined,
  title: '',
  status: 'public'
};

const value = ref(structuredClone(initialValue));

const reset = () => {
  value.value = structuredClone(initialValue);
};

const tableKey = ref(0);

const save = async () => {
  isSaveLoading.value = true;

  if (value.value.id) {
    const { data } = await update(value.value);

    if (data?.result?.id) {
      reset();
      tableKey.value += 1;
    }
  } else {
    const { data } = await create(value.value);

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
    value.value = data.result;
  }

  isDataLoading.value = false;
};

const removeData = async (id?: string) => {
  await remove(id);
  reset();
};
</script>

<style scoped lang="scss"></style>
