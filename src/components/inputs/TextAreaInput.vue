<template>
  <div class="col-sm-12">
    <div class="form-label-container">
      <label class="form-label" :class="{ required: required }" v-if="label">
        {{ label }}
      </label>

      <p v-if="subtitle">{{ subtitle }}</p>
    </div>

    <!-- Form -->
    <div>
      <div class="input-group input-group-merge">
        <textarea
          class="form-control"
          :placeholder="props.placeholder"
          :value="text"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          :required="required"
        ></textarea>
      </div>
    </div>
    <!-- End Form -->
  </div>
  <!-- End Col -->
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface Props {
  label: string;
  placeholder?: string;
  modelValue: string;
  subtitle?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => '',
  required: () => false
});

const text = computed(() => props.modelValue);
</script>
