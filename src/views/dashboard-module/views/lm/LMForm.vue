<template>
  <PageHeader
    :title="id ? 'Edit lm' : 'Add lm'"
    :page="id ? 'Edit' : 'Add'"
    :breadcrumbs="
      is('talent')
        ? [{ label: 'LMs', route: 'lm' }]
        : [
            { label: 'Talents', route: 'talent' },
            { label: 'LMs', route: { name: 'lm', query: { talent_id: lm.talent?.id } } }
          ]
    "
  />

  <div class="page-body">
    <form class="card" @submit.prevent="save">
      <div class="card-body">
        <TextInput label="Title" :required="true" placeholder="Add LM title" v-model="lm.title" />

        <div class="mt-4">
          <div class="form-label required">Content</div>
          <ckeditor :editor="ClassicEditor" v-model="lm.content"></ckeditor>
        </div>
      </div>
      <div class="card-footer d-flex justify-content-end">
        <RouterLink :to="{ name: 'lm.pdf' }" class="btn btn-primary me-2" v-if="id" target="_blank">
          Generate PDF
        </RouterLink>
        <SubmitButton :loading="isLoading" :disabled="isLoading"> Save </SubmitButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import PageHeader from '@/components/PageHeader.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import { createLM, getLM, updateLM } from '../../stores/services/lm.service';

import { useAuthStore } from '@/views/auth-module/stores/auth.store';

const authStore = useAuthStore();

const { is } = authStore;

const route = useRoute();
const router = useRouter();

const id = computed(() => route.params.id as string);

const lm = ref<any>(
  id.value
    ? (await getLM(id.value))?.data?.result
    : {
        title: '',
        content: ''
      }
);

if (id.value && !lm.value) {
  router.push({ name: 'job.add' });
}

const isLoading = ref(false);

const save = async () => {
  isLoading.value = true;

  const { data: newData } = id.value ? await updateLM(lm.value) : await createLM(lm.value);

  if (newData?.result?.id) {
    router.push({ name: 'lm.list' });
  }

  isLoading.value = false;
};
</script>
