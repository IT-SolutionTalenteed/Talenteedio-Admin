<template>
  <div>
    <div class="form-label-container" v-if="label || subtitle">
      <label v-if="label" class="form-label" :class="{ required: required }">
        {{ label }}
      </label>

      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
    <div class="input-icon mb-2">
      <input
        type="date"
        class="form-control"
        placeholder="Select a date"
        :value="props.modelValue"
        :required="required"
        :disabled="disabled"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: Date | string;
  label?: string;
  subtitle?: string;
  required?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => '',
  required: () => false,
  disabled: () => false
});
</script>
