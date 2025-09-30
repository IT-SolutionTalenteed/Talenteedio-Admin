<template>
  <PageHeader title="Location" page="Location" />

  <div class="page-body">
    <div class="row flex-grow-1">
      <div class="col-md-4">
        <form class="card" @submit.prevent="save">
          <div class="card-body">
            <TextInput
              label="Name"
              :required="true"
              placeholder="Add location name"
              class="mb-4"
              v-model="location.name"
            />
            <TextInput
              label="Address line"
              :required="true"
              placeholder="Add address line"
              class="mb-4"
              v-model="location.address.line"
            />
            <TextInput
              label="City"
              :required="true"
              placeholder="Add city"
              class="mb-4"
              v-model="location.address.city"
            />
            <TextInput
              label="Postal code"
              :required="true"
              placeholder="Add postal code"
              class="mb-4"
              v-model="location.address.postalCode"
            />
            <TextInput
              label="State"
              placeholder="Add state"
              class="mb-4"
              v-model="location.address.state"
            />
            <SelectCountryInput
              :required="true"
              placeholder="Add country"
              class="mb-4"
              v-model="location.address.country"
            />
            <RadioInput
              label="Status"
              v-model="location.status"
              :options="[
                { title: 'Public', value: 'public' },
                { title: 'Draft', value: 'draft' },
                { title: 'Blocked', value: 'blocked' }
              ]"
              name="status"
            />
          </div>
          <div class="card-footer d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-danger" :disabled="isSaveLoading" @click="reset">
              Cancel
            </button>
            <SubmitButton :loading="isSaveLoading"> Save </SubmitButton>
          </div>
        </form>
      </div>
      <div class="col-md-8 d-flex">
        <Table
          :get-data="getData"
          :data-structure="{ name: 'Name', status: 'Status' }"
          :normalizer="(arr: any) => {
                return arr.map((data: any) => {
                  return {
                    id: data.id,
                    name: data.name,
                    status: data.status
                  }
                })
              }"
          :edit-action="setCurrent"
          :delete-data="removeData"
          :key="tableKey"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import PageHeader from '@/components/PageHeader.vue';
import Table from '@/components/Table.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import SelectCountryInput from '@/components/inputs/SelectCountryInput.vue';
import RadioInput from '@/components/inputs/RadioInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import {
  createLocation as create,
  updateLocation as update,
  getLocations as getData,
  deleteLocation as remove,
  getLocation as getOne
} from '../../stores/services/location.service';

const isSaveLoading = ref(false);
const isDataLoading = ref(false);

const initialValue = {
  id: undefined,
  name: '',
  status: 'public',
  address: {
    line: '',
    postalCode: '',
    city: '',
    state: '',
    country: ''
  }
};

const location = ref(structuredClone(initialValue));

const reset = () => {
  location.value = structuredClone(initialValue);
};

const tableKey = ref(0);

const save = async () => {
  isSaveLoading.value = true;

  if (location.value.id) {
    const { data } = await update(location.value);

    if (data?.result?.id) {
      reset();
      tableKey.value += 1;
    }
  } else {
    const { data } = await create(location.value);

    if (data?.result?.id) {
      reset();
      tableKey.value += 1;
    }
  }

  isSaveLoading.value = false;
};

const setCurrent = async (id: string) => {
  isDataLoading.value = true;
  const { data } = await getOne(id);

  if (data?.result) {
    location.value = data.result;
  }

  isDataLoading.value = false;
};

const removeData = async (id?: string) => {
  await remove(id);
  reset();
};
</script>

<style scoped lang="scss"></style>
