<template>
  <div class="row mb-4">
    <div class="form-label-container">
      <label class="form-label" v-if="label" :class="{ required: required }">
        {{ label }}
      </label>

      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
    <div class="col-sm-12">
      <div class="input-group input-group-sm-vertical gap-3">
        <!-- Radio Check -->
        <label
          class="form-check form-check-inline"
          :for="`option-${option.value}`"
          v-for="option in data"
          :key="option.value"
        >
          <input
            class="form-check-input"
            type="radio"
            :id="`option-${option.value}`"
            :name="name"
            :value="option.value"
            :checked="option.value === modelValue"
            @input="emit('update:modelValue', option.value)"
          />
          <span class="form-check-label">{{ option.label }}</span>
          <span class="form-check-label">{{ option.subtitle }}</span>
        </label>

        <!-- End Radio Check -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface ObjectType {
  title: string;
  subtitle?: string;
  value: string | boolean;
}

interface Props {
  label?: string;
  name: string;
  options: Array<ObjectType>;
  modelValue?: number | string;
  normalizer?: Function;
  subtitle?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  normalizer: (obj: any) => {
    if (obj.subtitle) {
      return {
        label: obj.title,
        subtitle: obj.subtitle,
        value: obj.value
      };
    }

    return {
      label: obj.title,
      value: obj.value
    };
  },
  required: () => false
});

const emit = defineEmits(['update:modelValue']);

const data = computed(() => props.options.map((obj) => props.normalizer(obj)));
</script>

<style lang="scss">
.form-check-label {
  text-align: center;
}
</style>
