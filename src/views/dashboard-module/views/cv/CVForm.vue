<template>
  <PageHeader
    :title="id ? 'Edit cv' : 'Add cv'"
    :page="id ? 'Edit' : 'Add'"
    :breadcrumbs="
      is('talent')
        ? [{ label: 'CVs', route: 'cv' }]
        : [
            { label: 'Talents', route: 'talent' },
            { label: 'CVs', route: { name: 'cv', query: { talent_id: cv.talent?.id } } }
          ]
    "
  />

  <div class="page-body">
    <form class="row" @submit.prevent="isCreating && save()">
      <div class="col-md-12 mb-4">
        <div class="card">
          <div class="card-body">
            <TextInput
              label="Title"
              :required="true"
              placeholder="Add CV title"
              v-model="cv.title"
              class="mb-4"
            />

            <div
              class="gap-4 align-items-center justify-content-center"
              :class="{ 'd-flex': !isCreating, 'd-none': isCreating }"
            >
              <SubmitButton :disabled="isLoading" type="button" @click="isCreating = true">
                Create CV
              </SubmitButton>
              <span>or</span>
              <SubmitButton
                v-if="!isCreating"
                :loading="isLoading"
                :disabled="isLoading"
                @click="openUploadCV"
              >
                Upload CV
              </SubmitButton>
              <input
                ref="fileInput"
                type="file"
                class="form-control d-none"
                @input="handleFileInputChange"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-if="isCreating" class="col-md-8">
        <div class="card">
          <div class="card-body">
            <TextAreaInput
              label="Description"
              :required="true"
              placeholder="Add CV description"
              v-model="cv.description"
              class="mb-4"
            />

            <div>
              <div class="d-flex gap-2 mb-2">
                <label class="form-label"> Experience </label>
                <button
                  class="btn btn-ghost-primary btn-sm"
                  type="button"
                  @click="add('experiences')"
                >
                  <i class="bi bi-plus" />
                  Add
                </button>
              </div>

              <div
                v-for="(experience, index) in cv.experiences"
                :key="experience.id"
                class="row mb-4"
              >
                <div class="d-flex gap-4 mb-2">
                  <label class="form-label mb-0"> Experience {{ index + 1 }} </label>
                  <i
                    class="bi bi-trash text-danger my-auto"
                    @click="remove('experiences', experience.id)"
                    style="cursor: pointer; font-size: 12px"
                  />
                </div>

                <DateInput
                  placeholder="Add start date"
                  v-model="experience.start"
                  class="col-md-5 mb-4"
                  :required="true"
                />

                <span class="col-md-2 text-center">-</span>

                <DateInput
                  placeholder="Add end date"
                  v-model="experience.end"
                  class="col-md-5 mb-4"
                  :required="index !== 0"
                />

                <TextInput
                  placeholder="Add experience title"
                  v-model="experience.title"
                  class="mb-4"
                  :required="true"
                />

                <div>
                  <ckeditor :editor="ClassicEditor" v-model="experience.description"></ckeditor>
                </div>
              </div>
            </div>
          </div>

          <div class="card-footer d-flex justify-content-end gap-2">
            <RouterLink
              :to="{ name: 'cv.pdf' }"
              class="btn btn-primary me-2"
              v-if="id"
              target="_blank"
            >
              Generate PDF
            </RouterLink>
            <SubmitButton
              v-if="!id"
              :loading="isLoading"
              :disabled="isLoading"
              @click="openUploadCV"
            >
              Upload CV
            </SubmitButton>
            <SubmitButton :loading="isLoading" :disabled="isLoading"> Save </SubmitButton>
          </div>
        </div>
      </div>

      <div v-if="isCreating" class="col-md-4">
        <div class="card">
          <div class="card-body">
            <div class="mb-4">
              <div class="d-flex gap-2 mb-2">
                <label class="form-label required"> Skills </label>
                <button class="btn btn-ghost-primary btn-sm" type="button" @click="add('skills')">
                  <i class="bi bi-plus" />
                  Add
                </button>
              </div>

              <div
                v-for="skill in cv.skills"
                :key="skill.id"
                class="d-flex align-items-center gap-2 mb-4"
              >
                <TextInput
                  placeholder="Add skill"
                  v-model="skill.text"
                  :disabled="!is('talent')"
                  style="flex: 1"
                  :required="true"
                />

                <i
                  class="bi bi-trash text-danger"
                  @click="remove('skills', skill.id)"
                  style="cursor: pointer; font-size: 12px"
                />
              </div>
            </div>

            <div class="mb-4">
              <div class="d-flex gap-2 mb-2">
                <label class="form-label required"> Diploma & Certification </label>
                <button class="btn btn-ghost-primary btn-sm" type="button" @click="add('diplomas')">
                  <i class="bi bi-plus" />
                  Add
                </button>
              </div>

              <div
                v-for="diploma in cv.diplomas"
                :key="diploma.id"
                class="d-flex align-items-center gap-2 mb-4"
              >
                <TextInput
                  placeholder="Add diploma"
                  v-model="diploma.text"
                  :disabled="!is('talent')"
                  style="flex: 1"
                  :required="true"
                />

                <i
                  class="bi bi-trash text-danger"
                  @click="remove('diplomas', diploma.id)"
                  style="cursor: pointer; font-size: 12px"
                />
              </div>
            </div>

            <div class="mb-4">
              <div class="d-flex gap-2 mb-2">
                <label class="form-label required"> Language </label>
                <button
                  class="btn btn-ghost-primary btn-sm"
                  type="button"
                  @click="add('languages')"
                >
                  <i class="bi bi-plus" />
                  Add
                </button>
              </div>

              <div
                v-for="lang in cv.languages"
                :key="lang.id"
                class="d-flex align-items-center gap-2 mb-4"
              >
                <TextInput
                  placeholder="Add language"
                  v-model="lang.text"
                  :disabled="!is('talent')"
                  style="flex: 1"
                  :required="true"
                />

                <i
                  class="bi bi-trash text-danger"
                  @click="remove('languages', lang.id)"
                  style="cursor: pointer; font-size: 12px"
                />
              </div>
            </div>
          </div>
        </div>
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
import TextAreaInput from '@/components/inputs/TextAreaInput.vue';
import DateInput from '@/components/inputs/DateInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import { createCV, getCV, updateCV, uploadCV } from '../../stores/services/cv.service';
import { uploadMedia } from '../../stores/services/media.service';

