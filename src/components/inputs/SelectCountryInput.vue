<template>
  <div>
    <div class="form-label" :class="{ required }">{{ label }}</div>
    <select class="form-select" id="select-countries" v-model="selected" :required="required">
      <option
        :value="option.name"
        v-for="option in countries"
        :key="option.name"
        :data-custom-properties="`
            <span class='d-flex align-items-center'>
                <img class='avatar avatar-xss avatar-circle me-2'
                style='width: 20px; height: 15px'
                src='https://flagcdn.com/w20/${option.code.toLocaleLowerCase()}.png'
                srcset='https://flagcdn.com/w20/${option.code.toLocaleLowerCase()}.png 2x'
                alt='${option.name} Flag'/>
            </span>
        `"
      >
        {{ option.name }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import countries from '@/utils/countries';

// onMounted(() => {
//   loadscript({ src: '/admin/dist/js/inputs/country.js' });
// });

interface Props {
  label?: string;
  modelValue: any;
  subtitle?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: () => 'Country',
  required: () => false
});

const emit = defineEmits(['update:modelValue']);

const selected = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>
