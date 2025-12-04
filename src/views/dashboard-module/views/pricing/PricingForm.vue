<template>
  <div>
    <PageHeader 
      :title="id ? 'Modifier le tarif' : 'Ajouter un tarif'" 
      :page="id ? 'Modifier' : 'Ajouter'"
      :breadcrumbs="[{ label: 'Tarifs', route: 'pricing' }]"
    />
    
    <div class="page-body">
      <div class="container-xl">
        <form @submit.prevent="save">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Informations du tarif</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label required">Titre</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="pricing.title"
                    placeholder="Ex: Consultation initiale"
                    required
                  />
                </div>
                
                <div class="col-md-3 mb-3">
                  <label class="form-label required">Prix (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    class="form-control"
                    v-model="pricing.price"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div class="col-md-3 mb-3">
                  <label class="form-label">Unité</label>
                  <select class="form-select" v-model="pricing.unit">
                    <option value="">Sélectionner...</option>
                    <option value="hour">Heure</option>
                    <option value="day">Jour</option>
                    <option value="week">Semaine</option>
                    <option value="month">Mois</option>
                    <option value="project">Projet</option>
                    <option value="session">Séance</option>
                  </select>
                </div>
                
                <div class="col-12 mb-3">
                  <label class="form-label required">Description</label>
                  <textarea
                    class="form-control"
                    rows="5"
                    v-model="pricing.description"
                    placeholder="Décrivez ce qui est inclus dans ce tarif..."
                    required
                  ></textarea>
                </div>
              </div>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <router-link :to="{ name: 'pricing' }" class="btn btn-secondary">
                Annuler
              </router-link>
              <button type="submit" class="btn btn-primary" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ id ? 'Mettre à jour' : 'Créer' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PageHeader from '@/components/PageHeader.vue';
import { getOnePricing, createPricing, updatePricing } from '../../stores/services/pricing.service';
import { useAuthStore } from '@/views/auth-module/stores/auth.store';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const id = computed(() => route.params.id as string);
const isLoading = ref(false);

const pricing = ref({
  title: '',
  description: '',
  price: 0,
  unit: '',
});

const loadPricing = async () => {
  if (id.value) {
    try {
      const data = await getOnePricing(id.value);
      if (data) {
        pricing.value = {
          title: data.title,
          description: data.description,
          price: data.price,
          unit: data.unit || '',
        };
      }
    } catch (error) {
      console.error('Error loading pricing:', error);
      alert('Erreur lors du chargement du tarif');
      router.push({ name: 'pricing' });
    }
  }
};

const save = async () => {
  try {
    isLoading.value = true;
    
    const user = authStore.user;
    if (!user?.consultant?.id) {
      alert('Erreur: Consultant non trouvé');
      return;
    }

    const input = {
      ...pricing.value,
      price: Number(pricing.value.price),
    };

    if (id.value) {
      await updatePricing({ id: id.value, ...input });
    } else {
      await createPricing({ ...input, consultantId: user.consultant.id });
    }

    router.push({ name: 'pricing' });
  } catch (error) {
    console.error('Error saving pricing:', error);
    alert('Erreur lors de la sauvegarde du tarif');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadPricing();
});
</script>
