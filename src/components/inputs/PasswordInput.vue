<template>
  <div class="col-sm-12">
    <div class="form-label-container">
      <label class="form-label" v-if="label" :class="{ required: required }">
        {{ label }}
      </label>

      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
    <div>
      <div class="input-group input-group-merge has-validation" :class="errors ? 'is-invalid' : ''">
        <input
          class="form-control"
          :type="showPassword ? 'text' : 'password'"
          :placeholder="placeholder"
          :value="props.modelValue"
          :required="required"
          @input="inputChanged($event.target as HTMLInputElement)"
          @blur="inputBlured($event.target as HTMLInputElement)"
          :minlength="minLength"
        />

        <a
          class="js-toggle-password-target-1 input-group-append input-group-text"
          href="javascript:;"
          @click.prevent="toggleShow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-eye"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            v-if="!showPassword"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
            <path
              d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"
            ></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-eye-x"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            v-else
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
            <path
              d="M13.117 17.933a9.275 9.275 0 0 1 -1.117 .067c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6a18.728 18.728 0 0 1 -1.009 1.516"
            ></path>
            <path d="M22 22l-5 -5"></path>
            <path d="M17 22l5 -5"></path>
          </svg>
        </a>
      </div>
      <template v-if="errors">
        <span class="invalid-feedback" v-for="(error, i) in errors" :key="i.toString()">
          {{ error }}
        </span>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const showPassword = ref(false);

interface Props {
  placeholder?: string;
  modelValue: string;
  label?: string;
  errors?: Array<string>;
  required?: boolean;
  minLength?: number;
  subtitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ''
});

const emit = defineEmits(['update:errors', 'update:modelValue']);

const inputChanged = (target: HTMLInputElement) => {
  if (target.value.trim() !== '') {
    emit('update:errors', undefined);
  }
  emit('update:modelValue', target.value);
};

const inputBlured = (target: HTMLInputElement) => {
  if (target.validity.valueMissing) {
    emit('update:errors', ['Ce champ est obligatoire.']);
    return;
  }

  if (target.validity.tooShort) {
    emit('update:errors', [`Veuillez entrer au moins ${props.minLength} charactères.`]);
    return;
  }
};

//Display or not the value of password
const toggleShow = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style>
.input-group.is-invalid {
  border-color: #ed4c78;
}
</style>
