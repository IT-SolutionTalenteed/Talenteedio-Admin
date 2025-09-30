<template>
  <PageHeader
    :title="`${model} category`"
    page="Category"
    :breadcrumbs="[{ label: model, route: model.toLocaleLowerCase() }]"
  />

  <div class="page-body">
    <div class="row flex-grow-1">
      <div class="col-md-4">
        <form class="card" @submit.prevent="save">
          <div class="card-body">
            <TextInput
              label="Name"
              :required="true"
              placeholder="Add category name"
              class="mb-4"
              v-model="category.name"
            />
            <TextInput
              label="Slug"
              :required="true"
              placeholder="Add category slug"
              class="mb-4"
              v-model="category.slug"
              disabled
            />
            <RadioInput
              label="Status"
              v-model="category.status"
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
          :data-structure="{ name: 'Name', slug: 'Slug', status: 'Status' }"
          :normalizer="(arr: any) => {
            return arr.map((data: any) => {
              return {
                id: data.id,
                name: data.name,
                slug: data.slug,
                status: data.status
              }
            })
          }"
          :edit-action="setCurrentCategory"
          :delete-data="removeData"
          :key="tableKey"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import RadioInput from '@/components/inputs/RadioInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import {
  createCategory,
  updateCategory,
  getCategories,
  deleteCategory,
  getCategory
} from '../stores/services/category.service';

import { createSafeUrlFromTitle } from '@/utils/helpers';

interface Props {
  model: string;
}

const props = defineProps<Props>();

const isSaveLoading = ref(false);
const isDataLoading = ref(false);

const initialValue = {
  id: undefined,
  name: '',
  slug: '',
  status: 'public',
  model: props.model
};

const category = ref(structuredClone(initialValue));

watch(
  category,
  () => {
    category.value.slug = createSafeUrlFromTitle(category.value!.name);
  },
  { immediate: true, deep: true }
);

const reset = () => {
  category.value = structuredClone(initialValue);
};

const tableKey = ref(0);

const save = async () => {
  isSaveLoading.value = true;

  if (category.value.id) {
    const { data } = await updateCategory(category.value);

    if (data?.result?.id) {
      reset();
      tableKey.value += 1;
    }
  } else {
    const { data } = await createCategory(category.value);

    if (data?.result?.id) {
      reset();
      tableKey.value += 1;
    }
  }

  isSaveLoading.value = false;
};

const getData = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string
) => {
  return await getCategories(limit, page, search, status, props.model);
};

const setCurrentCategory = async (id: string) => {
  isDataLoading.value = true;
  const { data } = await getCategory(id);

  if (data?.result) {
    category.value = data.result;
  }

  isDataLoading.value = false;
};

const removeData = async (id?: string) => {
  await deleteCategory(id);
  reset();
};
</script>

<style scoped lang="scss"></style>
