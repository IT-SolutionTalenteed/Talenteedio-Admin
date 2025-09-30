<template>
  <PageHeader
    :title="id ? 'Edit job' : 'Add job'"
    :page="id ? 'Edit' : 'Add'"
    :breadcrumbs="[{ label: 'Job', route: 'job' }]"
  />

  <div class="page-body">
    <form class="row" @submit.prevent="save">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Job content</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <div class="form-label">Client</div>
                <ckeditor :editor="ClassicEditor" v-model="client"></ckeditor>
              </div>
              <div class="col-md-12 mt-4">
                <div class="form-label">Missions</div>
                <ckeditor :editor="ClassicEditor" v-model="missions"></ckeditor>
              </div>
              <div class="col-md-12 mt-4">
                <div class="form-label">Profile</div>
                <ckeditor :editor="ClassicEditor" v-model="profile"></ckeditor>
              </div>
              <div class="col-md-12 mt-4">
                <div class="form-label">Our offer</div>
                <ckeditor :editor="ClassicEditor" v-model="offer"></ckeditor>
              </div>
              <div class="col-md-6 mt-4">
                <DateInput
                  label="Expiration date"
                  :required="true"
                  placeholder="Add expiration date"
                  v-model="job.expirationDate"
                  :disabled="
                    !!(user && user.company && user.company.permission.validityPeriodOfAJob >= 0)
                  "
                />
              </div>
              <div class="col-md-6 mt-4 d-flex">
                <TextInput
                  type="number"
                  label="Hours"
                  placeholder="Add hours"
                  v-model="job.hours"
                />
                <MultiSelectInput
                  :options="['day', 'week', 'month', 'year']"
                  :normalizer="(hourType: any) => {
                      return {
                        label: hourType,
                        value: hourType
                      };
                    }"
                  :multiple="false"
                  v-model="job.hourType"
                  label="Hour type"
                  class="flex-grow-1"
                  style="width: 120px"
                  type="classic"
                />
              </div>
              <div class="col-md-6 mt-4">
                <MultiSelectInput
                  :options="['M/F/X', 'M/W/D']"
                  :normalizer="(gender: any) => {
                      return {
                        label: gender,
                        value: gender
                      };
                    }"
                  :multiple="false"
                  v-model="job.gender"
                  label="Gender"
                  type="classic"
                />
              </div>
              <div class="col-md-6 mt-4 d-flex">
                <TextInput
                  type="number"
                  label="Salary min"
                  placeholder="Add salary min"
                  v-model="job.salaryMin"
                />
                <TextInput
                  type="number"
                  label="Salary max"
                  placeholder="Add salary max"
                  v-model="job.salaryMax"
                />
                <MultiSelectInput
                  :options="['hourly', 'daily', 'weekly', 'monthly', 'yearly']"
                  :normalizer="(salaryType: any) => {
                      return {
                        label: salaryType,
                        value: salaryType
                      };
                    }"
                  :multiple="false"
                  v-model="job.salaryType"
                  label="Type"
                  class="flex-grow-1"
                  style="width: 120px"
                  type="classic"
                />
              </div>
              <div class="col-md-6 mt-4">
                <TextInput
                  type="number"
                  label="Experience"
                  placeholder="Add experience"
                  v-model="job.experience"
                />
              </div>
              <div class="col-md-6 mt-4">
                <TextInput
                  type="number"
                  label="Nb of recruitment"
                  placeholder="Add nb of recruitment"
                  v-model="job.recruitmentNumber"
                />
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
              <h3 class="card-title">Title</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-12">
                  <TextInput
                    label="Title"
                    :required="true"
                    placeholder="Add job title"
                    v-model="job.title"
                  />
                </div>
                <div class="col-md-12 mt-4">
                  <TextInput
                    label="Slug"
                    :required="true"
                    placeholder="Add job slug"
                    v-model="job.slug"
                    disabled
                  />
                </div>
                <div class="col-md-12 mt-4">
                  <TextAreaInput
                    label="Meta description for SEO"
                    placeholder="Add meta description"
                    v-model="job.metaDescription"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-12 mt-4">
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
                    v-model="job.status"
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
              <h3 class="card-title">Availability</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-12">
                  <label class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" v-model="job.isFeatured" />
                    <span class="form-check-label">Is featured</span>
                  </label>

                  <label class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" v-model="job.isUrgent" />
                    <span class="form-check-label">Is urgent</span>
                  </label>

                  <label class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" v-model="job.isSharable" />
                    <span class="form-check-label">Is sharable</span>
                  </label>
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
                    :multiple="false"
                    v-model="job.category"
                    label="Category"
                  />
                </div>
                <div class="col-md-12 mt-4">
                  <MultiSelectInput
                    :options="values"
                    :normalizer="(obj: any) => {
                      return {
                        label: obj.title,
                        value: obj.id
                      };
                    }"
                    :multiple="true"
                    v-model="job.values"
                    label="Values"
                  />
                </div>
                <div class="col-md-12 mt-4">
                  <MultiSelectInput
                    :options="jobTypes"
                    :normalizer="(obj: any) => {
                      return {
                        label: obj.name,
                        value: obj.id
                      };
                    }"
                    :multiple="false"
                    v-model="job.jobType"
                    label="Job type"
                  />
                </div>
                <div class="col-md-12 mt-4">
                  <MultiSelectInput
                    :options="locations"
                    :normalizer="(obj: any) => {
                      return {
                        label: obj.name,
                        value: obj.id
                      };
                    }"
                    :multiple="false"
                    v-model="job.location"
                    label="Location"
                  />
                </div>
                <div class="col-md-12 mt-4">
                  <MultiSelectInput
                    v-if="is('admin')"
                    :options="companies"
                    :normalizer="(obj: any) => {
                      return {
                        label: obj.company_name,
                        value: obj.id
                      };
                    }"
                    :required="true"
                    :multiple="false"
                    v-model="job.company"
                    label="Company"
                  />
                </div>
                <div class="col-md-12 mt-4">
                  <FileInput label="Featured image" v-model="image" />
                  <img
                    v-if="fileUrl"
                    class="mt-4"
                    :src="fileUrl"
                    style="max-height: 250px; object-fit: cover; width: 100%"
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
import { storeToRefs } from 'pinia';

