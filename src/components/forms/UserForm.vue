<template>
  <form class="card" @submit.prevent="save">
    <div class="card-header">User information</div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6 mb-4">
          <TextInput
            label="Firstname"
            :required="true"
            placeholder="Add firstname"
            v-model="user.firstname"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Lastname"
            :required="true"
            placeholder="Add lastname"
            v-model="user.lastname"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Email"
            :required="true"
            placeholder="Add email"
            v-model="user.email"
            type="email"
          />
        </div>
        <div class="col-md-6 mb-4">
          <MultiSelectInput
            v-if="is('admin')"
            :options="['admin', 'other']"
            :normalizer="(role: any) => {
              return {
                label: role,
                value: role
              };
            }"
            :required="true"
            :multiple="false"
            v-model="user.role"
            label="Role"
            type="classic"
          />
        </div>
        <div class="col-md-6 mb-4">
          <PasswordInput
            label="New password"
            placeholder="Add new password"
            :required="id ? false : true"
            v-model="user.password"
          />
        </div>
        <div class="col-md-6 mb-4">
          <PasswordInput
            label="Confirm password"
            placeholder="Confirm password"
            v-model="user.confirmPassword"
            v-if="!is('admin')"
          />
        </div>
        <div class="col-md-6 mb-4">
          <PasswordInput
            label="Password"
            placeholder="Password"
            v-model="user.oldPassword"
            v-if="!is('admin')"
          />
        </div>
      </div>

      <!-- Section Google Account -->
      <div class="row mt-4" v-if="!is('admin')">
        <div class="col-12">
          <div class="card border-info">
            <div class="card-header bg-light">
              <h6 class="mb-0">
                <i class="fab fa-google me-2"></i>
                Compte Google
              </h6>
            </div>
            <div class="card-body">
              <!-- Si pas encore lié -->
              <div v-if="!user.googleId" class="text-center">
                <p class="text-muted mb-3">
                  Liez votre compte Google pour vous connecter plus facilement à Talenteed
                </p>
                <button 
                  type="button"
                  @click="linkGoogleAccount" 
                  :disabled="isLinkingGoogle"
                  class="btn btn-outline-primary d-flex align-items-center mx-auto"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" class="me-2">
                    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.53H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                    <path fill="#FBBC05" d="M4.5 10.49a4.8 4.8 0 0 1 0-3.07V5.35H1.83a8 8 0 0 0 0 7.28l2.67-2.14z"/>
                    <path fill="#EA4335" d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.54-2.54a8 8 0 0 0-5.98-2.39 8 8 0 0 0-7.15 4.42l2.67 2.14c.63-1.89 2.39-3.18 4.48-3.18z"/>
                  </svg>
                  {{ isLinkingGoogle ? 'Liaison en cours...' : 'Lier mon compte Google' }}
                </button>
              </div>
              
              <!-- Si déjà lié -->
              <div v-else class="text-center">
                <div class="alert alert-success d-flex align-items-center">
                  <i class="fas fa-check-circle me-2"></i>
                  <div>
                    <strong>Compte Google lié avec succès !</strong><br>
                    <small class="text-muted">{{ user.email }}</small>
                  </div>
                </div>
                <button 
                  type="button"
                  @click="unlinkGoogleAccount" 
                  class="btn btn-outline-danger btn-sm"
                  :disabled="isUnlinkingGoogle"
                >
                  {{ isUnlinkingGoogle ? 'Déliaison...' : 'Délier le compte Google' }}
                </button>
              </div>
              
              <!-- Messages d'erreur/succès -->
              <div v-if="googleMessage" :class="googleMessageClass" class="mt-3">
                {{ googleMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer d-flex justify-content-end">
      <SubmitButton :loading="isLoading" :disabled="isLoading"> Save </SubmitButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  createUser,
  getUser,
  updateUser
} from '@/views/dashboard-module/stores/services/user.service';

import { useAuthStore } from '@/views/auth-module/stores/auth.store';

import TextInput from '@/components/inputs/TextInput.vue';
import PasswordInput from '@/components/inputs/PasswordInput.vue';
import MultiSelectInput from '@/components/inputs/MultiSelectInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';
import ProfilePictureUpload from '@/components/inputs/ProfilePictureUpload.vue';

const authStore = useAuthStore();
const { is } = authStore;

const router = useRouter();

const props = defineProps<{ id: string }>();

const user = ref<any>(
  props.id
    ? (await getUser(props.id))?.data?.result
    : {
        id: undefined,
        email: undefined,
        firstname: undefined,
        lastname: undefined,
        roles: undefined,
        role: 'other',
        password: undefined,
        confirmPassword: undefined,
        oldPassword: undefined,
        profilePictureId: undefined,
        profilePictureUrl: undefined
      }
);

if (props.id && !user.value) {
  router.push({ name: 'user.add' });
} else {
  user.value.role =
    user.value.roles && user.value.roles.map((role: any) => role.name).includes('admin')
      ? 'admin'
      : 'other';
  
  // Initialiser l'URL de la photo de profil
  if (user.value.profilePicture) {
    user.value.profilePictureUrl = user.value.profilePicture.fileUrl;
    user.value.profilePictureId = user.value.profilePicture.id;
  }
}

const isLoading = ref(false);
const isLinkingGoogle = ref(false);
const isUnlinkingGoogle = ref(false);
const googleMessage = ref('');
const googleMessageClass = ref('');

const onProfilePictureChanged = (mediaId: string, fileUrl: string) => {
  user.value.profilePictureId = mediaId;
  user.value.profilePictureUrl = fileUrl;
};

const onProfilePictureRemoved = () => {
  user.value.profilePictureId = null;
  user.value.profilePictureUrl = null;
};

const save = async () => {
  isLoading.value = true;

  user.value.password = user.value.password || undefined;
  user.value.roles = undefined;
  
  // Préparer les données pour l'envoi
  const userData = {
    ...user.value,
    profilePicture: user.value.profilePictureId ? { id: user.value.profilePictureId } : null
  };
  
  // Supprimer les champs temporaires
  delete userData.profilePictureUrl;
  delete userData.profilePictureId;

  const { data: newData } = props.id ? await updateUser(userData) : await createUser(userData);

  if (newData?.result?.id) {
    // Si c'est le profil de l'utilisateur connecté, mettre à jour le store d'authentification
    if (props.id && props.id === authStore.user?.id) {
      authStore.user = newData.result;
    }
    
    router.push({ name: 'user.list' });
  }

  isLoading.value = false;
};

// Méthodes Google Account
const loadGoogleAPI = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Google API'));
    document.head.appendChild(script);
  });
};

