<template>
  <PageHeader title="Partner" page="Partner" />

  <div class="page-body">
    <div class="row flex-grow-1">
      <div class="col-md-4">
        <form class="card" @submit.prevent="save">
          <div class="card-body">
            <TextInput
              label="Title"
              :required="true"
              placeholder="Add partner title"
              class="mb-4"
              v-model="partner.title"
            />
            <TextInput
              label="Slug"
              :required="true"
              placeholder="Add partner slug"
              v-model="partner.slug"
              class="mb-4"
              disabled
            />
            <TextInput
              label="Website link"
              placeholder="Add partner website link"
              v-model="partner.link"
            />
            <div class="mt-4">
              <FileInput label="Featured image" v-model="image" />
              <img
                v-if="fileUrl"
                class="mt-4"
                :src="fileUrl"
                style="max-height: 250px; object-fit: cover; width: 100%"
              />
            </div>
            <RadioInput
              label="Status"
              v-model="partner.status"
              :options="[
                { title: 'Public', value: 'public' },
                { title: 'Draft', value: 'draft' },
                { title: 'Blocked', value: 'blocked' }
              ]"
              class="mt-4"
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
import { ref, watch } from 'vue';

import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import RadioInput from '@/components/inputs/RadioInput.vue';
import FileInput from '@/components/inputs/FileInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import {
  createPartner as create,
  updatePartner as update,
  getPartners as getData,
  deletePartner as remove,
  getPartner as getOne
} from '../../stores/services/partner.service';
import { uploadMedia } from '../../stores/services/media.service';

import { createSafeUrlFromTitle } from '@/utils/helpers';

const isSaveLoading = ref(false);
const isDataLoading = ref(false);

const initialValue: any = {
  id: undefined,
  title: '',
  slug: '',
  status: 'public',
  image: {
    id: undefined
  },
  link: undefined
};

const partner = ref(structuredClone(initialValue));

watch(
  partner,
  () => {
    partner.value.slug = createSafeUrlFromTitle(partner.value!.title);
  },
  { immediate: true, deep: true }
);

const reset = () => {
  partner.value = structuredClone(initialValue);
  fileUrl.value = undefined;
};

const tableKey = ref(0);

const image = ref(undefined);

const fileUrl = ref(partner.value.image?.fileUrl);
partner.value.image && (partner.value.image.fileUrl = undefined);

watch(image, () => {
  partner.value.image.fileUrl = undefined;
});

const save = async () => {
  isSaveLoading.value = true;

  if (image.value) {
    const { data } = await uploadMedia(image.value);

    if (data && data.result?.id) {
      if (!partner.value.image) partner.value.image = {};
      partner.value.image.id = data.result?.id;
    } else {
      isSaveLoading.value = false;
      return;
    }
  } else {
    partner.value.image = undefined;
  }

  if (partner.value.id) {
    const { data } = await update(partner.value);

    if (data?.result?.id) {
      reset();
      tableKey.value += 1;
    }
  } else {
    const { data } = await create(partner.value);

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
    partner.value = data.result;
    fileUrl.value = partner.value.image?.fileUrl;
    partner.value.image && (partner.value.image.fileUrl = undefined);
  }

  isDataLoading.value = false;
};

const removeData = async (id?: string) => {
  await remove(id);
  reset();
};
</script>

<style scoped lang="scss"></style>
