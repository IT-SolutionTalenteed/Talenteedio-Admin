<template>
  <div>
    <div class="form-label" :class="{ required }">{{ label }}</div>
    <select
      class="form-select select-multiples"
      v-model="selected"
      :multiple="multiple"
      :required="required"
    >
      <option :value="option.value" v-for="option in dataOptions" :key="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';

import loadscript from '@/composables/loadscript';

onMounted(() => {
  loadscript({ src: '/admin/dist/js/inputs/selectMultiple.js', loadtime: 'once' });
});

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
</script>
