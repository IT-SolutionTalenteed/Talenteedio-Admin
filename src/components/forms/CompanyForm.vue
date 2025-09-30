<template>
  <form class="row" @submit.prevent="save">
    <div class="col-md-8">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Company content</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <TextInput
                label="Name"
                :required="true"
                placeholder="Add company name"
                v-model="company.company_name"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="Email"
                :required="true"
                placeholder="Add email"
                v-model="company.contact.email"
                type="email"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="Phone"
                :required="true"
                placeholder="Add phone number"
                v-model="company.contact.phoneNumber"
              />
            </div>
            <div class="col-md-6">
              <TextInput
                label="Address line"
                :required="true"
                placeholder="Add address line"
                v-model="company.contact.address.line"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="City"
                :required="true"
                placeholder="Add city"
                v-model="company.contact.address.city"
              />
            </div>
            <div class="col-md-6">
              <TextInput
                label="Postal code"
                :required="true"
                placeholder="Add postal code"
                v-model="company.contact.address.postalCode"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="State"
                placeholder="Add state"
                v-model="company.contact.address.state"
              />
            </div>
            <div class="col-md-6 mb-4">
              <SelectCountryInput
                :required="true"
                placeholder="Add country"
                v-model="company.contact.address.country"
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
      <div class="col-md-12 mb-4" v-if="false">
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
                  v-model="company.status"
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
                  v-model="company.category"
                  label="Category"
                />
              </div>
              <div class="col-md-12 mb-4" v-if="is('admin')">
                <MultiSelectInput
                  :options="users"
                  :required="company.user.id ? false : true"
                  :normalizer="(obj: any) => {
                    return {
                      label: obj.email,
                      value: obj.id
                    };
                  }"
                  :multiple="false"
                  v-model="company.user"
                  label="User"
                />
                <RouterLink
                  :to="{ name: 'user.edit', params: { id: company.user.id } }"
                  v-if="company.user.id"
                  class="mt-2 d-inline-block"
                  >Edit user</RouterLink
                >
                <RouterLink :to="{ name: 'user.add' }" v-else class="mt-2 d-inline-block"
                  >Add user</RouterLink
                >
              </div>
              <div class="col-md-12 mb-4" v-if="is('admin')">
                <MultiSelectInput
                  :options="permissions"
                  :required="true"
                  :normalizer="(obj: any) => {
                    return {
                      label: obj.title,
                      value: obj.id
                    };
                  }"
                  :multiple="false"
                  v-model="company.permission"
                  label="Permission"
                />
              </div>
              <div class="col-md-12">
                <FileInput label="Featured image" v-model="image" />
                <img
                  v-if="fileUrl"
                  class="mt-4"
                  :src="fileUrl"
                  style="max-height: 250px; object-fit: cover; width: 100%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { getCategories } from '@/views/dashboard-module/stores/services/category.service';
import { uploadMedia } from '@/views/dashboard-module/stores/services/media.service';
import {
  createCompany,
  getCompany,
  updateCompany
} from '@/views/dashboard-module/stores/services/company.service';
import { getUsers } from '@/views/dashboard-module/stores/services/user.service';
import { getPermissions } from '@/views/dashboard-module/stores/services/company-permission.service';

import TextInput from '@/components/inputs/TextInput.vue';
import SelectCountryInput from '@/components/inputs/SelectCountryInput.vue';
import RadioInput from '@/components/inputs/RadioInput.vue';
import MultiSelectInput from '@/components/inputs/MultiSelectInput.vue';
import FileInput from '@/components/inputs/FileInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import { useAuthStore } from '@/views/auth-module/stores/auth.store';

const router = useRouter();

const { is } = useAuthStore();

const props = defineProps<{ id: string }>();

const initialContact = {
  email: undefined,
  phoneNumber: undefined,
  address: {
    line: undefined,
    city: undefined,
    country: undefined,
    postalCode: undefined,
    state: undefined
  }
};

const company = ref<any>(
  props.id
    ? (await getCompany(props.id))?.data?.result
    : {
        id: undefined,
        company_name: undefined,
        status: 'public',
        contact: structuredClone(initialContact),
        logo: {
          id: undefined
        },
        category: {
          id: undefined
        },
        user: {
          id: undefined
        },
        permission: {
          id: undefined
        }
      }
);

if (props.id && !company.value) {
  router.push({ name: 'company.add' });
}

if (!company.value.contact) {
  company.value.contact = structuredClone(initialContact);
}

const data = await Promise.all([
  getCategories(null, null, null, 'public', 'company'),
  is('admin') ? getUsers(null, null, null, undefined, true) : Promise.resolve(undefined),
  is('admin') ? getPermissions(null, null, null) : Promise.resolve(undefined)
]);

const categories = data[0].data?.results?.rows || [];
const users = data?.[1]?.data?.results?.rows || [];
const permissions = data?.[2]?.data?.results?.rows || [];

const image = ref(undefined);

const fileUrl = ref(company.value.logo?.fileUrl);
company.value.logo && (company.value.logo.fileUrl = undefined);

watch(image, () => {
  company.value.logo.fileUrl = undefined;
});

const isLoading = ref(false);

const save = async () => {
  isLoading.value = true;

  if (image.value) {
    const { data } = await uploadMedia(image.value);

    if (data && data.result?.id) {
      if (!company.value.logo) company.value.logo = {};
      company.value.logo.id = data.result?.id;
    } else {
      isLoading.value = false;
      return;
    }
  } else {
    company.value.logo = undefined;
  }

  if (!company.value.category?.id) company.value.category = undefined;

  const { data: newData } = props.id
    ? await updateCompany(company.value)
    : await createCompany(company.value);

  if (newData?.result?.id) {
    router.push({ name: 'company.list' });
  }

  isLoading.value = false;
};
</script>
