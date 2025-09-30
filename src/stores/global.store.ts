import { defineStore } from 'pinia';
import { ref } from 'vue';

export default defineStore('global', () => {
  const isLoading = ref(true); // Loading must be false in every Layout

  return {
    isLoading
  };
});
