<template>
  <PageHeader
    :title="id ? 'Edit article' : 'Add article'"
    :page="id ? 'Edit' : 'Add'"
    :breadcrumbs="[{ label: 'Article', route: 'article' }]"
  />

  <div class="page-body">
    <form class="row" @submit.prevent="save">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Article content</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <TextInput
                  label="Title"
                  :required="true"
                  placeholder="Add article title"
                  v-model="article.title"
                />
              </div>
              <div class="col-md-12 mt-4">
                <TextInput
                  label="Slug"
                  :required="true"
                  placeholder="Add event slug"
                  v-model="article.slug"
                  disabled
                />
              </div>
              <div class="col-md-12 mt-4">
                <TextAreaInput
                  label="Meta description for SEO"
                  placeholder="Add meta description"
                  v-model="article.metaDescription"
                />
              </div>
              <div class="col-md-12 mt-4" v-if="article.isPremium">
                <div :class="{ 'form-label': true, required: article.isPremium }">
                  Public content
                </div>
                <ckeditor :editor="ClassicEditor" v-model="article.publicContent"></ckeditor>
              </div>
              <div class="col-md-12 mt-4">
                <div class="form-label required">Content</div>
                <ckeditor :editor="ClassicEditor" v-model="article.content"></ckeditor>
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
                    v-model="article.status"
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
              <h3 class="card-title">Premium status</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-12">
                  <RadioInput
                    :options="[
                      { title: 'Premium', value: true },
                      { title: 'Not premium', value: false }
                    ]"
                    v-model="article.isPremium"
                    name="premium"
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
                    v-model="article.categories"
                    label="Categories"
                  />
                </div>
                <div class="col-md-12 mt-4" v-if="is('admin')">
                  <MultiSelectInput
                    :options="companies"
                    :normalizer="(obj: any) => {
                      return {
                        label: obj.company_name,
                        value: obj.id
                      };
                    }"
                    :multiple="false"
                    v-model="article.company"
                    label="Company"
                    :required="true"
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

import PageHeader from '@/components/PageHeader.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import TextAreaInput from '@/components/inputs/TextAreaInput.vue';
import RadioInput from '@/components/inputs/RadioInput.vue';
import MultiSelectInput from '@/components/inputs/MultiSelectInput.vue';
import FileInput from '@/components/inputs/FileInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { getCategories } from '../../stores/services/category.service';
import { uploadMedia } from '../../stores/services/media.service';
import { createArticle, getArticle, updateArticle } from '../../stores/services/article.service';

import { createSafeUrlFromTitle } from '@/utils/helpers';
import { getCompanies } from '../../stores/services/company.service';
import { useAuthStore } from '@/views/auth-module/stores/auth.store';
import { storeToRefs } from 'pinia';

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();
const { is } = authStore;
const { user } = storeToRefs(authStore);

const id = computed(() => route.params.id as string);

const article = ref<any>(
  id.value
    ? (await getArticle(id.value))?.data?.result
    : {
        title: '',
        slug: '',
        content: '',
        metaDescription: '',
        status: 'public',
        image: {
          id: undefined
        },
        categories: [] as any,
        company: {
          id: is('company') ? user.value?.company?.id : undefined
        },
        isPremium: false
      }
);

watch(
  article,
  () => {
    article.value.slug = createSafeUrlFromTitle(article.value!.title);
  },
  { immediate: true, deep: true }
);

if (id.value && !article.value) {
  router.push({ name: 'article.add' });
}

const data = await Promise.all([
  getCategories(null, null, null, 'public', 'article'),
  getCompanies(null, null, null, 'public')
]);

const categories = data[0].data?.results?.rows || [];
const companies = data[1].data?.results?.rows || [];

const image = ref(undefined);

const fileUrl = ref(article.value.image?.fileUrl);
article.value.image && (article.value.image.fileUrl = undefined);

watch(image, () => {
  article.value.image.fileUrl = undefined;
});

const isLoading = ref(false);

const save = async () => {
  isLoading.value = true;

  if (image.value) {
    const { data } = await uploadMedia(image.value);

    if (data && data.result?.id) {
      if (!article.value.image) article.value.image = {};
      article.value.image.id = data.result?.id;
    } else {
      isLoading.value = false;
      return;
    }
  } else {
    article.value.image = undefined;
  }

  const { data: newData } = id.value
    ? await updateArticle(article.value)
    : await createArticle(article.value);

  if (newData?.result?.id) {
    router.push({ name: 'article.list' });
  }

  isLoading.value = false;
};
</script>
