<template>
  <PageHeader title="Terms & confidentiality" page="Terms & confidentiality" />

  <div class="page-body">
    <form class="card" @submit.prevent="save">
      <div class="card-header">
        <h3 class="card-title">Terms & Confidentiality</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-12 mb-4">
            <div class="form-label">Terms & Conditions</div>
            <ckeditor :editor="ClassicEditor" v-model="setting.terms"></ckeditor>
          </div>
          <div class="col-md-12 mb-4">
            <div class="form-label">Confidentiality</div>
            <ckeditor :editor="ClassicEditor" v-model="setting.confidentiality"></ckeditor>
          </div>
        </div>
      </div>
      <div class="card-footer d-flex justify-content-end">
        <SubmitButton :loading="isLoading" :disabled="isLoading"> Save </SubmitButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import PageHeader from '@/components/PageHeader.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import { getSetting, updateSetting } from '../../stores/services/setting.service';

const isLoading = ref(false);

const getData = await getSetting();

const setting = ref(
  getData?.data?.result || {
    terms: undefined,
    confidentiality: undefined
  }
);

setting.value.terms = setting.value.terms === null ? '' : setting.value.terms;
setting.value.confidentiality =
  setting.value.confidentiality === null ? '' : setting.value.confidentiality;

const save = async () => {
  isLoading.value = true;

  if (setting.value.homeImage1) setting.value.homeImage1.fileUrl = undefined;
  if (setting.value.homeImage2) setting.value.homeImage2.fileUrl = undefined;
  if (setting.value.homeImage3) setting.value.homeImage3.fileUrl = undefined;

  await updateSetting(setting.value);

  isLoading.value = false;
};
</script>

<style scoped></style>
