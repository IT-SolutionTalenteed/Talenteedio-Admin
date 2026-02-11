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
              <label class="form-label">Galerie d'images</label>
              <input
                type="file"
                class="form-control mb-2"
                accept="image/*"
                multiple
                @change="handleGalleryUpload"
              />
              <div v-if="category.gallery && category.gallery.length > 0" class="d-flex flex-wrap gap-2 mt-2">
                <div v-for="(img, index) in category.gallery" :key="index" class="position-relative">
                  <img
                    :src="img"
                    alt="Gallery image"
                    class="img-thumbnail"
                    style="max-width: 100px; max-height: 100px; object-fit: cover;"
                  />
                  <button
                    type="button"
                    class="btn btn-sm btn-danger position-absolute top-0 end-0"
                    @click="removeGalleryImage(index)"
                    style="padding: 0.1rem 0.3rem;"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label">Vidéo</label>
              <input
                type="file"
                class="form-control mb-2"
                accept="video/*,image/*"
                @change="handleVideoUpload"
              />
              <small class="text-muted d-block mb-2">Uploadez une vidéo ou une image de couverture</small>
              <div v-if="videoPreview" class="mt-2">
                <video v-if="isVideoFile(category.video)" controls class="img-thumbnail" style="max-width: 300px;">
                  <source :src="videoPreview" />
                </video>
                <img
                  v-else
                  :src="videoPreview"
                  alt="Video thumbnail"
                  class="img-thumbnail"
                  style="max-width: 300px; max-height: 200px; object-fit: cover;"
                />
              </div>
              <TextInput
                label="Ou URL vidéo YouTube/Vimeo"
                placeholder="https://www.youtube.com/embed/..."
                v-model="category.video"
                class="mt-2"
              />
            </div>
            <div class="mb-4">
              <label class="form-label">Liste de détails (checklist)</label>
              <div v-for="(detail, index) in category.detailList" :key="index" class="mb-2 d-flex gap-2">
                <TextInput
                  placeholder="Détail"
                  v-model="category.detailList[index]"
                  class="flex-grow-1"
                />
                <button type="button" class="btn btn-sm btn-danger" @click="removeDetail(index)">
                  ×
                </button>
              </div>
              <button type="button" class="btn btn-sm btn-primary" @click="addDetail">
                Ajouter un détail
              </button>
            </div>
            <div class="mb-4">
              <label class="form-label">Témoignages</label>
              <div v-for="(testimonial, index) in category.testimonials" :key="index" class="mb-3 p-3 border rounded">
                <div class="mb-2">
                  <label class="form-label">Avatar</label>
                  <input
                    type="file"
                    class="form-control mb-2"
                    accept="image/*"
                    @change="(e) => handleTestimonialAvatarUpload(e, index)"
                  />
                  <img
                    v-if="testimonial.avatar"
                    :src="testimonial.avatar"
                    alt="Avatar preview"
                    class="img-thumbnail mt-2"
                    style="max-width: 80px; max-height: 80px; object-fit: cover; border-radius: 50%;"
                  />
                </div>
                <TextInput
                  label="Nom complet"
                  placeholder="John Doe"
                  class="mb-2"
                  v-model="testimonial.fullname"
                />
                <TextInput
                  label="Poste"
                  placeholder="CEO"
                  class="mb-2"
                  v-model="testimonial.job"
                />
                <TextAreaInput
                  label="Avis"
                  placeholder="Excellent service..."
                  class="mb-2"
                  v-model="testimonial.avis"
                />
                <button type="button" class="btn btn-sm btn-danger" @click="removeTestimonial(index)">
                  Supprimer
                </button>
              </div>
              <button type="button" class="btn btn-sm btn-primary" @click="addTestimonial">
                Ajouter un témoignage
              </button>
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
const galleryFiles = ref<File[]>([]);
const videoFile = ref<File | null>(null);
const videoPreview = ref<string | null>(null);

const isVideoFile = (url: string | undefined) => {
  if (!url) return false;
  return url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
};

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

const handleGalleryUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  
  if (files.length === 0) return;
  
  // Validate files
  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner uniquement des images');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('La taille de chaque fichier ne doit pas dépasser 5MB');
      return;
    }
  }
  
  galleryFiles.value.push(...files);
  
  // Upload immediately
  for (const file of files) {
    const reader = new FileReader();
    const base64Data = await new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: {
          name: file.name,
          data: base64Data,
          type: file.type,
        }
      }),
      credentials: 'include'
    });

    if (uploadResponse.ok) {
      const uploadData = await uploadResponse.json();
      if (!category.value.gallery) {
        category.value.gallery = [];
      }
      category.value.gallery.push(uploadData.url);
    } else {
      alert('Erreur lors de l\'upload d\'une image de la galerie');
    }
  }
  
  // Reset input
  target.value = '';
};

