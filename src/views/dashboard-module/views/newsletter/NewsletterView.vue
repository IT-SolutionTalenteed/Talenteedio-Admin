<template>
  <div class="container-xl">
    <PageHeader title="Détails de la newsletter" />

    <div v-if="newsletter" class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Contenu</h3>
            <div class="card-actions">
              <span :class="getStatusBadgeClass(newsletter.status)">
                {{ getStatusLabel(newsletter.status) }}
              </span>
            </div>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label fw-bold">Sujet</label>
              <p>{{ newsletter.subject }}</p>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Message</label>
              <div class="border rounded p-3" style="white-space: pre-wrap">
                {{ newsletter.message }}
              </div>
            </div>

            <div v-if="newsletter.htmlMessage" class="mb-3">
              <label class="form-label fw-bold">Message HTML</label>
              <div class="border rounded p-3" v-html="newsletter.htmlMessage"></div>
            </div>

            <div v-if="newsletter.attachments && newsletter.attachments.length > 0" class="mb-3">
              <label class="form-label fw-bold">Pièces jointes</label>
              <ul class="list-group">
                <li
                  v-for="(attachment, index) in newsletter.attachments"
                  :key="index"
                  class="list-group-item"
                >
                  <i class="bi bi-paperclip"></i>
                  {{ attachment.filename }}
                  <a :href="attachment.path" target="_blank" class="btn btn-sm btn-link">
                    Télécharger
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Informations</h3>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label fw-bold">Créé par</label>
              <p>
                {{ newsletter.createdBy.firstname }} {{ newsletter.createdBy.lastname }}
                <br />
                <small class="text-muted">{{ newsletter.createdBy.email }}</small>
              </p>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Date de création</label>
              <p>{{ formatDate(newsletter.createdAt) }}</p>
            </div>

            <div v-if="newsletter.sentAt" class="mb-3">
              <label class="form-label fw-bold">Date d'envoi</label>
              <p>{{ formatDate(newsletter.sentAt) }}</p>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Statistiques</label>
              <ul class="list-unstyled">
                <li>Total destinataires : {{ newsletter.totalRecipients }}</li>
                <li>Envoyés : {{ newsletter.sentCount }}</li>
                <li v-if="newsletter.failedCount > 0" class="text-danger">
                  Échecs : {{ newsletter.failedCount }}
                </li>
              </ul>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Groupes de destinataires</label>
              <ul class="list-unstyled">
                <li v-for="type in newsletter.recipientTypes" :key="type">
                  <i class="bi bi-check-circle text-success"></i>
                  {{ getRecipientTypeLabel(type) }}
                </li>
              </ul>
            </div>

            <div
              v-if="newsletter.customRecipientEmails && newsletter.customRecipientEmails.length > 0"
              class="mb-3"
            >
              <label class="form-label fw-bold">Emails personnalisés</label>
              <p>{{ newsletter.customRecipientEmails.length }} email(s)</p>
            </div>
          </div>
        </div>

        <div class="card mt-3">
          <div class="card-body">
            <button
              v-if="newsletter.status === 'draft'"
              type="button"
              class="btn btn-warning w-100 mb-2"
              @click="editNewsletter"
            >
              <i class="bi bi-pencil"></i> Modifier
            </button>
            <button
              v-if="newsletter.status === 'draft'"
              type="button"
              class="btn btn-success w-100 mb-2"
              @click="sendNewsletter"
            >
              <i class="bi bi-send"></i> Envoyer
            </button>
            <button type="button" class="btn btn-secondary w-100" @click="goBack">
              <i class="bi bi-arrow-left"></i> Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import PageHeader from '@/components/PageHeader.vue';
import { newsletterApi } from '../../api/newsletter.api';

const router = useRouter();
const route = useRoute();

const newsletter = ref<any>(null);

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

const getRecipientTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    all_companies: 'Toutes les entreprises',
    all_talents: 'Tous les talents',
    all_consultants: 'Tous les consultants',
    talents_with_active_appointments: 'Talents avec rendez-vous actifs',
    talents_without_appointments: 'Talents sans rendez-vous',
    talents_with_recent_applications: 'Talents avec candidatures récentes',
    talents_without_applications: 'Talents sans candidatures',
    companies_with_active_jobs: 'Entreprises avec offres actives',
    companies_without_jobs: 'Entreprises sans offres',
    verified_users: 'Utilisateurs vérifiés',
    unverified_users: 'Utilisateurs non vérifiés',
    custom: 'Emails personnalisés',
  };
  return labels[type] || type;
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

const loadNewsletter = async () => {
  try {
    newsletter.value = await newsletterApi.getNewsletter(route.params.id as string);
  } catch (error) {
    console.error('Error loading newsletter:', error);
    Swal.fire('Erreur', 'Impossible de charger la newsletter', 'error');
    router.push({ name: 'newsletter.list' });
  }
};

const editNewsletter = () => {
  router.push({ name: 'newsletter.edit', params: { id: newsletter.value.id } });
};

const sendNewsletter = async () => {
  const result = await Swal.fire({
    title: 'Envoyer la newsletter ?',
    text: `Cette action enverra la newsletter à ${newsletter.value.totalRecipients} destinataires.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, envoyer',
    cancelButtonText: 'Annuler',
  });

  if (result.isConfirmed) {
    try {
      await newsletterApi.sendNewsletter(newsletter.value.id);
      Swal.fire('Envoyé !', 'La newsletter est en cours d\'envoi.', 'success');
      loadNewsletter();
    } catch (error) {
      console.error('Error sending newsletter:', error);
      Swal.fire('Erreur', 'Impossible d\'envoyer la newsletter', 'error');
    }
  }
};

const goBack = () => {
  router.push({ name: 'newsletter.list' });
};

onMounted(() => {
  loadNewsletter();
});
</script>
