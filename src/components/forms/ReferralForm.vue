<template>
  <form class="row" @submit.prevent="save">
    <div class="col-md-8">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Referral content</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <TextInput
                label="Title"
                :required="true"
                placeholder="Add referral title"
                v-model="referral.title"
              />
            </div>

            <div class="col-md-6 mb-4">
              <TextInput
                label="Phone"
                :required="true"
                placeholder="Add phone number"
                v-model="referral.contact.phoneNumber"
              />
            </div>
            <div class="col-md-6">
              <TextInput
                label="Address line"
                :required="true"
                placeholder="Add address line"
                v-model="referral.contact.address.line"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="City"
                :required="true"
                placeholder="Add city"
                v-model="referral.contact.address.city"
              />
            </div>
            <div class="col-md-6">
              <TextInput
                label="Postal code"
                :required="true"
                placeholder="Add postal code"
                v-model="referral.contact.address.postalCode"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="State"
                placeholder="Add state"
                v-model="referral.contact.address.state"
              />
            </div>
            <div class="col-md-6 mb-4">
              <SelectCountryInput
                :required="true"
                placeholder="Add country"
                v-model="referral.contact.address.country"
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
      <div class="col-md-12 mt-4" v-if="false">
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
                  v-model="referral.status"
                  name="status"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-md-12 mb-4">
                <MultiSelectInput
                  :options="categories"
                  :normalizer="(obj: any) => {
                        return {
                          label: obj.name,
                          value: obj.id
                        };
                      }"
                  :multiple="false"
                  v-model="referral.category"
                  label="Category"
                />
              </div>
              <div class="col-md-12" v-if="is('admin')">
                <MultiSelectInput
                  :options="users"
                  :required="referral.user.id ? false : true"
                  :normalizer="(obj: any) => {
                        return {
                          label: obj.email,
                          value: obj.id
                        };
                      }"
                  :multiple="false"
                  v-model="referral.user"
                  label="User"
                />
                <RouterLink
                  :to="{ name: 'user.edit', params: { id: referral.user.id } }"
                  v-if="referral.user.id"
                  class="mt-2 d-inline-block"
                  >Edit user</RouterLink
                >
                <RouterLink :to="{ name: 'user.add' }" v-else class="mt-2 d-inline-block"
                  >Add user</RouterLink
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import TextInput from '@/components/inputs/TextInput.vue';
import SelectCountryInput from '@/components/inputs/SelectCountryInput.vue';
import RadioInput from '@/components/inputs/RadioInput.vue';
import MultiSelectInput from '@/components/inputs/MultiSelectInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import { getCategories } from '@/views/dashboard-module/stores/services/category.service';
import {
  createReferral,
  getReferral,
  updateReferral
} from '@/views/dashboard-module/stores/services/referral.service';
import { getUsers } from '@/views/dashboard-module/stores/services/user.service';

import { useAuthStore } from '@/views/auth-module/stores/auth.store';

const router = useRouter();

const { is } = useAuthStore();

const props = defineProps<{ id: string }>();

const initialAddress = {
  line: undefined,
  city: undefined,
  country: undefined,
  postalCode: undefined,
  state: undefined
};

const initialContact = {
  phoneNumber: undefined,
  address: structuredClone(initialAddress)
};

const referral = ref<any>(
  props.id
    ? (await getReferral(props.id))?.data?.result
    : {
        id: undefined,
        title: undefined,
        status: 'public',
        contact: structuredClone(initialContact),
        category: {
          id: undefined
        },
        user: {
          id: undefined
        }
      }
);

if (props.id && !referral.value) {
  router.push({ name: 'referral.add' });
}

if (!referral.value.contact) {
  referral.value.contact = structuredClone(initialContact);
}

if (!referral.value.contact.address) {
  referral.value.contact.address = structuredClone(initialAddress);
}

const data = await Promise.all([
  getCategories(null, null, null, 'public', 'referral'),
  is('admin') ? getUsers(null, null, null, undefined, true) : Promise.resolve(undefined)
]);

const categories = data[0].data?.results?.rows || [];
const users = data?.[1]?.data?.results?.rows || [];

const isLoading = ref(false);

const save = async () => {
  isLoading.value = true;

  if (!referral.value.category?.id) referral.value.category = undefined;

  const { data: newData } = props.id
    ? await updateReferral(referral.value)
    : await createReferral(referral.value);

  if (newData?.result?.id) {
    router.push({ name: 'referral.list' });
  }

  isLoading.value = false;
};
</script>
