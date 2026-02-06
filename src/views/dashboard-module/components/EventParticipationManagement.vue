<template>
  <div class="participation-management">
    <div class="tabs">
      <button 
        :class="['tab', { active: activeTab === 'requests' }]"
        @click="activeTab = 'requests'">
        Demandes de participation
        <span v-if="pendingRequestsCount > 0" class="badge">{{ pendingRequestsCount }}</span>
      </button>
      <button 
        :class="['tab', { active: activeTab === 'reservations' }]"
        @click="activeTab = 'reservations'">
        Réservations utilisateurs
      </button>
    </div>

    <!-- Participation Requests Tab -->
    <div v-if="activeTab === 'requests'" class="tab-content">
      <div class="filters">
        <select v-model="requestFilters.status" @change="loadParticipationRequests" class="filter-select">
          <option value="">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="APPROVED">Approuvé</option>
          <option value="REJECTED">Refusé</option>
        </select>
        
        <select v-model="requestFilters.eventId" @change="loadParticipationRequests" class="filter-select">
          <option value="">Tous les événements</option>
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.title }}
          </option>
        </select>
      </div>

      <div v-if="loadingRequests" class="loading">Chargement...</div>
      
      <div v-else-if="participationRequests.length === 0" class="empty-state">
        <p>Aucune demande de participation trouvée.</p>
      </div>

      <div v-else class="requests-list">
        <div v-for="request in participationRequests" :key="request.id" class="request-card">
          <div class="request-header">
            <div class="company-info">
              <img v-if="request.company.logo?.fileUrl" :src="request.company.logo.fileUrl" :alt="request.company.company_name" class="company-logo">
              <div v-else class="company-logo-placeholder">
                {{ request.company.company_name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h3>{{ request.company.company_name }}</h3>
                <p class="company-email">{{ request.company.user?.email }}</p>
              </div>
            </div>
            <span :class="['status-badge', request.status.toLowerCase()]">
              {{ getStatusLabel(request.status) }}
            </span>
          </div>

          <div class="request-body">
            <div class="info-row">
              <strong>Événement:</strong>
              <span>{{ request.event.title }}</span>
            </div>
            <div class="info-row">
              <strong>Date de demande:</strong>
              <span>{{ formatDate(request.createdAt) }}</span>
            </div>
            <div v-if="request.message" class="info-row">
              <strong>Message:</strong>
              <p class="message">{{ request.message }}</p>
            </div>
            <div v-if="request.reviewedBy" class="info-row">
              <strong>Traité par:</strong>
              <span>{{ request.reviewedBy.user.name }} le {{ formatDate(request.reviewedAt) }}</span>
            </div>
            <div v-if="request.adminNote" class="info-row">
              <strong>Note admin:</strong>
              <p class="message">{{ request.adminNote }}</p>
            </div>
          </div>

          <div v-if="request.status === 'PENDING'" class="request-actions">
            <button @click="openReviewModal(request, 'APPROVED')" class="btn btn-approve">
              Approuver
            </button>
            <button @click="openReviewModal(request, 'REJECTED')" class="btn btn-reject">
              Refuser
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- User Reservations Tab -->
    <div v-if="activeTab === 'reservations'" class="tab-content">
      <div class="filters">
        <select v-model="reservationFilters.eventId" @change="loadUserReservations" class="filter-select">
          <option value="">Tous les événements</option>
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.title }}
          </option>
        </select>
        
        <select v-model="reservationFilters.status" @change="loadUserReservations" class="filter-select">
          <option value="">Tous les statuts</option>
          <option value="CONFIRMED">Confirmé</option>
          <option value="CANCELLED">Annulé</option>
        </select>
      </div>

      <div v-if="loadingReservations" class="loading">Chargement...</div>
      
      <div v-else-if="userReservations.length === 0" class="empty-state">
        <p>Aucune réservation trouvée.</p>
      </div>

      <div v-else class="reservations-table">
        <table>
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Événement</th>
              <th>Stand</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reservation in userReservations" :key="reservation.id">
              <td>
                <div class="user-cell">
                  <strong>{{ reservation.user.name }}</strong>
                  <span class="user-email">{{ reservation.user.email }}</span>
                </div>
              </td>
              <td>{{ reservation.event.title }}</td>
              <td>
                <div class="company-cell">
                  <img v-if="reservation.companyStand.logo?.fileUrl" :src="reservation.companyStand.logo.fileUrl" :alt="reservation.companyStand.company_name" class="company-logo-small">
                  <span>{{ reservation.companyStand.company_name }}</span>
                </div>
              </td>
              <td>{{ formatDate(reservation.createdAt) }}</td>
              <td>
                <span :class="['status-badge', reservation.status.toLowerCase()]">
                  {{ reservation.status === 'CONFIRMED' ? 'Confirmé' : 'Annulé' }}
                </span>
              </td>
              <td>{{ reservation.notes || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Review Modal -->
    <div v-if="showReviewModal" class="modal-overlay" @click="closeReviewModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ reviewAction === 'APPROVED' ? 'Approuver' : 'Refuser' }} la demande</h2>
          <button @click="closeReviewModal" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p>
            Vous êtes sur le point de {{ reviewAction === 'APPROVED' ? 'approuver' : 'refuser' }} 
            la demande de participation de <strong>{{ selectedRequest?.company.company_name }}</strong> 
            pour l'événement <strong>{{ selectedRequest?.event.title }}</strong>.
          </p>
          <div class="form-group">
            <label>Note (optionnel)</label>
            <textarea v-model="adminNote" rows="4" placeholder="Ajoutez une note..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeReviewModal" class="btn btn-secondary">Annuler</button>
          <button @click="submitReview" class="btn" :class="reviewAction === 'APPROVED' ? 'btn-approve' : 'btn-reject'">
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '../api';

const activeTab = ref('requests');
const loadingRequests = ref(false);
const loadingReservations = ref(false);
const participationRequests = ref([]);
const userReservations = ref([]);
const events = ref([]);
const showReviewModal = ref(false);
const selectedRequest = ref(null);
const reviewAction = ref('');
const adminNote = ref('');

const requestFilters = ref({
  status: '',
  eventId: '',
});

const reservationFilters = ref({
  eventId: '',
  status: '',
});

const pendingRequestsCount = computed(() => {
  return participationRequests.value.filter(r => r.status === 'PENDING').length;
});

onMounted(() => {
  loadEvents();
  loadParticipationRequests();
  loadUserReservations();
});

async function loadEvents() {
  try {
    const response = await api.post('/event', {
      query: `
        query GetEvents {
          getEvents(input: { limit: 100, page: 1 }) {
            rows {
              id
              title
            }
          }
        }
      `
    });
    events.value = response.data.data.getEvents.rows;
  } catch (error) {
    console.error('Error loading events:', error);
  }
}

async function loadParticipationRequests() {
  loadingRequests.value = true;
  try {
    const filter: any = {};
    if (requestFilters.value.status) filter.status = requestFilters.value.status;
    if (requestFilters.value.eventId) filter.eventId = requestFilters.value.eventId;

    const response = await api.post('/event', {
      query: `
        query GetEventParticipationRequests($filter: ParticipationRequestFilter) {
          getEventParticipationRequests(input: { limit: 100, page: 1 }, filter: $filter) {
            rows {
              id
              status
              message
              adminNote
              createdAt
              reviewedAt
              event {
                id
                title
              }
              company {
                id
                company_name
                user {
                  email
                }
                logo {
                  fileUrl
                }
              }
              reviewedBy {
                user {
                  name
                }
              }
            }
          }
        }
      `,
      variables: { filter }
    });
    participationRequests.value = response.data.data.getEventParticipationRequests.rows;
  } catch (error) {
    console.error('Error loading participation requests:', error);
  } finally {
    loadingRequests.value = false;
  }
}

async function loadUserReservations() {
  loadingReservations.value = true;
  try {
    const filter: any = {};
    if (reservationFilters.value.eventId) filter.eventId = reservationFilters.value.eventId;
    if (reservationFilters.value.status) filter.status = reservationFilters.value.status;

    const response = await api.post('/event', {
      query: `
        query GetEventUserReservations($filter: UserReservationFilter) {
          getEventUserReservations(input: { limit: 100, page: 1 }, filter: $filter) {
            rows {
              id
              status
              notes
              createdAt
              event {
                id
                title
              }
              user {
                name
                email
              }
              companyStand {
                id
                company_name
                logo {
                  fileUrl
                }
              }
            }
          }
        }
      `,
      variables: { filter }
    });
    userReservations.value = response.data.data.getEventUserReservations.rows;
  } catch (error) {
    console.error('Error loading user reservations:', error);
  } finally {
    loadingReservations.value = false;
  }
}

function openReviewModal(request: any, action: string) {
  selectedRequest.value = request;
  reviewAction.value = action;
  adminNote.value = '';
  showReviewModal.value = true;
}

function closeReviewModal() {
  showReviewModal.value = false;
  selectedRequest.value = null;
  reviewAction.value = '';
  adminNote.value = '';
}

async function submitReview() {
  try {
    await api.post('/event', {
      query: `
        mutation ReviewParticipationRequest($input: ReviewParticipationInput!) {
          reviewParticipationRequest(input: $input) {
            id
            status
          }
        }
      `,
      variables: {
        input: {
          requestId: selectedRequest.value.id,
          status: reviewAction.value,
          adminNote: adminNote.value || null
        }
      }
    });
    
    alert(`Demande ${reviewAction.value === 'APPROVED' ? 'approuvée' : 'refusée'} avec succès!`);
    closeReviewModal();
    loadParticipationRequests();
  } catch (error: any) {
    console.error('Error reviewing request:', error);
    alert(error.response?.data?.errors?.[0]?.message || 'Une erreur est survenue');
  }
}

function getStatusLabel(status: string): string {
  const labels = {
    'PENDING': 'En attente',
    'APPROVED': 'Approuvé',
    'REJECTED': 'Refusé'
  };
  return labels[status] || status;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>

<style scoped lang="scss">
.participation-management {
  padding: 24px;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e0e0e0;
}

.tab {
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;

  &.active {
    color: #eb5432;
    border-bottom-color: #eb5432;
  }

  &:hover {
    color: #eb5432;
  }
}

.badge {
  background: #eb5432;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.filter-select {
  padding: 10px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #eb5432;
  }
}

.loading, .empty-state {
  text-align: center;
  padding: 48px;
  color: #666;
}

.requests-list {
  display: grid;
  gap: 16px;
}

.request-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s;

  &:hover {
    border-color: #eb5432;
    box-shadow: 0 4px 12px rgba(235, 84, 50, 0.1);
  }
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 16px;

  h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }

  .company-email {
    font-size: 14px;
    color: #666;
  }
}

