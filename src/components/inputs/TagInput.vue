<template>
  <div class="form-group">
    <label v-if="label">{{ label }} <span v-if="required" class="text-danger">*</span></label>
    <div class="tag-input-container">
      <div class="tags-wrapper">
        <span v-for="(tag, index) in tags" :key="index" class="tag-badge">
          {{ tag }}
          <button type="button" class="tag-remove" @click="removeTag(index)" aria-label="Remove tag">
            ×
          </button>
        </span>
        <input
          type="text"
          class="tag-input"
          :placeholder="placeholder"
          v-model="inputValue"
          @keydown.enter.prevent="addTag"
          @keydown.comma.prevent="addTag"
          @keydown.tab="addTag"
        />
      </div>
    </div>
    <small v-if="hint" class="form-text text-muted">{{ hint }}</small>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const inputValue = ref('');
const tags = ref<string[]>([]);

// Initialize tags from modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && newValue !== tags.value.join(', ')) {
      tags.value = newValue.split(',').map((t) => t.trim()).filter((t) => t);
    }
  },
  { immediate: true }
);

const addTag = () => {
  const value = inputValue.value.trim();
  if (value && !tags.value.includes(value)) {
    tags.value.push(value);
    inputValue.value = '';
    emitValue();
  }
};

const removeTag = (index: number) => {
  tags.value.splice(index, 1);
  emitValue();
};

const emitValue = () => {
  emit('update:modelValue', tags.value.join(', '));
};
</script>

<style scoped>
.tag-input-container {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
  min-height: 38px;
  background-color: #fff;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: #0d6efd;
  color: white;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.tag-remove {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin-left: 0.25rem;
}

.tag-remove:hover {
  opacity: 0.8;
}

.tag-input {
  border: none;
  outline: none;
  flex: 1;
  min-width: 120px;
  padding: 0.25rem;
}

.tag-input:focus {
  outline: none;
}
</style>