import PageHeader from '@/components/PageHeader.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import TextAreaInput from '@/components/inputs/TextAreaInput.vue';
import RadioInput from '@/components/inputs/RadioInput.vue';
import MultiSelectInput from '@/components/inputs/MultiSelectInput.vue';
import FileInput from '@/components/inputs/FileInput.vue';
import DateInput from '@/components/inputs/DateInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { getCategories } from '../../stores/services/category.service';
import { getJobTypes } from '../../stores/services/job-type.service';
import { getLocations } from '../../stores/services/location.service';
import { getCompanies } from '../../stores/services/company.service';
import { uploadMedia } from '../../stores/services/media.service';
import { createJob, getJob, updateJob } from '../../stores/services/job.service';
import { getValues } from '../../stores/services/value.service';

import { useAuthStore } from '@/views/auth-module/stores/auth.store';

import { createSafeUrlFromTitle } from '@/utils/helpers';

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();
const { is } = authStore;
const { user } = storeToRefs(authStore);

const id = computed(() => route.params.id as string);

let expirationDate = '';

if (user.value && user.value.company && user.value.company.permission.validityPeriodOfAJob >= 0) {
  const currentTime = new Date();
  currentTime.setDate(currentTime.getDate() + user.value.company.permission.validityPeriodOfAJob);
  expirationDate = currentTime.toISOString().split('T')[0];
}

const job = ref<any>(
  id.value
    ? (await getJob(id.value))?.data?.result
    : {
        title: '',
        slug: '',
        content: '',
        metaDescription: '',
        status: 'public',
        expirationDate: expirationDate,
        hours: undefined,
        hourType: undefined,
        gender: undefined,
        salaryMin: undefined,
        salaryMax: undefined,
        salaryType: undefined,
        experience: undefined,
        recruitmentNumber: undefined,
        isFeatured: false,
        isUrgent: false,
        isSharable: false,
        featuredImage: {
          id: undefined
        },
        category: {
          id: undefined
        },
        location: {
          id: undefined
        },
        jobType: {
          id: undefined
        },
        company: {
          id: undefined
        },
        values: []
      }
);

