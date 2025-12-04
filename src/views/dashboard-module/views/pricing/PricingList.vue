<template>
  <div>
    <PageHeader title="Tarifs" page="Tarifs" />
    
    <div class="page-body">
      <div class="container-xl">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Mes tarifs</h3>
            <div class="card-actions">
              <router-link :to="{ name: 'pricing.add' }" class="btn btn-primary">
                <i class="bi bi-plus"></i> Ajouter un tarif
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Chargement...</span>
              </div>
            </div>
            
            <div v-else-if="pricings.length === 0" class="text-center py-5">
              <p class="text-muted">Aucun tarif défini pour le moment.</p>
              <router-link :to="{ name: 'pricing.add' }" class="btn btn-primary">
                Créer mon premier tarif
              </router-link>
            </div>
            
            <div v-else class="table-responsive">
              <table class="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Prix</th>
                    <th>Unité</th>
                    <th class="w-1"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="pricing in pricings" :key="pricing.id">
                    <td>{{ pricing.title }}</td>
                    <td>
                      <div class="text-truncate" style="max-width: 300px;">
                        {{ pricing.description }}
                      </div>
                    </td>
                    <td>
                      <strong>{{ formatPrice(pricing.price) }} €</strong>
                    </td>
                    <td>
                      <span class="badge bg-blue-lt">{{ pricing.unit || 'N/A' }}</span>
                    </td>
                    <td>
                      <div class="btn-list flex-nowrap">
                        <router-link
                          :to="{ name: 'pricing.edit', params: { id: pricing.id } }"
                          class="btn btn-sm btn-icon btn-ghost-primary"
                          title="Modifier"
                        >
                          <i class="bi bi-pencil"></i>
                        </router-link>
                        <button
                          @click="confirmDelete(pricing)"
                          class="btn btn-sm btn-icon btn-ghost-danger"
                          title="Supprimer"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PageHeader from '@/components/PageHeader.vue';
import { getPricings, deletePricing } from '../../stores/services/pricing.service';
import { useAuthStore } from '@/views/auth-module/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const pricings = ref<any[]>([]);
const loading = ref(true);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

const loadPricings = async () => {
  try {
    loading.value = true;
    const user = authStore.user;
    if (user?.consultant?.id) {
      const result = await getPricings(user.consultant.id);
      pricings.value = result?.rows || [];
    }
  } catch (error) {
    console.error('Error loading pricings:', error);
  } finally {
    loading.value = false;
  }
};

const confirmDelete = async (pricing: any) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le tarif "${pricing.title}" ?`)) {
    try {
      await deletePricing(pricing.id);
      await loadPricings();
    } catch (error) {
      console.error('Error deleting pricing:', error);
      alert('Erreur lors de la suppression du tarif');
    }
  }
};

onMounted(() => {
  loadPricings();
});
</script>