const linkGoogleAccount = async () => {
  isLinkingGoogle.value = true;
  googleMessage.value = '';
  
  try {
    // Charger l'API Google
    await loadGoogleAPI();
    
    // Initialiser Google Sign-In
    window.google.accounts.id.initialize({
      client_id: '694175521874-pke5utmlb5rmo9ptfqo7t35rvkto4kmk.apps.googleusercontent.com', // Votre Google Client ID
      callback: handleGoogleResponse
    });
    
    // Déclencher la popup Google
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        isLinkingGoogle.value = false;
        googleMessage.value = 'Popup Google fermée ou bloquée';
        googleMessageClass.value = 'alert alert-warning';
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la liaison:', error);
    googleMessage.value = 'Erreur lors du chargement de Google Sign-In';
    googleMessageClass.value = 'alert alert-danger';
    isLinkingGoogle.value = false;
  }
};

const handleGoogleResponse = async (response) => {
  try {
    if (!response.credential) {
      throw new Error('Aucun credential reçu de Google');
    }
    
    // Appeler l'API backend pour lier le compte
    const result = await fetch('/api/auth/link-google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Important pour envoyer les cookies de session
      body: JSON.stringify({
        credential: response.credential
      })
    });
    
    const data = await result.json();
    
    if (result.ok) {
      googleMessage.value = 'Compte Google lié avec succès !';
      googleMessageClass.value = 'alert alert-success';
      
      // Mettre à jour l'utilisateur local
      user.value.googleId = 'linked'; // On met une valeur pour indiquer que c'est lié
      
      // Mettre à jour le store d'authentification si c'est le profil de l'utilisateur connecté
      if (props.id === authStore.user?.id) {
        // Recharger les données utilisateur
        const updatedUser = await getUser(props.id);
        if (updatedUser?.data?.result) {
          authStore.user = updatedUser.data.result;
          user.value = updatedUser.data.result;
        }
      }
      
    } else {
      googleMessage.value = data.msg || 'Erreur lors de la liaison';
      googleMessageClass.value = 'alert alert-danger';
    }
    
  } catch (error) {
    console.error('Erreur:', error);
    googleMessage.value = 'Erreur lors de la liaison du compte Google';
    googleMessageClass.value = 'alert alert-danger';
  } finally {
    isLinkingGoogle.value = false;
  }
};

const unlinkGoogleAccount = async () => {
  if (!confirm('Êtes-vous sûr de vouloir délier votre compte Google ?')) {
    return;
  }
  
  isUnlinkingGoogle.value = true;
  googleMessage.value = '';
  
  try {
    // Appeler l'API backend pour délier le compte (à implémenter si nécessaire)
    const result = await fetch('/api/auth/unlink-google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    if (result.ok) {
      googleMessage.value = 'Compte Google délié avec succès';
      googleMessageClass.value = 'alert alert-success';
      user.value.googleId = null;
      
      // Mettre à jour le store si nécessaire
      if (props.id === authStore.user?.id) {
        authStore.user.googleId = null;
      }
    } else {
      const data = await result.json();
      googleMessage.value = data.msg || 'Erreur lors de la déliaison';
      googleMessageClass.value = 'alert alert-danger';
    }
    
  } catch (error) {
    console.error('Erreur:', error);
    googleMessage.value = 'Erreur lors de la déliaison du compte Google';
    googleMessageClass.value = 'alert alert-danger';
  } finally {
    isUnlinkingGoogle.value = false;
  }
};
</script>
