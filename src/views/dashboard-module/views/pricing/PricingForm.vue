<template>
  <div>
    <PageHeader 
      :title="id ? 'Modifier le tarif' : 'Ajouter un tarif'" 
      :page="id ? 'Modifier' : 'Ajouter'"
      :breadcrumbs="[{ label: 'Tarifs', route: 'pricing' }]"
    />
    
    <div class="page-body">
      <div class="container-xl">
        <div class="row">
          <!-- Formulaire -->
          <div class="col-lg-8 col-12">
            <form @submit.prevent="save">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Informations du tarif</h3>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-8 col-12 mb-3">
                      <label class="form-label required">Titre du service</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="pricing.title"
                        placeholder="Ex: Bilan Emploi, Accompagnement Emploi, Consultation RH..."
                        required
                      />
                    </div>
                    
                    <div class="col-md-4 col-12 mb-3">
                      <label class="form-label">Durée estimée</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="pricing.duration"
                        placeholder="Ex: 2 heures, 1 mois..."
                      />
                    </div>
                    
                    <div class="col-md-6 col-12 mb-3">
                      <label class="form-label required">Prix (€)</label>
                      <div class="input-group">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          class="form-control"
                          v-model="pricing.price"
                          placeholder="0.00"
                          required
                        />
                        <span class="input-group-text">€</span>
                      </div>
                    </div>
                    
                    <div class="col-md-6 col-12 mb-3">
                      <label class="form-label">Unité de facturation</label>
                      <select class="form-select" v-model="pricing.unit">
                        <option value="">Forfait</option>
                        <option value="hour">Par heure</option>
                        <option value="day">Par jour</option>
                        <option value="week">Par semaine</option>
                        <option value="month">Par mois</option>
                        <option value="project">Par projet</option>
                        <option value="session">Par séance</option>
                      </select>
                    </div>
                    
                    <div class="col-12 mb-3">
                      <label class="form-label required">Description du service</label>
                      <textarea
                        class="form-control"
                        rows="6"
                        v-model="pricing.description"
                        placeholder="Décrivez en détail ce qui est inclus dans ce service : objectifs, méthodes, livrables, etc."
                        required
                      ></textarea>
                    </div>

                    <div class="col-12 mb-3">
                      <label class="form-label">Prestations incluses</label>
                      <div class="mb-2">
                        <div class="input-group mb-2" v-for="(feature, index) in pricing.features" :key="index">
                          <input
                            type="text"
                            class="form-control"
                            v-model="pricing.features[index]"
                            placeholder="Ex: Bilan d'emploi complet, Rédaction du CV..."
                          />
                          <button 
                            type="button" 
                            class="btn btn-outline-danger"
                            @click="removeFeature(index)"
                            v-if="pricing.features.length > 1"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                        <button 
                          type="button" 
                          class="btn btn-outline-primary btn-sm"
                          @click="addFeature"
                        >
                          <i class="bi bi-plus"></i> Ajouter une prestation
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-footer d-flex flex-column flex-sm-row justify-content-between gap-2">
                  <router-link :to="{ name: 'pricing' }" class="btn btn-secondary order-2 order-sm-1">
                    Annuler
                  </router-link>
                  <button type="submit" class="btn btn-primary order-1 order-sm-2" :disabled="isLoading">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ id ? 'Mettre à jour' : 'Créer le tarif' }}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- Aperçu -->
          <div class="col-lg-4 col-12 mt-3 mt-lg-0">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Aperçu</h3>
              </div>
              <div class="card-body">
                <div class="service-preview">
                  <div class="service-card-preview">
                    <div class="card-header-preview">
                      <h4 class="service-title-preview">{{ pricing.title || 'Titre du service' }}</h4>
                      <span class="consultant-badge-preview">{{ consultantName }}</span>
                    </div>
                    
                    <div class="service-info-preview">
                      <div class="info-item-preview" v-if="pricing.duration">
                        <i class="bi bi-clock"></i>
                        <div>
                          <div class="info-label-preview">Durée</div>
                          <div class="info-value-preview">{{ pricing.duration }}</div>
                        </div>
                      </div>
                      
                      <div class="info-item-preview price-preview">
                        <i class="bi bi-currency-euro"></i>
                        <div>
                          <div class="info-label-preview">Prix</div>
                          <div class="info-value-preview">{{ formatPreviewPrice }}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="service-description-preview" v-if="pricing.description">
                      <p>{{ pricing.description }}</p>
                    </div>

                    <div class="features-list-preview" v-if="pricing.features.some(f => f.trim())">
                      <div class="feature-item-preview" v-for="feature in pricing.features.filter(f => f.trim())" :key="feature">
                        <i class="bi bi-check-circle-fill"></i>
                        <span>{{ feature }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
  duration: '',
  features: ['']
});