.company-logo {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: contain;
  border: 1px solid #e0e0e0;
  padding: 4px;
}

.company-logo-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: linear-gradient(135deg, #FFF5F2 0%, #FFE8E0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: #eb5432;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;

  &.pending {
    background: #FFF3CD;
    color: #856404;
  }

  &.approved {
    background: #D4EDDA;
    color: #155724;
  }

  &.rejected {
    background: #F8D7DA;
    color: #721C24;
  }

  &.confirmed {
    background: #D4EDDA;
    color: #155724;
  }

  &.cancelled {
    background: #E2E3E5;
    color: #383D41;
  }
}

.request-body {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}

.info-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 12px;
  font-size: 14px;

  strong {
    color: #666;
  }

  .message {
    margin: 0;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    line-height: 1.6;
  }
}

.request-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &.btn-approve {
    background: #28a745;
    color: white;

    &:hover {
      background: #218838;
    }
  }

  &.btn-reject {
    background: #dc3545;
    color: white;

    &:hover {
      background: #c82333;
    }
  }

  &.btn-secondary {
    background: #6c757d;
    color: white;

    &:hover {
      background: #5a6268;
    }
  }
}

.reservations-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e0e0e0;

  table {
    width: 100%;
    border-collapse: collapse;

    thead {
      background: #f8f9fa;

      th {
        padding: 16px;
        text-align: left;
        font-weight: 600;
        color: #333;
        border-bottom: 2px solid #e0e0e0;
      }
    }

    tbody {
      tr {
        border-bottom: 1px solid #e0e0e0;

        &:hover {
          background: #f8f9fa;
        }

        td {
          padding: 16px;
          font-size: 14px;
        }
      }
    }
  }
}

.user-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .user-email {
    font-size: 12px;
    color: #666;
  }
}

.company-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.company-logo-small {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: contain;
  border: 1px solid #e0e0e0;
  padding: 2px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e0e0e0;

  h2 {
    margin: 0;
    font-size: 20px;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 32px;
    cursor: pointer;
    color: #666;
    line-height: 1;

    &:hover {
      color: #333;
    }
  }
}

.modal-body {
  padding: 24px;

  p {
    margin-bottom: 20px;
    line-height: 1.6;
  }
}

.form-group {
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
  }

  textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-family: inherit;
    font-size: 14px;
    resize: vertical;

    &:focus {
      outline: none;
      border-color: #eb5432;
    }
  }
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e0e0e0;
  justify-content: flex-end;
}
</style>
