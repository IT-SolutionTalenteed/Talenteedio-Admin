<template>
  <form class="row" @submit.prevent="save">
    <div class="col-md-8">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Consultant content</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <TextInput
                label="Expertise"
                :required="true"
                placeholder="Add consultant expertise"
                v-model="consultant.expertise"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="Years of Experience"
                type="number"
                :required="true"
                placeholder="Years of experience"
                v-model="consultant.yearsOfExperience"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="Phone"
                :required="true"
                placeholder="Add phone number"
                v-model="consultant.contact.phoneNumber"
              />
            </div>
            <div class="col-md-6">
              <TextInput
                label="Address line"
                :required="true"
                placeholder="Add address line"
                v-model="consultant.contact.address.line"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="City"
                :required="true"
                placeholder="Add city"
                v-model="consultant.contact.address.city"
              />
            </div>
            <div class="col-md-6">
              <TextInput
                label="Postal code"
                :required="true"
                placeholder="Add postal code"
                v-model="consultant.contact.address.postalCode"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="State"
                placeholder="Add state"
                v-model="consultant.contact.address.state"
              />
            </div>
            <div class="col-md-6 mb-4">
              <SelectCountryInput
                :required="true"
                placeholder="Add country"
                v-model="consultant.contact.address.country"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="TJM (€)"
                type="number"
                placeholder="Daily rate"
                v-model="consultant.tjm"
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
                  v-model="consultant.category"
                  label="Category"
                />
              </div>
              <div class="col-md-12 mb-4" v-if="is('admin')">
                <MultiSelectInput
                  :options="users"
                  :required="consultant.user.id ? false : true"
                  :normalizer="(obj: any) => {
                        return {
                          label: obj.email,
                          value: obj.id
                        };
                      }"
                  :multiple="false"
                  v-model="consultant.user"
                  label="User"
                />
                <RouterLink
                  :to="{ name: 'user.edit', params: { id: consultant.user.id } }"
                  v-if="consultant.user.id"
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

      <!-- CV Section -->
      <div class="col-md-12 mt-3" v-if="consultant.cvs && consultant.cvs.length > 0">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">CV Documents</h3>
          </div>
          <div class="card-body">
            <div class="list-group">
              <a
                v-for="cv in consultant.cvs"
                :key="cv.id"
                :href="cv.file?.fileUrl"
                target="_blank"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              >
                <div>
                  <i class="bi bi-file-earmark-pdf text-danger me-2"></i>
                  <span>{{ cv.title || cv.file?.fileName || 'CV' }}</span>
                </div>
                <i class="bi bi-download"></i>
              </a>
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
  createConsultant,
  getOneConsultant,
  updateConsultant
} from '@/views/dashboard-module/stores/services/consultant.service';

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
  address: initialAddress
};

const consultant = ref<any>(
  props.id
    ? await getOneConsultant(props.id)
    : {
        id: undefined,
        expertise: '',
        yearsOfExperience: '',
        status: 'in_review',
        contact: structuredClone(initialContact),
        category: {
          id: undefined
        },
        user: {
          id: undefined
        },
        tjm: ''
      }
);

if (!consultant.value.contact.address) {
  consultant.value.contact.address = initialAddress;
}

if (props.id && !consultant.value) {
  router.push({ name: 'consultant.add' });
}

if (!consultant.value.contact) {
  consultant.value.contact = structuredClone(initialContact);
}

// Ensure all fields have default values (not null)
if (consultant.value.expertise === null || consultant.value.expertise === undefined) {
  consultant.value.expertise = '';
}
if (consultant.value.yearsOfExperience === null || consultant.value.yearsOfExperience === undefined) {
  consultant.value.yearsOfExperience = '';
}
if (consultant.value.tjm === null || consultant.value.tjm === undefined) {
  consultant.value.tjm = '';
}
if (!consultant.value.contact.phoneNumber) {
  consultant.value.contact.phoneNumber = '';
}
if (!consultant.value.contact.address.line) {
  consultant.value.contact.address.line = '';
}
if (!consultant.value.contact.address.city) {
  consultant.value.contact.address.city = '';
}
if (!consultant.value.contact.address.postalCode) {
  consultant.value.contact.address.postalCode = '';
}
if (!consultant.value.contact.address.state) {
  consultant.value.contact.address.state = '';
}
if (!consultant.value.contact.address.country) {
  consultant.value.contact.address.country = '';
}

const data = await Promise.all([
  getCategories(null, null, null, 'public', 'consultant'),
  is('admin') ? getUsers(null, null, null, undefined, true) : Promise.resolve(undefined)
]);

const categories = data[0].data?.results?.rows || [];
const users = data?.[1]?.data?.results?.rows || [];

const isLoading = ref(false);

const save = async () => {
  isLoading.value = true;

  try {
    if (!consultant.value.category?.id) consultant.value.category = undefined;

    // Prepare consultant data, excluding read-only fields like cvs
    const { cvs, ...consultantDataWithoutCvs } = consultant.value;
    
    // Convert empty strings to null for numeric fields
    const consultantData = {
      ...consultantDataWithoutCvs,
      yearsOfExperience: consultant.value.yearsOfExperience === '' ? null : Number(consultant.value.yearsOfExperience),
      tjm: consultant.value.tjm === '' ? null : Number(consultant.value.tjm)
    };

    const result = props.id
      ? await updateConsultant(consultantData)
      : await createConsultant(consultantData);

    if (result?.data?.result?.id) {
      router.push({ name: 'consultant.list' });
    }
  } catch (error) {
    console.error('Error saving consultant:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>
