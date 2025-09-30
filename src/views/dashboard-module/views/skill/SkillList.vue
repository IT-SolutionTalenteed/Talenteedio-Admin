<template>
  <PageHeader title="Skill" page="Skill" />

  <div class="page-body">
    <div class="row">
      <div class="col-md-4">
        <form class="card" @submit.prevent="save">
          <div class="card-body">
            <TextInput
              label="Name"
              :required="true"
              placeholder="Add skill name"
              class="mb-4"
              v-model="skill.name"
            />

            <RadioInput
              label="Status"
              v-model="skill.status"
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
      <div class="col-md-8">
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
import RadioInput from '@/components/inputs/RadioInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import {
  createSkill as create,
  updateSkill as update,
  getSkills as getData,
  deleteSkill as remove,
  getSkill as getOne
} from '../../stores/services/skill.service';

const isSaveLoading = ref(false);
const isDataLoading = ref(false);

const initialValue = {
  id: undefined,
  name: '',
  status: 'public'
};

const skill = ref(structuredClone(initialValue));

const reset = () => {
  skill.value = structuredClone(initialValue);
};

const tableKey = ref(0);

const save = async () => {
  isSaveLoading.value = true;

  if (skill.value.id) {
    const { data } = await update(skill.value);

    if (data?.result?.id) {
      reset();
      tableKey.value += 1;
    }
  } else {
    const { data } = await create(skill.value);

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
    skill.value = data.result;
  }

  isDataLoading.value = false;
};

const removeData = async (id?: string) => {
  await remove(id);
  reset();
};
</script>

<style scoped lang="scss"></style>
