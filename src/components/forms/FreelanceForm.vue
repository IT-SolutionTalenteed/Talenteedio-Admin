<template>
  <form class="row" @submit.prevent="save">
    <div class="col-md-8">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Freelance content</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <TextInput
                label="Title"
                :required="true"
                placeholder="Add freelance title"
                v-model="freelance.title"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="Phone"
                :required="true"
                placeholder="Add phone number"
                v-model="freelance.contact.phoneNumber"
              />
            </div>
            <div class="col-md-6">
              <TextInput
                label="Address line"
                :required="true"
                placeholder="Add address line"
                v-model="freelance.contact.address.line"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="City"
                :required="true"
                placeholder="Add city"
                v-model="freelance.contact.address.city"
              />
            </div>
            <div class="col-md-6">
              <TextInput
                label="Postal code"
                :required="true"
                placeholder="Add postal code"
                v-model="freelance.contact.address.postalCode"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="State"
                placeholder="Add state"
                v-model="freelance.contact.address.state"
              />
            </div>
            <div class="col-md-6 mb-4">
              <SelectCountryInput
                :required="true"
                placeholder="Add country"
                v-model="freelance.contact.address.country"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="TJM (€)"
                type="number"
                placeholder="Daily rate"
                v-model="freelance.tjm"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="Mobility"
                placeholder="e.g., France, Europe"
                v-model="freelance.mobility"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="Availability Date"
                type="date"
                v-model="freelance.availabilityDate"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="Desired Location"
                placeholder="e.g., Paris, Remote"
                v-model="freelance.desiredLocation"
              />
            </div>
            <div class="col-md-6 mb-4">
              <MultiSelectInput
                :options="workModes"
                :normalizer="(obj: any) => {
                  return {
                    label: obj.label,
                    value: obj.value
                  };
                }"
                :multiple="false"
                v-model="freelance.workMode"
                label="Work Mode"
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
                  v-model="freelance.category"
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
                  v-model="freelance.values"
                  label="Values"
                  :required="true"
                />
              </div>
              <div class="col-md-12 mb-4" v-if="is('admin')">
                <MultiSelectInput
                  :options="users"
                  :required="freelance.user.id ? false : true"
                  :normalizer="(obj: any) => {
                        return {
                          label: obj.email,
                          value: obj.id
                        };
                      }"
                  :multiple="false"
                  v-model="freelance.user"
                  label="User"
                />
                <RouterLink
                  :to="{ name: 'user.edit', params: { id: freelance.user.id } }"
                  v-if="freelance.user.id"
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
import MultiSelectInput from '@/components/inputs/MultiSelectInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import { getCategories } from '@/views/dashboard-module/stores/services/category.service';
import {
  createFreelance,
  getOneFreelance,
  updateFreelance
} from '@/views/dashboard-module/stores/services/freelance.service';

import { getUsers } from '@/views/dashboard-module/stores/services/user.service';

import { useAuthStore } from '@/views/auth-module/stores/auth.store';
import { getValues } from '../../views/dashboard-module/stores/services/value.service';

const router = useRouter();

const { is } = useAuthStore();

const props = defineProps<{ id: string }>();

const workModes = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' }
];

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

const freelance = ref<any>(
  props.id
    ? await getOneFreelance(props.id)
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
        },
        values: [],
        tjm: undefined,
        mobility: undefined,
        availabilityDate: undefined,
        desiredLocation: undefined,
        workMode: undefined
      }
);

if (!freelance.value.contact.address) {
  freelance.value.contact.address = initialAddress;
}

if (props.id && !freelance.value) {
  router.push({ name: 'freelance.add' });
}

if (!freelance.value.contact) {
  freelance.value.contact = structuredClone(initialContact);
}

const data = await Promise.all([
  getCategories(null, null, null, 'public', 'freelance'),
  is('admin') ? getUsers(null, null, null, undefined, true) : Promise.resolve(undefined),
  getValues(null, null, null, 'public')
]);

const categories = data[0].data?.results?.rows || [];
const users = data?.[1]?.data?.results?.rows || [];
const values = data[2]?.data?.results?.rows || [];

const isLoading = ref(false);

const save = async () => {
  isLoading.value = true;

  if (!freelance.value.category?.id) freelance.value.category = undefined;

  const { data: newData } = props.id
    ? await updateFreelance(freelance.value)
    : await createFreelance(freelance.value);

  if (newData?.result?.id) {
    router.push({ name: 'freelance.list' });
  }

  isLoading.value = false;
};
</script>
