<template>
  <PageHeader
    :title="id ? 'Edit interview' : 'Add interview'"
    :page="id ? 'Edit' : 'Add'"
    :breadcrumbs="[{ label: 'Interview', route: 'interview' }]"
  />

  <div class="page-body">
    <form class="row" @submit.prevent="save">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Interview content</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <TextInput
                  label="Title"
                  :required="true"
                  placeholder="Add interview title"
                  v-model="interview.title"
                />
              </div>
              <div class="col-md-12 mt-4">
                <TextInput
                  label="Slug"
                  :required="true"
                  placeholder="Add interview slug"
                  v-model="interview.slug"
                  disabled
                />
              </div>
              <div class="col-md-12 mt-4">
                <TextInput
                  label="Video embeded URL"
                  :required="true"
                  placeholder="Add video source"
                  v-model="interview.videoSrc"
                />
              </div>
              <div class="col-md-12 mt-4">
                <TextAreaInput
                  label="Meta description for SEO"
                  placeholder="Add meta description"
                  v-model="interview.metaDescription"
                />
              </div>
              <div class="col-md-12 mt-4">
                <DateInput
                  label="Date"
                  :required="true"
                  placeholder="Add date"
                  v-model="interview.date"
                />
              </div>
              <div class="col-md-12 mt-4">
                <div class="form-label required">Content</div>
                <ckeditor :editor="ClassicEditor" v-model="interview.content"></ckeditor>
              </div>
            </div>
          </div>
          <div class="card-footer d-flex justify-content-end">
            <SubmitButton :loading="isLoading" :disabled="isLoading"> Save </SubmitButton>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Status</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-12">
                  <RadioInput
                    :options="[
                      { title: 'Public', value: 'public' },
                      { title: 'Draft', value: 'draft' },
                      { title: 'Blocked', value: 'blocked' }
                    ]"
                    v-model="interview.status"
                    name="status"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-12 mt-4">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-md-12">
                  <div class="d-flex gap-2">
                    <label class="form-label"> Guests </label>
                    <button class="btn btn-ghost-primary btn-sm" type="button" @click="add">
                      <i class="bi bi-plus" />
                      Add
                    </button>
                  </div>

                  <div
                    v-for="guest in interview.guests"
                    :key="guest.id"
                    class="d-flex align-items-center gap-2 mt-2"
                  >
                    <TextInput placeholder="Guest name" v-model="guest.name" style="flex: 1" />

                    <i
                      class="bi bi-trash text-danger"
                      @click="remove(guest.id)"
                      style="cursor: pointer; font-size: 12px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import PageHeader from '@/components/PageHeader.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import TextAreaInput from '@/components/inputs/TextAreaInput.vue';
import RadioInput from '@/components/inputs/RadioInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';
import DateInput from '@/components/inputs/DateInput.vue';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import {
  createInterview,
  getInterview,
  updateInterview
} from '../../stores/services/interview.service';

import { createSafeUrlFromTitle } from '@/utils/helpers';

const router = useRouter();
const route = useRoute();

const id = computed(() => route.params.id as string);

const interview = ref<any>(
  id.value
    ? (await getInterview(id.value))?.data?.result
    : {
        title: '',
        slug: '',
        content: '',
        metaDescription: '',
        status: 'public',
        date: '',
        videoSrc: '',
        guests: [{ id: window.crypto.getRandomValues(new Uint32Array(1))[0], name: '' }] as any
      }
);

watch(
  interview,
  () => {
    interview.value.slug = createSafeUrlFromTitle(interview.value!.title);
  },
  { immediate: true, deep: true }
);

if (id.value && !interview.value) {
  router.push({ name: 'interview.add' });
}

const isLoading = ref(false);

const save = async () => {
  isLoading.value = true;

  const { data: newData } = id.value
    ? await updateInterview(interview.value)
    : await createInterview(interview.value);

  if (newData?.result?.id) {
    router.push({ name: 'interview.list' });
  }

  isLoading.value = false;
};

const add = () =>
  interview.value.guests?.push({ id: window.crypto.getRandomValues(new Uint32Array(1))[0] });

const remove = (id: number) => {
  if (interview.value.guests.length > 1) {
    interview.value.guests = interview.value.guests.filter((e: any) => e.id !== id);
  }
};
</script>
