<template>
  <div class="container-xl">
    <PageHeader title="Newsletters" page="Newsletters" :rightButton="actions" />

    <div class="card">
      <div class="card-header">
        <div class="row g-2">
          <div class="col-md-4">
            <input
              v-model="filter.subject"
              type="text"
              class="form-control"
              placeholder="Rechercher par sujet..."
              @input="handleSearch"
            />
          </div>
          <div class="col-md-3">
            <select v-model="filter.status" class="form-select" @change="handleSearch">
              <option value="">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="scheduled">Programmé</option>
              <option value="sending">En cours d'envoi</option>
              <option value="sent">Envoyé</option>
              <option value="failed">Échoué</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-vcenter card-table">
          <thead>
            <tr>
              <th>Sujet</th>
              <th>Statut</th>
              <th>Destinataires</th>
              <th>Envoyés</th>
              <th>Créé le</th>
              <th>Envoyé le</th>
              <th class="w-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="newsletter in newsletters" :key="newsletter.id">
              <td>{{ newsletter.subject }}</td>
              <td>
                <span :class="getStatusBadgeClass(newsletter.status)">
                  {{ getStatusLabel(newsletter.status) }}
                </span>
              </td>
              <td>{{ newsletter.totalRecipients }}</td>
              <td>
                <span v-if="newsletter.status === 'sent' || newsletter.status === 'sending'">
                  {{ newsletter.sentCount }} / {{ newsletter.totalRecipients }}
                  <span v-if="newsletter.failedCount > 0" class="text-danger">
                    ({{ newsletter.failedCount }} échecs)
                  </span>
                </span>
                <span v-else>-</span>
              </td>
              <td>{{ formatDate(newsletter.createdAt) }}</td>
              <td>{{ newsletter.sentAt ? formatDate(newsletter.sentAt) : '-' }}</td>
              <td>
                <div class="btn-group">
                  <button
                    class="btn btn-sm btn-primary"
                    @click="viewNewsletter(newsletter.id)"
                    title="Voir"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    v-if="newsletter.status === 'draft'"
                    class="btn btn-sm btn-success"
                    @click="sendNewsletter(newsletter.id)"
                    title="Envoyer"
                  >
                    <i class="bi bi-send"></i>
                  </button>
                  <button
                    v-if="newsletter.status === 'draft'"
                    class="btn btn-sm btn-warning"
                    @click="editNewsletter(newsletter.id)"
                    title="Modifier"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="deleteNewsletter(newsletter.id)"
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

      <div class="card-footer d-flex align-items-center">
        <p class="m-0 text-muted">
          Affichage de {{ (page - 1) * limit + 1 }} à
          {{ Math.min(page * limit, total) }} sur {{ total }} newsletters
        </p>
        <ul class="pagination m-0 ms-auto">
          <li class="page-item" :class="{ disabled: page === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(page - 1)">
              <i class="bi bi-chevron-left"></i>
            </a>
          </li>
          <li
            v-for="p in totalPages"
            :key="p"
            class="page-item"
            :class="{ active: p === page }"
          >
            <a class="page-link" href="#" @click.prevent="changePage(p)">{{ p }}</a>
          </li>
          <li class="page-item" :class="{ disabled: page === totalPages }">
            <a class="page-link" href="#" @click.prevent="changePage(page + 1)">
              <i class="bi bi-chevron-right"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import PageHeader from '@/components/PageHeader.vue';
import { newsletterApi } from '../../api/newsletter.api';

const router = useRouter();

const newsletters = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const limit = ref(10);

const filter = ref({
  subject: '',
  status: '',
});

const actions = [
  {
    label: 'Nouvelle newsletter',
    icon: 'bi bi-plus',
    action: () => router.push({ name: 'newsletter.add' }),
  },
];

const totalPages = computed(() => Math.ceil(total.value / limit.value));

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    draft: 'badge bg-secondary',
    scheduled: 'badge bg-info',
    sending: 'badge bg-warning',
    sent: 'badge bg-success',
    failed: 'badge bg-danger',
  };
  return classes[status] || 'badge bg-secondary';
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    draft: 'Brouillon',
    scheduled: 'Programmé',
    sending: 'En cours',
    sent: 'Envoyé',
    failed: 'Échoué',
  };
  return labels[status] || status;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const loadNewsletters = async () => {
  try {
    // Préparer le filtre en enlevant les valeurs vides
    const cleanFilter: any = {};
    if (filter.value.subject && filter.value.subject.trim() !== '') {
      cleanFilter.subject = filter.value.subject;
    }
    if (filter.value.status && filter.value.status !== '') {
      cleanFilter.status = filter.value.status;
    }

    const response = await newsletterApi.getNewsletters({
      page: page.value,
      limit: limit.value,
      filter: Object.keys(cleanFilter).length > 0 ? cleanFilter : undefined,
    });
    
    // Vérifier que la réponse est valide
    if (response && response.rows) {
      newsletters.value = response.rows;
      total.value = response.total || 0;
    } else {
      console.warn('Invalid response structure:', response);
      newsletters.value = [];
      total.value = 0;
    }
  } catch (error: any) {
    console.error('Error loading newsletters:', error);
    const errorMessage = error?.message || 'Impossible de charger les newsletters';
    Swal.fire('Erreur', errorMessage, 'error');
    newsletters.value = [];
    total.value = 0;
  }
};

const handleSearch = () => {
  page.value = 1;
  loadNewsletters();
};

const changePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage;
    loadNewsletters();
  }
};

const viewNewsletter = (id: string) => {
  router.push({ name: 'newsletter.view', params: { id } });
};

const editNewsletter = (id: string) => {
  router.push({ name: 'newsletter.edit', params: { id } });
};

const sendNewsletter = async (id: string) => {
  const result = await Swal.fire({
    title: 'Envoyer la newsletter ?',
    text: 'Cette action enverra la newsletter à tous les destinataires sélectionnés.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, envoyer',
    cancelButtonText: 'Annuler',
  });

  if (result.isConfirmed) {
    try {
      await newsletterApi.sendNewsletter(id);
      Swal.fire('Envoyé !', 'La newsletter est en cours d\'envoi.', 'success');
      loadNewsletters();
    } catch (error) {
      console.error('Error sending newsletter:', error);
      Swal.fire('Erreur', 'Impossible d\'envoyer la newsletter', 'error');
    }
  }
};

const deleteNewsletter = async (id: string) => {
  const result = await Swal.fire({
    title: 'Supprimer la newsletter ?',
    text: 'Cette action est irréversible.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#d33',
  });

  if (result.isConfirmed) {
    try {
      await newsletterApi.deleteNewsletter(id);
      Swal.fire('Supprimé !', 'La newsletter a été supprimée.', 'success');
      loadNewsletters();
    } catch (error) {
      console.error('Error deleting newsletter:', error);
      Swal.fire('Erreur', 'Impossible de supprimer la newsletter', 'error');
    }
  }
};

onMounted(() => {
  loadNewsletters();
});
</script>
