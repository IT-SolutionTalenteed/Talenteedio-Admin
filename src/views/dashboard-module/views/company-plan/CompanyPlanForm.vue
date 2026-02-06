<template>
  <div>
    <PageHeader 
      :title="id ? 'Modifier le plan' : 'Ajouter un plan'" 
      :page="id ? 'Modifier' : 'Ajouter'"
      :breadcrumbs="[{ label: 'Plans Entreprise', route: 'company-plan' }]"
    />
    
    <div class="page-body">
      <div class="container-xl">
        <form @submit.prevent="save">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Informations du plan</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-8 col-12 mb-3">
                  <label class="form-label required">Titre du plan</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="plan.title"
                    placeholder="Ex: Starter, Professional, Enterprise"
                    required
                  />
                </div>
                
                <div class="col-md-4 col-12 mb-3">
                  <label class="form-label required">Ordre d'affichage</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="plan.displayOrder"
                    min="0"
                    required
                  />
                </div>
                
                <div class="col-12 mb-3">
                  <label class="form-label required">Description</label>
                  <textarea
                    class="form-control"
                    rows="3"
                    v-model="plan.description"
                    placeholder="Description courte du plan"
                    required
                  ></textarea>
                </div>

                <div class="col-md-6 col-12 mb-3">
                  <label class="form-label required">Prix (€)</label>
                  <div class="input-group">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      class="form-control"
                      v-model.number="plan.price"
                      placeholder="0.00"
                      required
                    />
                    <span class="input-group-text">€</span>
                  </div>
                </div>
                
                <div class="col-md-6 col-12 mb-3">
                  <label class="form-label required">Période de facturation</label>
                  <select class="form-select" v-model="plan.billingPeriod" required>
                    <option value="month">Mensuel</option>
                    <option value="year">Annuel</option>
                  </select>
                </div>

                <div class="col-12 mb-3">
                  <h4 class="mb-3">Limites mensuelles</h4>
                  <small class="text-muted">Utilisez -1 pour illimité</small>
                </div>

                <div class="col-md-4 col-12 mb-3">
                  <label class="form-label required">Max Jobs/mois</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="plan.maxJobs"
                    placeholder="5 ou -1 pour illimité"
                    required
                  />
                </div>

                <div class="col-md-4 col-12 mb-3">
                  <label class="form-label required">Max Events/mois</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="plan.maxEvents"
                    placeholder="1 ou -1 pour illimité"
                    required
                  />
                </div>

                <div class="col-md-4 col-12 mb-3">
                  <label class="form-label required">Max Articles/mois</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="plan.maxArticles"
                    placeholder="2 ou -1 pour illimité"
                    required
                  />
                </div>

                <div class="col-12 mb-3">
                  <label class="form-label">Fonctionnalités incluses</label>
                  <div class="mb-2">
                    <div class="input-group mb-2" v-for="(feature, index) in plan.features" :key="index">
                      <input
                        type="text"
                        class="form-control"
                        v-model="plan.features[index]"
                        placeholder="Ex: Access to talent database"
                      />
                      <button 
                        type="button" 
                        class="btn btn-outline-danger"
                        @click="removeFeature(index)"
                        v-if="plan.features.length > 1"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                    <button 
                      type="button" 
                      class="btn btn-outline-primary btn-sm"
                      @click="addFeature"
                    >
                      <i class="bi bi-plus"></i> Ajouter une fonctionnalité
                    </button>
                  </div>
                </div>

                <div class="col-md-6 col-12 mb-3">
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="plan.isActive"
                      id="isActive"
                    />
                    <label class="form-check-label" for="isActive">
                      Plan actif
                    </label>
                  </div>
                </div>

                <div class="col-md-6 col-12 mb-3">
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="plan.isPopular"
                      id="isPopular"
                    />
                    <label class="form-check-label" for="isPopular">
                      Plan populaire (badge "Most Popular")
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <router-link :to="{ name: 'company-plan' }" class="btn btn-secondary">
                Annuler
              </router-link>
              <button type="submit" class="btn btn-primary" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ id ? 'Mettre à jour' : 'Créer le plan' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PageHeader from '@/components/PageHeader.vue';
import { getOneCompanyPlan, createCompanyPlan, updateCompanyPlan } from '../../api/company-plan.service';
import { useToast } from '@/composables/useToast';

const route = useRoute();
const router = useRouter();
const { showToast } = useToast();

const id = ref<string | null>(null);
const isLoading = ref(false);

const plan = ref({
  title: '',
  description: '',
  features: [''],
  maxArticles: 0,
  maxEvents: 0,
  maxJobs: 0,
  price: 0,
  billingPeriod: 'month',
  displayOrder: 0,
  isActive: true,
  isPopular: false,
});

const addFeature = () => {
  plan.value.features.push('');
};

const removeFeature = (index: number) => {
  plan.value.features.splice(index, 1);
};

const loadPlan = async () => {
  if (!id.value) return;
  
  try {
    const result = await getOneCompanyPlan(id.value);
    if (result) {
      plan.value = {
        ...result,
        features: result.features || [''],
      };
    }
  } catch (error) {
    console.error('Error loading plan:', error);
    showToast('Erreur lors du chargement du plan', 'error');
  }
};

const save = async () => {
  try {
    isLoading.value = true;
    
    // Filter out empty features
    const filteredFeatures = plan.value.features.filter(f => f.trim() !== '');
    
    const planData = {
      ...plan.value,
      features: filteredFeatures,
    };

    if (id.value) {
      await updateCompanyPlan({ id: id.value, ...planData });
      showToast('Plan mis à jour avec succès', 'success');
    } else {
      await createCompanyPlan(planData);
      showToast('Plan créé avec succès', 'success');
    }
    
    router.push({ name: 'company-plan' });
  } catch (error) {
    console.error('Error saving plan:', error);
    showToast('Erreur lors de la sauvegarde du plan', 'error');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  id.value = route.params.id as string || null;
  if (id.value) {
    loadPlan();
  }
});
</script>
