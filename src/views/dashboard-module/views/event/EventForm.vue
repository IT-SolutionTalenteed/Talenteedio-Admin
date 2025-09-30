<template>
  <PageHeader
    :title="id ? 'Edit event' : 'Add event'"
    :page="id ? 'Edit' : 'Add'"
    :breadcrumbs="[{ label: 'Event', route: 'event' }]"
  />

  <div class="page-body">
    <form class="row" @submit.prevent="save">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Event content</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <TextInput
                  label="Title"
                  :required="true"
                  placeholder="Add event title"
                  v-model="event.title"
                />
              </div>
              <div class="col-md-12 mt-4">
                <TextInput
                  label="Slug"
                  :required="true"
                  placeholder="Add event slug"
                  v-model="event.slug"
                  disabled
                />
              </div>
              <div class="col-md-12 mt-4">
                <TextAreaInput
                  label="Meta description for SEO"
                  placeholder="Add meta description"
                  v-model="event.metaDescription"
                />
              </div>
              <div class="col-md-12 mt-4">
                <DateInput
                  label="Date"
                  :required="true"
                  placeholder="Add date"
                  v-model="event.date"
                />
              </div>
              <div class="col-md-12 mt-4">
                <div class="form-label required">Content</div>
                <ckeditor :editor="ClassicEditor" v-model="event.content"></ckeditor>
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
                    v-model="event.status"
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
                  <MultiSelectInput
                    :options="categories"
                    :normalizer="(obj: any) => {
                      return {
                        label: obj.name,
                        value: obj.id
                      };
                    }"
                    :multiple="true"
                    v-model="event.categories"
                    label="Categories"
                  />
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
import MultiSelectInput from '@/components/inputs/MultiSelectInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';
import DateInput from '@/components/inputs/DateInput.vue';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { getCategories } from '../../stores/services/category.service';
import { createEvent, getEvent, updateEvent } from '../../stores/services/event.service';

import { createSafeUrlFromTitle } from '@/utils/helpers';

const router = useRouter();
const route = useRoute();

const id = computed(() => route.params.id as string);

const event = ref<any>(
  id.value
    ? (await getEvent(id.value))?.data?.result
    : {
        title: '',
        slug: '',
        content: '',
        metaDescription: '',
        status: 'public',
        date: '',
        categories: [] as any
      }
);

watch(
  event,
  () => {
    event.value.slug = createSafeUrlFromTitle(event.value!.title);
  },
  { immediate: true, deep: true }
);

if (id.value && !event.value) {
  router.push({ name: 'event.add' });
}

const data = (await getCategories(null, null, null, 'public', 'event')).data;

const categories = data?.results?.rows || [];

const isLoading = ref(false);

const save = async () => {
  isLoading.value = true;

  const { data: newData } = id.value
    ? await updateEvent(event.value)
    : await createEvent(event.value);

  if (newData?.result?.id) {
    router.push({ name: 'event.list' });
  }

  isLoading.value = false;
};
</script>
