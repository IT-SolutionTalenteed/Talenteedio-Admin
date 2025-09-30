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
        oldPassword: undefined
      }
);

if (props.id && !user.value) {
  router.push({ name: 'user.add' });
} else {
  user.value.role =
    user.value.roles && user.value.roles.map((role: any) => role.name).includes('admin')
      ? 'admin'
      : 'other';
}

const isLoading = ref(false);

const save = async () => {
  isLoading.value = true;

  user.value.password = user.value.password || undefined;
  user.value.roles = undefined;

  const { data: newData } = props.id ? await updateUser(user.value) : await createUser(user.value);

  if (newData?.result?.id) {
    router.push({ name: 'user.list' });
  }

  isLoading.value = false;
};
</script>
