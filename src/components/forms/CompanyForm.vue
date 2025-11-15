<template>
  <form class="card" @submit.prevent="save">
    <div class="card-header">Company information</div>
    <div class="card-body">
      <LogoUpload
        v-model="company.logoUrl"
        @logoChanged="onLogoChanged"
        @logoRemoved="onLogoRemoved"
      />
      
      <div class="row">
        <div class="col-md-6 mb-4">
          <TextInput
            label="Company name"
            :required="true"
            placeholder="Add company name"
            v-model="company.company_name"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Slogan or tagline"
            placeholder="Add company slogan"
            v-model="company.slogan"
          />
        </div>
        <div class="col-md-12 mb-4">
          <TextAreaInput
            label="Description"
            placeholder="Add company description"
            v-model="company.description"
            :rows="3"
          />
        </div>
        <div class="col-md-12 mb-4">
          <TextAreaInput
            label="About"
            placeholder="Tell us about your company"
            v-model="company.about"
            :rows="5"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Headquarters"
            placeholder="Add headquarters location"
            v-model="company.headquarters"
          />
        </div>
        <div class="col-md-6 mb-4">
          <MultiSelectInput
            :options="categories"
            :normalizer="(obj: any) => {
              return {
                label: obj.name,
                value: obj.id
              };
            }"
            :required="true"
            :multiple="false"
            v-model="company.category"
            label="Sector"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Website"
            placeholder="https://www.example.com"
            v-model="company.website"
            type="url"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="LinkedIn"
            placeholder="https://www.linkedin.com/company/..."
            v-model="company.socialNetworks.linkedin"
            type="url"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Twitter"
            placeholder="https://twitter.com/..."
            v-model="company.socialNetworks.twitter"
            type="url"
          />
        </div>
        <div class="col-md-6 mb-4">
          <TextInput
            label="Facebook"
            placeholder="https://www.facebook.com/..."
            v-model="company.socialNetworks.facebook"
            type="url"
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
        <div class="col-md-6 mb-4">
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
        <div class="col-md-6 mb-4">
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
        <div class="col-md-6 mb-4" v-if="is('admin')">
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
        </div>
        <div class="col-md-6 mb-4" v-if="is('admin')">
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

import { getCategories } from '@/views/dashboard-module/stores/services/category.service';
import {
  createCompany,
  getCompany,
  updateCompany
} from '@/views/dashboard-module/stores/services/company.service';
import { getUsers } from '@/views/dashboard-module/stores/services/user.service';
import { getPermissions } from '@/views/dashboard-module/stores/services/company-permission.service';

import TextInput from '@/components/inputs/TextInput.vue';
import TextAreaInput from '@/components/inputs/TextAreaInput.vue';
import SelectCountryInput from '@/components/inputs/SelectCountryInput.vue';
import MultiSelectInput from '@/components/inputs/MultiSelectInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';
import LogoUpload from '@/components/inputs/LogoUpload.vue';

import { useAuthStore } from '@/views/auth-module/stores/auth.store';

const authStore = useAuthStore();
const { is } = authStore;

const router = useRouter();

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
        slogan: undefined,
        description: undefined,
        about: undefined,
        headquarters: undefined,
        website: undefined,
        socialNetworks: {
          linkedin: undefined,
          twitter: undefined,
          facebook: undefined
        },
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
        },
        logoId: undefined,
        logoUrl: undefined
      }
);

if (props.id && !company.value) {
  router.push({ name: 'company.add' });
} else {
  // Initialiser l'URL du logo
  if (company.value.logo) {
    company.value.logoUrl = company.value.logo.fileUrl;
    company.value.logoId = company.value.logo.id;
  }
}

if (!company.value.contact) {
  company.value.contact = structuredClone(initialContact);
}

if (!company.value.socialNetworks) {
  company.value.socialNetworks = {
    linkedin: undefined,
    twitter: undefined,
    facebook: undefined
  };
}

const data = await Promise.all([
  getCategories(null, null, null, 'public', 'company'),
  is('admin') ? getUsers(null, null, null, undefined, true) : Promise.resolve(undefined),
  is('admin') ? getPermissions(null, null, null) : Promise.resolve(undefined)
]);

const categories = data[0].data?.results?.rows || [];
const users = data?.[1]?.data?.results?.rows || [];
const permissions = data?.[2]?.data?.results?.rows || [];

const isLoading = ref(false);

const onLogoChanged = (mediaId: string, fileUrl: string) => {
  company.value.logoId = mediaId;
  company.value.logoUrl = fileUrl;
};

const onLogoRemoved = () => {
  company.value.logoId = null;
  company.value.logoUrl = null;
};

const save = async () => {
  isLoading.value = true;

  // Préparer les données pour l'envoi
  const companyData = {
    ...company.value,
    logo: company.value.logoId ? { id: company.value.logoId } : null
  };
  
  // Supprimer les champs temporaires
  delete companyData.logoUrl;
  delete companyData.logoId;

  if (!companyData.category?.id) companyData.category = undefined;

  const { data: newData } = props.id
    ? await updateCompany(companyData)
    : await createCompany(companyData);

  if (newData?.result?.id) {
    router.push({ name: 'company.list' });
  }

  isLoading.value = false;
};
</script>
