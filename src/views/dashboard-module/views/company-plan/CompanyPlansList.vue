<template>
  <div>
    <PageHeader title="Plans Entreprise" page="Plans Entreprise" />
    
    <div class="page-body">
      <div class="container-xl">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Gestion des plans tarifaires</h3>
            <div class="card-actions">
              <router-link :to="{ name: 'company-plan.add' }" class="btn btn-primary">
                <i class="bi bi-plus"></i> Ajouter un plan
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Chargement...</span>
              </div>
            </div>
            
            <div v-else-if="plans.length === 0" class="text-center py-5">
              <p class="text-muted">Aucun plan défini pour le moment.</p>
              <router-link :to="{ name: 'company-plan.add' }" class="btn btn-primary">
                Créer le premier plan
              </router-link>
            </div>
            
            <div v-else class="table-responsive">
              <table class="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th>Ordre</th>
                    <th>Titre</th>
                    <th>Prix</th>
                    <th>Limites</th>
                    <th>Statut</th>
                    <th>Populaire</th>
                    <th class="w-1"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="plan in plans" :key="plan.id">
                    <td>
                      <span class="badge bg-secondary">{{ plan.displayOrder }}</span>
                    </td>
                    <td>
                      <strong>{{ plan.title }}</strong>
                      <div class="text-muted small">{{ plan.description }}</div>
                    </td>
                    <td>
                      <strong>{{ formatPrice(plan.price) }} €</strong>
                      <span class="text-muted">/{{ plan.billingPeriod === 'month' ? 'mois' : 'an' }}</span>
                    </td>
                    <td>
                      <div class="small">
                        <div>📝 {{ formatLimit(plan.maxJobs) }} jobs</div>
                        <div>📅 {{ formatLimit(plan.maxEvents) }} events</div>
                        <div>📰 {{ formatLimit(plan.maxArticles) }} articles</div>
                      </div>
                    </td>
                    <td>
                      <span :class="['badge', plan.isActive ? 'bg-success' : 'bg-danger']">
                        {{ plan.isActive ? 'Actif' : 'Inactif' }}
                      </span>
                    </td>
                    <td>
                      <span v-if="plan.isPopular" class="badge bg-warning">⭐ Populaire</span>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <div class="btn-list flex-nowrap">
                        <router-link
                          :to="{ name: 'company-plan.edit', params: { id: plan.id } }"
                          class="btn btn-sm btn-icon btn-ghost-primary"
                          title="Modifier"
                        >
                          <i class="bi bi-pencil"></i>
                        </router-link>
                        <button
                          @click="toggleActive(plan)"
                          :class="['btn btn-sm btn-icon', plan.isActive ? 'btn-ghost-warning' : 'btn-ghost-success']"
                          :title="plan.isActive ? 'Désactiver' : 'Activer'"
                        >
                          <i :class="['bi', plan.isActive ? 'bi-eye-slash' : 'bi-eye']"></i>
                        </button>
                        <button
                          @click="confirmDelete(plan)"
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
import PageHeader from '@/components/PageHeader.vue';
import { getCompanyPlans, updateCompanyPlan, deleteCompanyPlan } from '../../api/company-plan.service';
import { useToast } from '@/composables/useToast';

const { showToast } = useToast();

const plans = ref<any[]>([]);
const loading = ref(true);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

const formatLimit = (limit: number) => {
  return limit === -1 ? '∞' : limit;
};

const loadPlans = async () => {
  try {
    loading.value = true;
    const result = await getCompanyPlans();
    plans.value = result?.rows || [];
  } catch (error) {
    console.error('Error loading plans:', error);
    showToast('Erreur lors du chargement des plans', 'error');
  } finally {
    loading.value = false;
  }
};

const toggleActive = async (plan: any) => {
  try {
    await updateCompanyPlan({
      id: plan.id,
      isActive: !plan.isActive,
    });
    showToast(`Plan ${plan.isActive ? 'désactivé' : 'activé'} avec succès`, 'success');
    await loadPlans();
  } catch (error) {
    console.error('Error toggling plan:', error);
    showToast('Erreur lors de la modification du plan', 'error');
  }
};

const confirmDelete = async (plan: any) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le plan "${plan.title}" ?`)) {
    try {
      await deleteCompanyPlan(plan.id);
      showToast('Plan supprimé avec succès', 'success');
      await loadPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      showToast('Erreur lors de la suppression du plan', 'error');
    }
  }
};

onMounted(() => {
  loadPlans();
});
</script>
