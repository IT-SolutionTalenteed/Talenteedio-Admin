<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { generateLM } from '../../stores/services/lm.service';

import useGlobalStore from '@/stores/global.store';

const globalStore = useGlobalStore();
const { isLoading } = storeToRefs(globalStore);

isLoading.value = true;

onMounted(() => (isLoading.value = true));

const route = useRoute();

const id = computed(() => route.params.id as string);

const pdfBase64 = ref((await generateLM(id.value)).data?.result);

if (pdfBase64.value) {
  // Create a Blob from the Base64 data
  const binary = atob(pdfBase64.value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes.buffer], { type: 'application/pdf' });

  // Create a URL for the Blob
  const pdfUrl = URL.createObjectURL(blob);

  // Open the PDF in a new tab
  window.location.href = pdfUrl;
} else {
  window.close();
}
</script>

<style lang="scss" scoped></style>
