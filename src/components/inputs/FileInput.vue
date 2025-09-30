<template>
  <div class="form-label">{{ label }}</div>
  <input type="file" class="form-control" @input="handleFileInputChange" />
</template>

<script setup lang="ts">
interface Props {
  label: string;
}

const emit = defineEmits(['update:modelValue']);

defineProps<Props>();

const handleFileInputChange = (event: any) => {
  const file = event.target.files[0];
  emit('update:modelValue', file);
};
</script>
