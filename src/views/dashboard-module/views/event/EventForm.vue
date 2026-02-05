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
              <div class="col-md-6 mt-4">
                <DateInput
                  label="Date"
                  :required="true"
                  placeholder="Add date"
                  v-model="event.date"
                />
              </div>
              <div class="col-md-3 mt-4">
                <TextInput
                  label="Start Time"
                  placeholder="14:00"
                  v-model="event.startTime"
                  type="time"
                />
              </div>
              <div class="col-md-3 mt-4">
                <TextInput
                  label="End Time"
                  placeholder="18:00"
                  v-model="event.endTime"
                  type="time"
                />
              </div>
              <div class="col-md-8 mt-4">
                <TextInput
                  label="Location"
                  placeholder="Event venue or address"
                  v-model="event.location"
                />
              </div>
              <div class="col-md-4 mt-4">
                <TextInput
                  label="Max Participants"
                  placeholder="100"
                  v-model="event.maxParticipants"
                  type="number"
                  :required="false"
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
            <div class="card-header">
              <h3 class="card-title">Category</h3>
            </div>
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
                    :multiple="false"
                    v-model="event.category"
                    label="Event Category"
                    placeholder="Choose a category"
                  />
                  <small class="text-muted">Category for this event (optional)</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-12 mt-4" v-if="is('admin')">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Participating Companies</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-12">
                  <MultiSelectInput
                    :options="companies"
                    :normalizer="(obj: any) => {
                      return {
                        label: obj.company_name,
                        value: obj.id,
                        logo: obj.logo?.fileUrl
                      };
                    }"
                    :multiple="true"
                    v-model="event.companies"
                    label="Select Companies"
                    placeholder="Choose participating companies"
                  />
                  <small class="text-muted">Companies that will participate in this event</small>
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
import { getCompanies } from '../../stores/services/company.service';
import { createEvent, getEvent, updateEvent } from '../../stores/services/event.service';

import { createSafeUrlFromTitle } from '@/utils/helpers';
import { useAuthStore } from '@/views/auth-module/stores/auth.store';
import { storeToRefs } from 'pinia';

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();
const { is } = authStore;
const { user } = storeToRefs(authStore);

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
        startTime: '',
        endTime: '',
        location: '',
        maxParticipants: '',
        category: null,
        companies: is('company') && user.value?.company ? [{ id: user.value.company.id }] : []
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

const categoriesData = (await getCategories(null, null, null, 'public', 'event')).data;
const categories = categoriesData?.results?.rows || [];

const companiesData = (await getCompanies(null, null, null, 'public')).data;
const companies = companiesData?.results?.rows || [];

// Debug: Log companies with logos
console.log('Companies data:', companies.map(c => ({ 
  name: c.company_name, 
  logo: c.logo?.fileUrl 
})));

const isLoading = ref(false);

const save = async () => {
  isLoading.value = true;

  // Préparer les données en nettoyant les valeurs vides
  const eventData = {
    ...event.value,
    maxParticipants: event.value.maxParticipants === '' || event.value.maxParticipants === null 
      ? null 
      : parseInt(event.value.maxParticipants, 10),
    startTime: event.value.startTime || null,
    endTime: event.value.endTime || null,
    location: event.value.location || null
  };

  const { data: newData } = id.value
    ? await updateEvent(eventData)
    : await createEvent(eventData);

  if (newData?.result?.id) {
    router.push({ name: 'event.list' });
  }

  isLoading.value = false;
};
</script>