const consultantName = computed(() => {
  const user = authStore.user;
  if (user?.consultant) {
    return `${user.consultant.firstName} ${user.consultant.lastName}`;
  }
  return 'Consultant';
});

const formatPreviewPrice = computed(() => {
  const price = pricing.value.price || 0;
  const formattedPrice = `${price}€`;
  
  if (pricing.value.unit) {
    switch (pricing.value.unit) {
      case 'hour':
        return `${formattedPrice}/h`;
      case 'day':
        return `${formattedPrice}/jour`;
      case 'week':
        return `${formattedPrice}/semaine`;
      case 'month':
        return `${formattedPrice}/mois`;
      case 'project':
        return `${formattedPrice}/projet`;
      case 'session':
        return `${formattedPrice}/séance`;
      default:
        return `${formattedPrice}/${pricing.value.unit}`;
    }
  }
  return formattedPrice;
});

const addFeature = () => {
  pricing.value.features.push('');
};

const removeFeature = (index: number) => {
  pricing.value.features.splice(index, 1);
};

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
          duration: data.duration || '',
          features: data.features && data.features.length > 0 ? data.features : ['']
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
      features: pricing.value.features.filter(f => f.trim() !== '')
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

<style scoped>
.service-preview {
  background: linear-gradient(135deg, #e8eef3 0%, #d4dde6 100%);
  border-radius: 16px;
  padding: 1rem;
}

.service-card-preview {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.card-header-preview {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.service-title-preview {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  flex: 1;
  min-width: 0;
}

.consultant-badge-preview {
  background-color: #4a90e2;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.service-info-preview {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.info-item-preview {
  background-color: white;
  padding: 0.75rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  i {
    color: #4a90e2;
    font-size: 1rem;
  }
  
  &.price-preview i {
    color: #5cb85c;
  }
}

.info-label-preview {
  font-size: 0.7rem;
  color: #5a6c7d;
  margin-bottom: 0.2rem;
}

.info-value-preview {
  font-size: 0.9rem;
  font-weight: 700;
  color: #2c3e50;
}

.service-description-preview {
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  
  p {
    color: #2c3e50;
    font-size: 0.85rem;
    line-height: 1.4;
    margin: 0;
  }
}

.features-list-preview {
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feature-item-preview {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: #2c3e50;
  font-size: 0.8rem;
  
  i {
    color: #5cb85c;
    font-size: 0.9rem;
    margin-top: 2px;
    flex-shrink: 0;
  }
}

/* Responsive improvements */
@media (max-width: 991px) {
  .card-header-preview {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .service-info-preview {
    flex-direction: column;
  }
}

@media (max-width: 576px) {
  .card-footer {
    padding: 1rem !important;
  }
  
  .card-footer .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .card-footer .btn:last-child {
    margin-bottom: 0;
  }
  
  .input-group .btn {
    width: auto !important;
    margin-bottom: 0 !important;
  }
}

/* Ensure proper spacing and visibility */
.card-footer {
  position: sticky;
  bottom: 0;
  background-color: #fff;
  border-top: 1px solid #dee2e6;
  z-index: 10;
}

/* Better mobile form layout */
@media (max-width: 768px) {
  .container-xl {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .card {
    margin-bottom: 2rem;
  }
  
  .service-preview {
    margin-top: 1rem;
  }
}
</style>