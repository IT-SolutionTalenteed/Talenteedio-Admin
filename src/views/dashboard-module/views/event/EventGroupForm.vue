<template>
  <PageHeader
    :title="id ? 'Edit Event Group' : 'Add Event Group'"
    :page="id ? 'Edit' : 'Add'"
    :breadcrumbs="[{ label: 'Event Groups', route: 'event.group' }]"
  />

  <div class="page-body">
    <form class="row" @submit.prevent="save">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Group Information</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <TextInput
                  label="Group Name"
                  :required="true"
                  placeholder="e.g., DayFest, NightFest"
                  v-model="eventGroup.name"
                />
              </div>
              <div class="col-md-12 mt-4">
                <TextInput
                  label="Slug"
                  :required="true"
                  placeholder="Auto-generated from name"
                  v-model="eventGroup.slug"
                  disabled
                />
              </div>
              <div class="col-md-12 mt-4">
                <TextAreaInput
                  label="Description"
                  placeholder="Describe this event group"
                  v-model="eventGroup.description"
                  :rows="4"
                />
              </div>
              <div class="col-md-6 mt-4">
                <TextInput
                  label="Color"
                  placeholder="#FF5733"
                  v-model="eventGroup.color"
                  type="color"
                />
                <small class="text-muted">Choose a color to identify this group visually</small>
              </div>
              <div class="col-md-6 mt-4">
                <TextInput
                  label="Icon/Emoji"
                  placeholder="🎉 or icon-name"
                  v-model="eventGroup.icon"
                />
                <small class="text-muted">Add an emoji or icon identifier</small>
              </div>
            </div>
          </div>
          <div class="card-footer d-flex justify-content-end">
            <SubmitButton :loading="isLoading" :disabled="isLoading"> Save </SubmitButton>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Status</h3>
          </div>
          <div class="card-body">
            <RadioInput
              :options="[
                { title: 'Active', value: 'active' },
                { title: 'Inactive', value: 'inactive' }
              ]"
              v-model="eventGroup.status"
              name="status"
            />
          </div>
        </div>

        <!-- Preview Card -->
        <div class="card mt-4" v-if="eventGroup.name">
          <div class="card-header">
            <h3 class="card-title">Preview</h3>
          </div>
          <div class="card-body">
            <div 
              class="p-3 rounded" 
              :style="{ 
                backgroundColor: eventGroup.color || '#f0f0f0',
                color: getContrastColor(eventGroup.color || '#f0f0f0')
              }"
            >
              <div class="d-flex align-items-center">
                <span v-if="eventGroup.icon" class="me-2" style="font-size: 24px;">
                  {{ eventGroup.icon }}
                </span>
                <div>
                  <strong>{{ eventGroup.name }}</strong>
                  <div class="small">{{ eventGroup.description?.substring(0, 50) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import PageHeader from '@/components/PageHeader.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import TextAreaInput from '@/components/inputs/TextAreaInput.vue';
import RadioInput from '@/components/inputs/RadioInput.vue';
import SubmitButton from '@/components/inputs/SubmitButton.vue';

import { createEventGroup, getEventGroup, updateEventGroup } from '../../stores/services/event-group.service';
import { createSafeUrlFromTitle } from '@/utils/helpers';

const router = useRouter();
const route = useRoute();

const id = computed(() => route.params.id as string);

const eventGroup = ref<any>(
  id.value
    ? (await getEventGroup(id.value))?.data?.result
    : {
        name: '',
        slug: '',
        description: '',
        status: 'active',
        color: '#eb5432',
        icon: '🎉'
      }
);

watch(
  eventGroup,
  () => {
    eventGroup.value.slug = createSafeUrlFromTitle(eventGroup.value!.name);
  },
  { immediate: true, deep: true }
);

if (id.value && !eventGroup.value) {
  router.push({ name: 'event.group.add' });
}

const isLoading = ref(false);

// Function to get contrasting text color
const getContrastColor = (hexColor: string) => {
  if (!hexColor) return '#000000';
  
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
};

const save = async () => {
  isLoading.value = true;

  const { data: newData } = id.value
    ? await updateEventGroup(eventGroup.value)
    : await createEventGroup(eventGroup.value);

  if (newData?.result?.id) {
    router.push({ name: 'event.group.list' });
  }

  isLoading.value = false;
};
</script>

<style scoped>
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
