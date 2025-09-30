<template>
  <div>
    <div class="form-label-container">
      <label class="form-label" :class="{ required }" v-if="label">
        {{ label }}
      </label>

      <p v-if="subtitle">{{ subtitle }}</p>
    </div>

    <!-- Form -->
    <input
      class="form-control"
      :class="errors && errors.length > 0 ? 'is-invalid' : ''"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :required="required"
      @input="inputChanged($event.target as HTMLInputElement)"
      @blur="inputBlured($event.target as HTMLInputElement)"
      :disabled="disabled"
    />

    <template v-if="errors && errors.length > 0">
      <span class="invalid-feedback" v-for="(error, i) in errors" :key="i.toString()">
        {{ error }}
      </span>
    </template>
  </div>
  <!-- End Form -->
</template>

<script lang="ts" setup>
interface Props {
  label?: string;
  placeholder?: string;
  modelValue: string | number;
  errors?: Array<string>;
  required?: boolean;
  disabled?: boolean;
  subtitle?: string;
  type?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => '',
  type: () => 'text',
  required: () => false,
  disabled: () => false
});

const emit = defineEmits(['update:errors', 'update:modelValue']);

const inputChanged = (target: HTMLInputElement) => {
  if (target.value.trim() !== '') {
    emit('update:errors', undefined);
  }
  emit('update:modelValue', props.type === 'number' ? Number(target.value) : target.value);
};

const inputBlured = (target: HTMLInputElement) => {
  if (props.required && target.value.trim() === '') {
    emit('update:errors', ['Ce champ est obligatoire']);
  }
};
</script>
