<template>
  <button ref="btn" :class="['btn', 'btn-' + color]" :type="type" :disabled="disabled || loading">
    <span
      class="spinner-border spinner-border-sm"
      role="status"
      aria-hidden="true"
      v-if="loading"
    ></span>
    <span :class="{ 'visually-hidden': loading }">
      <slot>Bouton</slot>
    </span>
  </button>
</template>

<script lang="ts" setup>
enum types {
  'button',
  'submit',
  'reset'
}

enum colors {
  'primary',
  'secondary',
  'info',
  'success',
  'danger',
  'warning'
}

withDefaults(
  defineProps<{
    loading?: boolean;
    disabled?: boolean;
    color?: keyof typeof colors;
    type?: keyof typeof types;
  }>(),
  {
    loading: () => false,
    disabled: () => false,
    color: () => 'primary',
    type: () => 'submit'
  }
);
</script>
