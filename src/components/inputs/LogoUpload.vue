<template>
  <div class="logo-upload">
    <label class="form-label">Logo de l'entreprise</label>
    
    <div class="logo-container">
      <div class="logo-preview">
        <img v-if="currentLogoUrl && !isUploading" :src="currentLogoUrl" alt="Logo de l'entreprise" />
        <div v-else-if="!isUploading" class="default-icon">
          <i class="bi bi-building"></i>
        </div>
        <div v-if="isUploading" class="uploading">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <span class="mt-2">Upload en cours...</span>
        </div>
      </div>
    </div>

    <div class="actions">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="onFileSelected"
        :disabled="disabled || isUploading"
        style="display: none"
      />

      <button
        type="button"
        class="btn btn-primary btn-sm"
        @click="triggerFileInput"
        :disabled="disabled || isUploading"
      >
        <i class="bi bi-upload"></i>
        {{ currentLogoUrl ? 'Changer' : 'Ajouter' }} le logo
      </button>

      <button
        v-if="currentLogoUrl && !isUploading"
        type="button"
        class="btn btn-danger btn-sm"
        @click="removeLogo"
        :disabled="disabled"
      >
        <i class="bi bi-trash"></i>
        Supprimer
      </button>
    </div>

    <div v-if="uploadError" class="alert alert-danger mt-2" role="alert">
      {{ uploadError }}
    </div>

    <div class="help-text">Formats acceptés: JPG, PNG, GIF (max 5MB)</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { uploadMedia } from '@/views/dashboard-module/stores/services/media.service';

interface Props {
  modelValue?: string | null;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void;
  (e: 'logoChanged', mediaId: string, fileUrl: string): void;
  (e: 'logoRemoved'): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const currentLogoUrl = ref<string | null>(props.modelValue);
const isUploading = ref(false);
const uploadError = ref<string | null>(null);

watch(
  () => props.modelValue,
  (newValue) => {
    currentLogoUrl.value = newValue;
  }
);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const onFileSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      uploadError.value = 'Veuillez sélectionner une image valide';
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      uploadError.value = "L'image ne doit pas dépasser 5MB";
      return;
    }

    uploadError.value = null;
    isUploading.value = true;

    try {
      const response = await uploadMedia(file, 'image');
      
      if (response?.data?.result) {
        const media = response.data.result;
        currentLogoUrl.value = media.fileUrl;
        emit('update:modelValue', media.fileUrl);
        emit('logoChanged', media.id, media.fileUrl);
      } else {
        uploadError.value = "Erreur lors de l'upload de l'image";
      }
    } catch (error) {
      console.error('Upload error:', error);
      uploadError.value = "Erreur lors de l'upload de l'image";
    } finally {
      isUploading.value = false;
      // Reset input
      if (input) input.value = '';
    }
  }
};

const removeLogo = () => {
  currentLogoUrl.value = null;
  emit('update:modelValue', null);
  emit('logoRemoved');
};
</script>

<style scoped lang="scss">
.logo-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background-color: #f8f9fa;
  margin-bottom: 20px;

  .form-label {
    align-self: flex-start;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .logo-container {
    position: relative;

    .logo-preview {
      width: 150px;
      height: 150px;
      border-radius: 8px;
      border: 3px solid #0d6efd;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background-color: #fff;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        padding: 10px;
      }

      .default-icon {
        font-size: 60px;
        color: #ccc;

        i {
          font-size: 60px;
        }
      }

      .uploading {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;

        span {
          font-size: 12px;
          color: #6c757d;
        }
      }
    }
  }

  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .help-text {
    font-size: 12px;
    color: #6c757d;
    text-align: center;
  }
}
</style>