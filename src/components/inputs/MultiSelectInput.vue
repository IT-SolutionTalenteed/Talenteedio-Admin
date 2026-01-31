<template>
  <div>
    <div class="form-label" :class="{ required }">{{ label }}</div>
    <select
      ref="selectElement"
      class="form-select select-multiples"
      v-model="selected"
      :multiple="multiple"
      :required="required"
    >
      <option 
        :value="option.value" 
        v-for="option in dataOptions" 
        :key="option.value"
        :data-logo="option.logo"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, nextTick, watch, ref as vueRef } from 'vue';

import loadscript from '@/composables/loadscript';

interface Props {
  label?: string;
  options: any[];
  modelValue: any;
  multiple?: boolean;
  normalizer?: Function;
  subtitle?: string;
  required?: boolean;
  type?: string;
}

const props = withDefaults(defineProps<Props>(), {
  normalizer: (obj: any) => {
    return {
      label: obj.title,
      value: obj.value
    };
  },
  required: () => false,
  multiple: () => false,
  type: () => 'relation'
});

const emit = defineEmits(['update:modelValue']);

const selectElement = vueRef<HTMLSelectElement | null>(null);

const dataOptions = computed(() => props.options.map((obj) => props.normalizer(obj)));

const selected = computed({
  get: () =>
    props.multiple
      ? props.modelValue?.map((value: any) => value.id)
      : typeof props.modelValue === 'object'
      ? props.modelValue?.id
      : props.modelValue,
  set: (value) =>
    emit(
      'update:modelValue',
      props.type === 'relation'
        ? props.multiple
          ? value.map((v: any) => ({
              id: v
            }))
          : { id: value }
        : value
    )
});

const initializeTomSelect = async () => {
  await nextTick();
  
  // Destroy existing instance if any
  if (selectElement.value && (selectElement.value as any).tomselect) {
    (selectElement.value as any).tomselect.destroy();
  }
  
  // Load CSS
  const cssLink = document.querySelector('link[href="/dist/css/inputs/selectMultiple.css"]');
  if (!cssLink) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/dist/css/inputs/selectMultiple.css';
    document.head.appendChild(link);
  }
  
  // Load JS and initialize
  await loadscript({ src: '/dist/js/inputs/selectMultiple.js', loadtime: 'once' });
  
  // Wait a bit for script to execute
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // Initialize TomSelect for this specific element
  if (window.initializeTomSelect && selectElement.value) {
    window.initializeTomSelect('.select-multiples');
  }
};

onMounted(async () => {
  await initializeTomSelect();
});

// Reinitialize when options change
watch(() => props.options, async () => {
  await initializeTomSelect();
}, { deep: true });
</script>
