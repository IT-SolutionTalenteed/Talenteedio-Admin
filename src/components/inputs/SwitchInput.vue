<template>
  <div class="form-group">
    <label v-if="label" class="form-label" :class="{ required: required }">
      {{ label }}
    </label>
    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        :id="inputId"
        :checked="modelValue"
        @change="handleChange"
        :disabled="disabled"
      />
      <label v-if="switchLabel" class="form-check-label" :for="inputId">
        {{ switchLabel }}
      </label>
    </div>
    <small v-if="helpText" class="form-hint">{{ helpText }}</small>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  label?: string;
  switchLabel?: string;
  helpText?: string;
  modelValue?: boolean;
  required?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  switchLabel: '',
  helpText: '',
  modelValue: false,
  required: false,
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const inputId = computed(() => `switch-${Math.random().toString(36).substr(2, 9)}`);

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
};
</script>

<style scoped>
.form-check-input {
  cursor: pointer;
}

.form-check-input:disabled {
  cursor: not-allowed;
}

.form-check-label {
  cursor: pointer;
  user-select: none;
}
</style>
