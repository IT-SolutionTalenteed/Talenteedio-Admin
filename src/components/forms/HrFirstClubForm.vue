<template>
  <form class="row" @submit.prevent="save">
    <div class="col-md-8">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Hr first club content</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <TextInput
                label="Company name"
                :required="true"
                placeholder="Add hr first club company name"
                v-model="hrFirstClub.companyName"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="Function"
                :required="true"
                placeholder="Add hr first club function"
                v-model="hrFirstClub.function"
              />
            </div>
            <div class="col-md-6">
              <TextInput
                label="Membership reason"
                :required="true"
                placeholder="Add hr first club membership reason"
                v-model="hrFirstClub.membershipReason"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="Phone"
                :required="true"
                placeholder="Add phone number"
                v-model="hrFirstClub.contact.phoneNumber"
              />
            </div>
            <div class="col-md-6">
              <TextInput
                label="Address line"
                :required="true"
                placeholder="Add address line"
                v-model="hrFirstClub.contact.address.line"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="City"
                :required="true"
                placeholder="Add city"
                v-model="hrFirstClub.contact.address.city"
              />
            </div>
            <div class="col-md-6">
              <TextInput
                label="Postal code"
                :required="true"
                placeholder="Add postal code"
                v-model="hrFirstClub.contact.address.postalCode"
              />
            </div>
            <div class="col-md-6 mb-4">
              <TextInput
                label="State"
                placeholder="Add state"
                v-model="hrFirstClub.contact.address.state"
              />
            </div>
            <div class="col-md-6 mb-4">
              <SelectCountryInput
                :required="true"
                placeholder="Add country"
                v-model="hrFirstClub.contact.address.country"
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
                  v-model="hrFirstClub.status"
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
              <div class="col-md-12" v-if="is('admin')">
                <MultiSelectInput
                  :options="users"
                  :required="hrFirstClub.user.id ? false : true"
                  :normalizer="(obj: any) => {
                        return {
                          label: obj.email,
                          value: obj.id
                        };
                      }"
                  :multiple="false"
                  v-model="hrFirstClub.user"
                  label="User"
                />
                <RouterLink
                  :to="{ name: 'user.edit', params: { id: hrFirstClub.user.id } }"
                  v-if="hrFirstClub.user.id"
                  class="mt-2 d-inline-block"
                  >Edit user</RouterLink
                >
                <RouterLink :to="{ name: 'user.add' }" v-else class="mt-2 d-inline-block"
                  >Add user</RouterLink
                >
              </div>
              <div class="col-md-12 mt-4">
                <FileInput label="Logo" v-model="image" />
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

import TextInput from '@/components/inputs/TextInput.vue';
import SelectCountryInput from '@/components/inputs/SelectCountryInput.vue';
import RadioInput from '@/components/inputs/RadioInput.vue';
import MultiSelectInput from '@/components/inputs/MultiSelectInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';
import FileInput from '@/components/inputs/FileInput.vue';

import { getCategories } from '@/views/dashboard-module/stores/services/category.service';
import { uploadMedia } from '@/views/dashboard-module/stores/services/media.service';
import {
  createHrFirstClub,
  getHrFirstClub,
  updateHrFirstClub
} from '@/views/dashboard-module/stores/services/hr-first-club.service';
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

const hrFirstClub = ref<any>(
  props.id
    ? (await getHrFirstClub(props.id))?.data?.result
    : {
        id: undefined,
        logo: {
          id: undefined
        },
        companyName: undefined,
        function: undefined,
        membershipReason: undefined,
        status: 'public',
        contact: structuredClone(initialContact),
        user: {
          id: undefined
        }
      }
);

if (props.id && !hrFirstClub.value) {
  router.push({ name: 'hrFirstClub.add' });
}

if (!hrFirstClub.value.contact) {
  hrFirstClub.value.contact = structuredClone(initialContact);
}

if (!hrFirstClub.value.contact.address) {
  hrFirstClub.value.contact.address = structuredClone(initialAddress);
}

const data = await Promise.all([
  getCategories(null, null, null, 'public', 'referral'),
  is('admin') ? getUsers(null, null, null, undefined, true) : Promise.resolve(undefined)
]);

const users = data?.[1]?.data?.results?.rows || [];

const image = ref(undefined);

const fileUrl = ref(hrFirstClub.value.logo?.fileUrl);
hrFirstClub.value.logo && (hrFirstClub.value.logo.fileUrl = undefined);

watch(image, () => {
  hrFirstClub.value.logo.fileUrl = undefined;
});

const isLoading = ref(false);

const save = async () => {
  isLoading.value = true;

  if (image.value) {
    const { data } = await uploadMedia(image.value);

    if (data && data.result?.id) {
      if (!hrFirstClub.value.logo) hrFirstClub.value.logo = {};
      hrFirstClub.value.logo.id = data.result?.id;
    } else {
      isLoading.value = false;
      return;
    }
  } else {
    hrFirstClub.value.logo = undefined;
  }

  const { data: newData } = props.id
    ? await updateHrFirstClub(hrFirstClub.value)
    : await createHrFirstClub(hrFirstClub.value);

  if (newData?.result?.id) {
    router.push({ name: 'hr-first-club.list' });
  }

  isLoading.value = false;
};
</script>