const clientTitle = '<h2>CLIENT:</h2>';
const missionsTitle = '<h2>MISSIONS:</h2>';
const profileTitle = '<h2>PROFILE:</h2>';
const offerTitle = '<h2>OUR OFFER:</h2>';

const clientStart = job.value.content.indexOf(clientTitle);
const missionsStart = job.value.content.indexOf(missionsTitle);
const profileStart = job.value.content.indexOf(profileTitle);
const offerStart = job.value.content.indexOf(offerTitle);

const client = ref(
  clientStart !== -1
    ? job.value.content.substring(
        clientStart + clientTitle.length,
        missionsStart !== -1
          ? missionsStart
          : profileStart !== -1
          ? profileStart
          : offerStart !== -1
          ? offerStart
          : job.value.content.length
      )
    : ''
);

const missions = ref(
  missionsStart !== -1
    ? job.value.content.substring(
        missionsStart + missionsTitle.length,
        profileStart !== -1
          ? profileStart
          : offerStart !== -1
          ? offerStart
          : job.value.content.length
      )
    : ''
);

const profile = ref(
  profileStart !== -1
    ? job.value.content.substring(
        profileStart + profileTitle.length,
        offerStart !== -1 ? offerStart : job.value.content.length
      )
    : ''
);

const offer = ref(
  offerStart !== -1 ? job.value.content.substring(offerStart + offerTitle.length) : ''
);

watch(
  job,
  () => {
    job.value.slug = createSafeUrlFromTitle(job.value!.title);
  },
  { immediate: true, deep: true }
);

if (id.value && !job.value) {
  router.push({ name: 'job.add' });
}

const data = await Promise.all([
  getCategories(null, null, null, 'public', 'job'),
  getLocations(null, null, null, 'public'),
  getJobTypes(null, null, null, 'public'),
  is('admin') ? getCompanies(null, null, null, 'public') : Promise.resolve(undefined),
  getValues(null, null, null, 'public')
]);

const categories = data[0]?.data?.results?.rows || [];
const locations = data[1]?.data?.results?.rows || [];
const jobTypes = data[2]?.data?.results?.rows || [];
const companies = data[3]?.data?.results?.rows || [];
const values = data[4]?.data?.results?.rows || [];

const image = ref(undefined);

const fileUrl = ref(job.value.featuredImage?.fileUrl);
job.value.featuredImage && (job.value.featuredImage.fileUrl = undefined);

watch(image, () => {
  job.value.featuredImage.fileUrl = undefined;
});

const isLoading = ref(false);

const save = async () => {
  isLoading.value = true;

  if (image.value) {
    const { data } = await uploadMedia(image.value);

    if (data && data.result?.id) {
      if (!job.value.featuredImage) job.value.featuredImage = {};
      job.value.featuredImage.id = data.result?.id;
    } else {
      isLoading.value = false;
      return;
    }
  } else {
    job.value.featuredImage = undefined;
  }

  if (!job.value.category?.id) job.value.category = undefined;
  if (!job.value.location?.id) job.value.location = undefined;
  if (!job.value.jobType?.id) job.value.jobType = undefined;
  if (!job.value.company?.id) job.value.company = undefined;

  job.value.content = `
    ${
      client.value
        ? clientTitle + client.value.replace('<h2>', '<h3>').replace('</h2>', '</h3>').trim()
        : ''
    }
    ${
      missions.value
        ? missionsTitle + missions.value.replace('<h2>', '<h3>').replace('</h2>', '</h3>').trim()
        : ''
    }
    ${
      profile.value
        ? profileTitle + profile.value.replace('<h2>', '<h3>').replace('</h2>', '</h3>').trim()
        : ''
    }
    ${
      offer.value
        ? offerTitle + offer.value.replace('<h2>', '<h3>').replace('</h2>', '</h3>').trim()
        : ''
    }
  `;

  const { data: newData } = id.value ? await updateJob(job.value) : await createJob(job.value);

  if (newData?.result?.id) {
    router.push({ name: 'job.list' });
  }

  isLoading.value = false;
};
</script>
