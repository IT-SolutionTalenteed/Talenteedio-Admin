<template>
  <PageHeader
    :title="`${model} category`"
    page="Category"
    :breadcrumbs="[{ label: model, route: model.toLocaleLowerCase() }]"
  />

  <div class="page-body">
    <div class="row flex-grow-1">
      <div class="col-md-4">
        <form class="card" @submit.prevent="save">
          <div class="card-body">
            <TextInput
              label="Name"
              :required="true"
              placeholder="Add category name"
              class="mb-4"
              v-model="category.name"
            />
            <TextInput
              label="Slug"
              :required="true"
              placeholder="Add category slug"
              class="mb-4"
              v-model="category.slug"
              disabled
            />
            <TextInput
              label="Sous-titre"
              placeholder="Add category subtitle"
              class="mb-4"
              v-model="category.subtitle"
            />
            <TextAreaInput
              label="Description"
              placeholder="Add category description"
              class="mb-4"
              v-model="category.description"
            />
            <div class="mb-4">
              <label class="form-label">Image de la catégorie</label>
              <input
                type="file"
                class="form-control"
                accept="image/*"
                @change="handleImageUpload"
              />
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="Category preview"
                class="img-thumbnail mt-2"
                style="max-width: 300px; max-height: 200px; object-fit: cover;"
              />
            </div>
            <div class="mb-4">
              <label class="form-label">FAQ</label>
              <div v-for="(faqItem, index) in category.faq" :key="index" class="mb-3 p-3 border rounded">
                <TextInput
                  label="Question"
                  placeholder="Add question"
                  class="mb-2"
                  v-model="faqItem.question"
                />
                <TextAreaInput
                  label="Réponse"
                  placeholder="Add answer"
                  class="mb-2"
                  v-model="faqItem.answer"
                />
                <button type="button" class="btn btn-sm btn-danger" @click="removeFAQ(index)">
                  Supprimer
                </button>
              </div>
              <button type="button" class="btn btn-sm btn-primary" @click="addFAQ">
                Ajouter une FAQ
              </button>
            </div>
            <RadioInput
              label="Status"
              v-model="category.status"
              :options="[
                { title: 'Public', value: 'public' },
                { title: 'Draft', value: 'draft' },
                { title: 'Blocked', value: 'blocked' }
              ]"
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
          :data-structure="{ name: 'Name', slug: 'Slug', status: 'Status' }"
          :normalizer="(arr: any) => {
            return arr.map((data: any) => {
              return {
                id: data.id,
                name: data.name,
                slug: data.slug,
                status: data.status
              }
            })
          }"
          :edit-action="setCurrentCategory"
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
import TextAreaInput from '@/components/inputs/TextAreaInput.vue';
import RadioInput from '@/components/inputs/RadioInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import {
  createCategory,
  updateCategory,
  getCategories,
  deleteCategory,
  getCategory
} from '../stores/services/category.service';

import { createSafeUrlFromTitle } from '@/utils/helpers';

interface Props {
  model: string;
}

const props = defineProps<Props>();

const isSaveLoading = ref(false);
const isDataLoading = ref(false);
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Veuillez sélectionner une image');
    return;
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('La taille du fichier ne doit pas dépasser 5MB');
    return;
  }
  
  imageFile.value = file;
  
  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const initialValue = {
  id: undefined,
  name: '',
  slug: '',
  subtitle: '',
  description: '',
  image: '',
  faq: [] as { question: string; answer: string }[],
  status: 'public',
  model: props.model
};

const category = ref(structuredClone(initialValue));

watch(
  category,
  () => {
    category.value.slug = createSafeUrlFromTitle(category.value!.name);
  },
  { immediate: true, deep: true }
);

const reset = () => {
  category.value = structuredClone(initialValue);
  imageFile.value = null;
  imagePreview.value = null;
};

const addFAQ = () => {
  category.value.faq.push({ question: '', answer: '' });
};

const removeFAQ = (index: number) => {
  category.value.faq.splice(index, 1);
};

const tableKey = ref(0);

const save = async () => {
  isSaveLoading.value = true;

  try {
    // Upload image if a new file is selected
    let imageUrl = category.value.image;
    if (imageFile.value) {
      console.log('Starting image upload...');
      
      // Convert file to base64
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data:image/...;base64, prefix
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile.value!);
      });

      console.log('Base64 data length:', base64Data.length);
      console.log('Upload URL:', `${import.meta.env.VITE_API_URL}/upload`);

      const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: {
            name: imageFile.value.name,
            data: base64Data,
            type: imageFile.value.type,
          }
        }),
        credentials: 'include'
      });

      console.log('Upload response status:', uploadResponse.status);
      
      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        console.log('Upload successful:', uploadData);
        imageUrl = uploadData.url;
      } else {
        const errorText = await uploadResponse.text();
        console.error('Upload error:', errorText);
        alert(`Erreur lors de l'upload de l'image: ${errorText}`);
        isSaveLoading.value = false;
        return;
      }
    }

    // Nettoyer les données avant l'envoi
    const cleanedCategory: any = {
      id: category.value.id,
      name: category.value.name,
      slug: category.value.slug,
      status: category.value.status,
      model: category.value.model
    };

    // Ajouter les champs optionnels seulement s'ils ont une valeur
    if (category.value.subtitle && category.value.subtitle.trim()) {
      cleanedCategory.subtitle = category.value.subtitle.trim();
    }

    if (category.value.description && category.value.description.trim()) {
      cleanedCategory.description = category.value.description.trim();
    }

    if (imageUrl && imageUrl.trim()) {
      cleanedCategory.image = imageUrl.trim();
    }

    // Filtrer les FAQ vides
    const validFaq = category.value.faq.filter(f => f.question?.trim() && f.answer?.trim());
    if (validFaq.length > 0) {
      cleanedCategory.faq = validFaq;
    }

    if (category.value.id) {
      const { data } = await updateCategory(cleanedCategory);

      if (data?.result?.id) {
        reset();
        tableKey.value += 1;
      }
    } else {
      // Pour la création, on ne doit pas envoyer l'id
      delete cleanedCategory.id;
      const { data } = await createCategory(cleanedCategory);

      if (data?.result?.id) {
        reset();
        tableKey.value += 1;
      }
    }
  } catch (error) {
    console.error('Error saving category:', error);
    alert('Erreur lors de la sauvegarde de la catégorie');
  } finally {
    isSaveLoading.value = false;
  }
};

const getData = async (
  limit: number | null,
  page: number | null,
  search: string | null,
  status?: string
) => {
  return await getCategories(limit, page, search, status, props.model);
};

const setCurrentCategory = async (id: string) => {
  isDataLoading.value = true;
  const { data } = await getCategory(id);

  if (data?.result) {
    category.value = {
      ...data.result,
      faq: data.result.faq || []
    };
    
    // Set image preview if category has an image
    if (data.result.image) {
      imagePreview.value = data.result.image;
    }
  }

  isDataLoading.value = false;
};

const removeData = async (id?: string) => {
  await deleteCategory(id);
  reset();
};
</script>

<style scoped lang="scss"></style>