const removeGalleryImage = (index: number) => {
  category.value.gallery?.splice(index, 1);
};

const handleVideoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  // Validate file type (video or image)
  if (!file.type.startsWith('video/') && !file.type.startsWith('image/')) {
    alert('Veuillez sélectionner une vidéo ou une image');
    return;
  }
  
  // Validate file size (max 50MB for video, 5MB for image)
  const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maxSize) {
    alert(`La taille du fichier ne doit pas dépasser ${file.type.startsWith('video/') ? '50MB' : '5MB'}`);
    return;
  }
  
  videoFile.value = file;
  
  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    videoPreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
  
  // Upload immediately
  const base64Data = await new Promise<string>((resolve, reject) => {
    const uploadReader = new FileReader();
    uploadReader.onload = () => {
      const result = uploadReader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    uploadReader.onerror = reject;
    uploadReader.readAsDataURL(file);
  });

  const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file: {
        name: file.name,
        data: base64Data,
        type: file.type,
      }
    }),
    credentials: 'include'
  });

  if (uploadResponse.ok) {
    const uploadData = await uploadResponse.json();
    category.value.video = uploadData.url;
  } else {
    alert('Erreur lors de l\'upload de la vidéo');
  }
  
  // Reset input
  target.value = '';
};

const handleTestimonialAvatarUpload = async (event: Event, index: number) => {
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
  
  // Upload immediately
  const reader = new FileReader();
  const base64Data = await new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file: {
        name: file.name,
        data: base64Data,
        type: file.type,
      }
    }),
    credentials: 'include'
  });

  if (uploadResponse.ok) {
    const uploadData = await uploadResponse.json();
    if (category.value.testimonials && category.value.testimonials[index]) {
      category.value.testimonials[index].avatar = uploadData.url;
    }
  } else {
    alert('Erreur lors de l\'upload de l\'avatar');
  }
  
  // Reset input
  target.value = '';
};

const addDetail = () => {
  if (!category.value.detailList) {
    category.value.detailList = [];
  }
  category.value.detailList.push('');
};

const removeDetail = (index: number) => {
  category.value.detailList?.splice(index, 1);
};

const addTestimonial = () => {
  if (!category.value.testimonials) {
    category.value.testimonials = [];
  }
  category.value.testimonials.push({ avatar: '', fullname: '', job: '', avis: '' });
};

const removeTestimonial = (index: number) => {
  category.value.testimonials?.splice(index, 1);
};

const initialValue = {
  id: undefined,
  name: '',
  slug: '',
  subtitle: '',
  description: '',
  image: '',
  faq: [] as { question: string; answer: string }[],
  gallery: [] as string[],
  testimonials: [] as { avatar: string; fullname: string; job: string; avis: string }[],
  video: '',
  detailList: [] as string[],
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
  galleryFiles.value = [];
  videoFile.value = null;
  videoPreview.value = null;
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

    // Ajouter la galerie si elle existe
    if (category.value.gallery && category.value.gallery.length > 0) {
      cleanedCategory.gallery = category.value.gallery;
    }

    // Filtrer les témoignages valides
    const validTestimonials = category.value.testimonials?.filter(
      t => t.avatar?.trim() && t.fullname?.trim() && t.job?.trim() && t.avis?.trim()
    );
    if (validTestimonials && validTestimonials.length > 0) {
      cleanedCategory.testimonials = validTestimonials;
    }

    // Ajouter la vidéo si elle existe
    if (category.value.video && category.value.video.trim()) {
      cleanedCategory.video = category.value.video.trim();
    }

    // Filtrer les détails non vides
    const validDetails = category.value.detailList?.filter(d => d?.trim());
    if (validDetails && validDetails.length > 0) {
      cleanedCategory.detailList = validDetails;
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
      faq: data.result.faq || [],
      gallery: data.result.gallery || [],
      testimonials: data.result.testimonials || [],
      video: data.result.video || '',
      detailList: data.result.detailList || []
    };
    
    // Set image preview if category has an image
    if (data.result.image) {
      imagePreview.value = data.result.image;
    }
    
    // Set video preview if category has a video
    if (data.result.video) {
      videoPreview.value = data.result.video;
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
