<template>
  <PageHeader title="Contact & site content" page="Contact & site content" />

  <div class="page-body">
    <form class="card mb-4" @submit.prevent="save">
      <div class="card-header">
        <h3 class="card-title">Basic contact</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6 mb-4">
            <TextInput
              label="Email"
              :required="true"
              placeholder="Add email"
              v-model="setting.contact.email"
              type="email"
            />
          </div>
          <div class="col-md-6 mb-4">
            <TextInput
              label="Phone"
              :required="true"
              placeholder="Add phone number"
              v-model="setting.contact.phoneNumber"
            />
          </div>
          <div class="col-md-6">
            <TextInput
              label="Address line"
              :required="true"
              placeholder="Add address line"
              v-model="setting.contact.address.line"
            />
          </div>
          <div class="col-md-6 mb-4">
            <TextInput
              label="City"
              :required="true"
              placeholder="Add city"
              v-model="setting.contact.address.city"
            />
          </div>
          <div class="col-md-6">
            <TextInput
              label="Postal code"
              :required="true"
              placeholder="Add postal code"
              v-model="setting.contact.address.postalCode"
            />
          </div>
          <div class="col-md-6 mb-4">
            <TextInput
              label="State"
              placeholder="Add state"
              v-model="setting.contact.address.state"
            />
          </div>
          <div class="col-md-6 mb-4">
            <SelectCountryInput
              :required="true"
              placeholder="Add country"
              v-model="setting.contact.address.country"
            />
          </div>
        </div>
      </div>
      <div class="card-footer d-flex justify-content-end">
        <SubmitButton :loading="isLoading" :disabled="isLoading"> Save </SubmitButton>
      </div>
    </form>

    <form class="card mb-4" @submit.prevent="save">
      <div class="card-header">
        <h3 class="card-title">Site content</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-12 mb-4">
            <div class="form-label">Did you know section</div>
            <ckeditor :editor="ClassicEditor" v-model="setting.didYouKnow"></ckeditor>
          </div>
          <div class="col-md-12 mb-4">
            <FileInput label="Home image 1 (1920 x 550)" v-model="homeImage1" />
            <img
              v-if="fileUrl1"
              class="mt-4"
              :src="fileUrl1"
              style="max-height: 250px; object-fit: cover; width: 100%"
            />
          </div>
          <div class="col-md-12 mb-4">
            <FileInput label="Home image 2 (1920 x 550)" v-model="homeImage2" />
            <img
              v-if="fileUrl2"
              class="mt-4"
              :src="fileUrl2"
              style="max-height: 250px; object-fit: cover; width: 100%"
            />
          </div>
          <div class="col-md-12 mb-4">
            <FileInput label="Home image 3 (1920 x 550)" v-model="homeImage3" />
            <img
              v-if="fileUrl3"
              class="mt-4"
              :src="fileUrl3"
              style="max-height: 250px; object-fit: cover; width: 100%"
            />
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
import { ref, watch } from 'vue';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import PageHeader from '@/components/PageHeader.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import SelectCountryInput from '@/components/inputs/SelectCountryInput.vue';
import FileInput from '@/components/inputs/FileInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import { getSetting, updateSetting } from '../../stores/services/setting.service';
import { uploadMedia } from '../../stores/services/media.service';

const isLoading = ref(false);

const getData = await getSetting();

const setting = ref(
  getData?.data?.result || {
    contact: {
      email: '',
      phoneNumber: '',
      address: {
        line: '',
        postalCode: '',
        city: '',
        state: '',
        country: ''
      }
    },
    didYouKnow: undefined,
    gateway: undefined,
    voice: undefined,
    initiative: undefined,
    homeImage1: {
      id: undefined
    },
    homeImage2: {
      id: undefined
    },
    homeImage3: {
      id: undefined
    }
  }
);

setting.value.didYouKnow = setting.value.didYouKnow === null ? '' : setting.value.didYouKnow;

const homeImage1 = ref(undefined);

const fileUrl1 = ref(setting.value.homeImage1?.fileUrl);
setting.value.homeImage1 && (setting.value.homeImage1.fileUrl = undefined);

watch(homeImage1, () => {
  setting.value.homeImage1.fileUrl = undefined;
});

const homeImage2 = ref(undefined);

const fileUrl2 = ref(setting.value.homeImage2?.fileUrl);
setting.value.homeImage2 && (setting.value.homeImage2.fileUrl = undefined);

watch(homeImage2, () => {
  setting.value.homeImage2.fileUrl = undefined;
});

const homeImage3 = ref(undefined);

const fileUrl3 = ref(setting.value.homeImage3?.fileUrl);
setting.value.homeImage3 && (setting.value.homeImage3.fileUrl = undefined);

watch(homeImage3, () => {
  setting.value.homeImage3.fileUrl = undefined;
});

const save = async () => {
  isLoading.value = true;

  if (homeImage1.value) {
    const { data } = await uploadMedia(homeImage1.value);

    if (data && data.result?.id) {
      if (!setting.value.homeImage1) setting.value.homeImage1 = {};
      setting.value.homeImage1.id = data.result?.id;
    } else {
      isLoading.value = false;
      return;
    }
  } else {
    setting.value.homeImage1 = undefined;
  }

  if (homeImage2.value) {
    const { data } = await uploadMedia(homeImage2.value);

    if (data && data.result?.id) {
      if (!setting.value.homeImage2) setting.value.homeImage2 = {};
      setting.value.homeImage2.id = data.result?.id;
    } else {
      isLoading.value = false;
      return;
    }
  } else {
    setting.value.homeImage2 = undefined;
  }

  if (homeImage3.value) {
    const { data } = await uploadMedia(homeImage3.value);

    if (data && data.result?.id) {
      if (!setting.value.homeImage3) setting.value.homeImage3 = {};
      setting.value.homeImage3.id = data.result?.id;
    } else {
      isLoading.value = false;
      return;
    }
  } else {
    setting.value.homeImage3 = undefined;
  }

  await updateSetting(setting.value);

  isLoading.value = false;
};
</script>

<style scoped lang="scss">
img.mt-4 {
  object-position: top;
}
</style>
