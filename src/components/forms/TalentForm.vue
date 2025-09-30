<template>
  <form class="row" @submit.prevent="save">
    <div class="col-md-8">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Talent content</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <TextInput
                label="Title"
                :required="true"
                placeholder="Add talent title"
                v-model="talent.title"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="Phone"
                :required="true"
                placeholder="Add phone number"
                v-model="talent.contact.phoneNumber"
              />
            </div>
            <div class="col-md-6">
              <TextInput
                label="Address line"
                :required="true"
                placeholder="Add address line"
                v-model="talent.contact.address.line"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="City"
                :required="true"
                placeholder="Add city"
                v-model="talent.contact.address.city"
              />
            </div>
            <div class="col-md-6">
              <TextInput
                label="Postal code"
                :required="true"
                placeholder="Add postal code"
                v-model="talent.contact.address.postalCode"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="State"
                placeholder="Add state"
                v-model="talent.contact.address.state"
              />
            </div>
            <div class="col-md-6 mb-4">
              <SelectCountryInput
                :required="true"
                placeholder="Add country"
                v-model="talent.contact.address.country"
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
                  v-model="talent.category"
                  label="Category"
                />
              </div>
              <div class="col-md-12 mb-4">
                <MultiSelectInput
                  :options="values"
                  :normalizer="(obj: any) => {
                    return {
                      label: obj.title,
                      value: obj.id
                    };
                  }"
                  :multiple="true"
                  v-model="talent.values"
                  label="Values"
                  :required="true"
                />
              </div>
              <div class="col-md-12 mb-4" v-if="is('admin')">
                <MultiSelectInput
                  :options="users"
                  :required="talent.user.id ? false : true"
                  :normalizer="(obj: any) => {
                        return {
                          label: obj.email,
                          value: obj.id
                        };
                      }"
                  :multiple="false"
                  v-model="talent.user"
                  label="User"
                />
                <RouterLink
                  :to="{ name: 'user.edit', params: { id: talent.user.id } }"
                  v-if="talent.user.id"
                  class="mt-2 d-inline-block"
                  >Edit user</RouterLink
                >
                <RouterLink :to="{ name: 'user.add' }" v-else class="mt-2 d-inline-block"
                  >Add user</RouterLink
                >
              </div>
              <div class="col-md-12" v-if="fileUrl">
                <label class="form-label"> Consent </label>
                <a :href="fileUrl" target="_blank" class="d-inline-block mt-2">View consent</a>
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
import MultiSelectInput from '@/components/inputs/MultiSelectInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import { getCategories } from '@/views/dashboard-module/stores/services/category.service';
import {
  createTalent,
  getTalent,
  updateTalent
} from '@/views/dashboard-module/stores/services/talent.service';

import { getUsers } from '@/views/dashboard-module/stores/services/user.service';

import { useAuthStore } from '@/views/auth-module/stores/auth.store';
import { getValues } from '../../views/dashboard-module/stores/services/value.service';

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
  address: initialAddress
};

const talent = ref<any>(
  props.id
    ? (await getTalent(props.id))?.data?.result
    : {
        id: undefined,
        title: undefined,
        status: 'in_review',
        contact: structuredClone(initialContact),
        category: {
          id: undefined
        },
        user: {
          id: undefined
        }
      }
);

if (!talent.value.contact.address) {
  talent.value.contact.address = initialAddress;
}

if (props.id && !talent.value) {
  router.push({ name: 'talent.add' });
}

if (!talent.value.contact) {
  talent.value.contact = structuredClone(initialContact);
}

const fileUrl = ref(talent.value.consent?.fileUrl);
talent.value.consent && (talent.value.consent = undefined);

const data = await Promise.all([
  getCategories(null, null, null, 'public', 'talent'),
  is('admin') ? getUsers(null, null, null, undefined, true) : Promise.resolve(undefined),
  getValues(null, null, null, 'public')
]);

const categories = data[0].data?.results?.rows || [];
const users = data?.[1]?.data?.results?.rows || [];
const values = data[2]?.data?.results?.rows || [];

const isLoading = ref(false);

const save = async () => {
  isLoading.value = true;

  if (!talent.value.category?.id) talent.value.category = undefined;

  const { data: newData } = props.id
    ? await updateTalent(talent.value)
    : await createTalent(talent.value);

  if (newData?.result?.id) {
    router.push({ name: 'talent.list' });
  }

  isLoading.value = false;
};
</script>
