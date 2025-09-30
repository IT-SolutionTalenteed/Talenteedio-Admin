<template>
  <PageHeader title="Ad" page="Ad" />

  <div class="page-body">
    <div class="row flex-grow-1">
      <div class="col-md-4">
        <form class="card" @submit.prevent="save">
          <div class="card-body">
            <TextInput
              label="Title"
              :required="true"
              placeholder="Add ad title"
              class="mb-4"
              v-model="ad.title"
            />
            <TextInput
              label="Slug"
              :required="true"
              placeholder="Add ad slug"
              v-model="ad.slug"
              class="mb-4"
              disabled
            />
            <TextInput label="Website link" placeholder="Add ad website link" v-model="ad.link" />
            <div class="mt-4">
              <FileInput label="Featured image (908 x 80)" v-model="image" />
              <img
                v-if="fileUrl"
                class="mt-4"
                :src="fileUrl"
                style="max-height: 250px; object-fit: cover; width: 100%"
              />
            </div>
            <RadioInput
              label="Status"
              v-model="ad.status"
              :options="[
                { title: 'Enable', value: 'enable' },
                { title: 'Disable', value: 'disable' }
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
  createAd as create,
  updateAd as update,
  getAds as getData,
  deleteAd as remove,
  getAd as getOne
} from '../../stores/services/ad.service';
import { uploadMedia } from '../../stores/services/media.service';

import { createSafeUrlFromTitle } from '@/utils/helpers';

const isSaveLoading = ref(false);
const isDataLoading = ref(false);

const initialValue: any = {
  id: undefined,
  title: '',
  slug: '',
  status: 'enable',
  image: {
    id: undefined
  },
  link: undefined
};

const ad = ref(structuredClone(initialValue));

watch(
  ad,
  () => {
    ad.value.slug = createSafeUrlFromTitle(ad.value!.title);
  },
  { immediate: true, deep: true }
);

const reset = () => {
  ad.value = structuredClone(initialValue);
  fileUrl.value = undefined;
};

const tableKey = ref(0);

const image = ref(undefined);

const fileUrl = ref(ad.value.image?.fileUrl);
ad.value.image && (ad.value.image.fileUrl = undefined);

watch(image, () => {
  ad.value.image.fileUrl = undefined;
});

const save = async () => {
  isSaveLoading.value = true;

  if (image.value) {
    const { data } = await uploadMedia(image.value);

    if (data && data.result?.id) {
      if (!ad.value.image) ad.value.image = {};
      ad.value.image.id = data.result?.id;
    } else {
      isSaveLoading.value = false;
      return;
    }
  } else {
    ad.value.image = undefined;
  }

  if (ad.value.id) {
    const { data } = await update(ad.value);

    if (data?.result?.id) {
      reset();
      tableKey.value += 1;
    }
  } else {
    const { data } = await create(ad.value);

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
    ad.value = data.result;
    fileUrl.value = ad.value.image?.fileUrl;
    ad.value.image && (ad.value.image.fileUrl = undefined);
  }

  isDataLoading.value = false;
};

const removeData = async (id?: string) => {
  await remove(id);
  reset();
};
</script>

<style scoped lang="scss"></style>