import { useAuthStore } from '@/views/auth-module/stores/auth.store';

const authStore = useAuthStore();

const { is } = authStore;

const route = useRoute();
const router = useRouter();

const id = computed(() => route.params.id as string);

const cv = ref<any>(
  id.value
    ? (await getCV(id.value))?.data?.result
    : {
        title: '',
        description: '',
        skills: [{ id: window.crypto.getRandomValues(new Uint32Array(1))[0], text: '' }],
        diplomas: [{ id: window.crypto.getRandomValues(new Uint32Array(1))[0], text: '' }],
        languages: [{ id: window.crypto.getRandomValues(new Uint32Array(1))[0], text: '' }],
        experiences: [
          {
            id: window.crypto.getRandomValues(new Uint32Array(1))[0],
            start: '',
            end: '',
            title: '',
            description: ''
          }
        ]
      }
);

if (id.value && !cv.value) {
  router.push({ name: 'job.add' });
} else {
  if (!cv.value.skills?.length) {
    cv.value.skills = [{ id: window.crypto.getRandomValues(new Uint32Array(1))[0], text: '' }];
  }
}

const isLoading = ref(false);

const save = async () => {
  isLoading.value = true;

  const { data: newData } = id.value
    ? await updateCV({ ...cv.value, talent: undefined })
    : await createCV(cv.value);

  if (newData?.result?.id) {
    router.push({ name: 'cv.list' });
  }

  isLoading.value = false;
};

const add = (key: string) =>
  cv.value[key]?.push({ id: window.crypto.getRandomValues(new Uint32Array(1))[0] });

const remove = (key: string, id: number) => {
  if (cv.value[key]?.length > 1) {
    cv.value[key] = cv.value[key].filter((e: any) => e.id !== id);
  }
};

const isCreating = ref(id.value ? true : false);
const fileInput = ref<HTMLElement | null>(null);

const openUploadCV = () => {
  isCreating.value = false;

  if (cv.value.title) {
    fileInput.value?.click();
  }
};

const handleFileInputChange = async (event: any) => {
  const file = event.target.files[0];

  if (file) {
    isLoading.value = true;

    const { data } = await uploadMedia(file, 'pdf');

    if (data && data.result?.id) {
      const { data: newData } = await uploadCV({
        title: cv.value.title,
        file: { id: data.result?.id }
      });

      if (newData?.result?.id) {
        router.push({ name: 'cv.list' });
      }
    }

    isLoading.value = false;
  }
};
</script>
