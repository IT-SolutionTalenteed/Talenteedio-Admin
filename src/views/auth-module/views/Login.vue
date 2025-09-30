<template>
  <div id="login">
    <div class="card card-md">
      <div class="card-body">
        <h2 class="h2 text-center mb-4">Login to your account</h2>
        <form autocomplete="off" novalidate @submit.prevent="authentificate(payload)">
          <div class="mb-4">
            <TextInput
              label="Email"
              type="email"
              placeholder="your@email.com"
              v-model="payload.email"
            />
          </div>
          <div class="mb-4">
            <PasswordInput label="Password" v-model="payload.password" class="mb-1" />
          </div>
          <div class="mb-4">
            <label class="form-check">
              <input type="checkbox" class="form-check-input" v-model="payload.rememberMe" />
              <span class="form-check-label">Remember me on this device</span>
            </label>
          </div>
          <div class="form-footer">
            <SubmitButton class="w-100" :loading="isLoading">Login</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import SubmitButton from '@/components/inputs/SubmitButton.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import PasswordInput from '@/components/inputs/PasswordInput.vue';

import { useAuthStore, useAuthConfigStore } from '../stores/auth.store';
import type { LoginPayload } from '../stores/models/auth.interface';

const authStore = useAuthStore();
const { authentificate } = authStore;

const authConfigStore = useAuthConfigStore();
const { isLoading } = storeToRefs(authConfigStore);

const payload = ref<LoginPayload>({
  email: '',
  password: '',
  rememberMe: false
});
</script>
