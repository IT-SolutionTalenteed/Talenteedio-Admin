<template>
  <div class="container-xl">
    <PageHeader title="Entretiens" />

    <div class="page-body">
      <div class="card">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs" role="tablist">
            <li class="nav-item" role="presentation">
              <a
                href="#tabs-pending"
                class="nav-link"
                :class="{ active: activeTab === 'pending' }"
                @click.prevent="activeTab = 'pending'"
                role="tab"
              >
                En attente
                <span class="badge bg-warning ms-2">{{ pendingCount }}</span>
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a
                href="#tabs-confirmed"
                class="nav-link"
                :class="{ active: activeTab === 'confirmed' }"
                @click.prevent="activeTab = 'confirmed'"
                role="tab"
              >
                Confirmés
                <span class="badge bg-success ms-2">{{ confirmedCount }}</span>
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a
                href="#tabs-rejected"
                class="nav-link"
                :class="{ active: activeTab === 'rejected' }"
                @click.prevent="activeTab = 'rejected'"
                role="tab"
              >
                Rejetés
                <span class="badge bg-danger ms-2">{{ rejectedCount }}</span>
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a
                href="#tabs-all"
                class="nav-link"
                :class="{ active: activeTab === 'all' }"
                @click.prevent="activeTab = 'all'"
                role="tab"
              >
                Tous
              </a>
            </li>
          </ul>
        </div>

        <div class="card-body">
          <div v-if="loading" class="text-center py-5">
            <Loader />
          </div>

          <div v-else-if="filteredAppointments.length === 0" class="text-center py-5">
            <div class="empty">
              <div class="empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <rect x="4" y="5" width="16" height="16" rx="2" />
                  <line x1="16" y1="3" x2="16" y2="7" />
                  <line x1="8" y1="3" x2="8" y2="7" />
                  <line x1="4" y1="11" x2="20" y2="11" />
                  <rect x="8" y="15" width="2" height="2" />
                </svg>
              </div>
              <p class="empty-title">Aucun rendez-vous trouvé</p>
              <p class="empty-subtitle text-muted">
                {{ activeTab === 'pending' ? 'Aucun entretien en attente de validation' : 
                   activeTab === 'confirmed' ? 'Aucun entretien confirmé' :
                   activeTab === 'rejected' ? 'Aucun entretien rejeté' :
                   'Aucun entretien enregistré' }}
              </p>
            </div>
          </div>

          <div v-else class="table-responsive">
            <table class="table card-table table-vcenter text-nowrap datatable">
              <thead>
                <tr>
                  <th>Candidat</th>
                  <th>Entreprise</th>
                  <th>Date</th>
                  <th>Heure</th>
                  <th>Statut</th>
                  <th>Créé le</th>
                  <th class="w-1"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="appointment in filteredAppointments" :key="appointment.id">
                  <td>
                    <div class="d-flex py-1 align-items-center">
                      <span class="avatar me-2" :style="{ backgroundImage: `url(https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName(appointment.user))}&background=random)` }"></span>
                      <div class="flex-fill">
                        <div class="font-weight-medium">{{ getUserName(appointment.user) }}</div>
                        <div class="text-muted"><a href="#" class="text-reset">{{ appointment.user?.email }}</a></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <span class="avatar avatar-sm me-2" :style="appointment.company?.logo ? `background-image: url(${appointment.company.logo.fileUrl})` : ''">
                        {{ !appointment.company?.logo ? appointment.company?.company_name?.charAt(0) : '' }}
                      </span>
                      <span>{{ appointment.company?.company_name }}</span>
                    </div>
                  </td>
                  <td>
                    <div>{{ formatDate(appointment.appointmentDate) }}</div>
                  </td>
                  <td>
                    <div class="text-muted">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-inline" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <circle cx="12" cy="12" r="9" />
                        <polyline points="12 7 12 12 15 15" />
                      </svg>
                      {{ appointment.appointmentTime }}
                    </div>
                  </td>
                  <td>
                    <span class="badge" :class="getStatusClass(appointment.status)">
                      {{ getStatusLabel(appointment.status) }}
                    </span>
                  </td>
                  <td class="text-muted">
                    {{ formatDate(appointment.createdAt) }}
                  </td>
                  <td>
                    <div class="btn-list flex-nowrap">
                      <button
                        class="btn btn-sm"
                        :class="appointment.status === 'PENDING' ? 'btn-primary' : 'btn-ghost-secondary'"
                        @click="viewDetails(appointment)"
                        :title="appointment.status === 'PENDING' ? 'Répondre' : 'Voir les détails'"
                      >
                        <svg v-if="appointment.status === 'PENDING'" xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M9 11l-4 4l4 4m-4 -4h11a4 4 0 0 0 0 -8h-1" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <circle cx="12" cy="12" r="2" />
                          <path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" />
                        </svg>
                        {{ appointment.status === 'PENDING' ? 'Répondre' : 'Détails' }}
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

    <!-- Modal de détails -->
    <div class="modal modal-blur fade" :class="{ show: showModal, 'd-block': showModal }" tabindex="-1" role="dialog" @click="closeModal">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Détails du rendez-vous</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedAppointment">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Candidat</label>
                  <div class="d-flex align-items-center">
                    <span class="avatar me-2" :style="{ backgroundImage: `url(https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName(selectedAppointment.user))}&background=random)` }"></span>
                    <div>
                      <div class="font-weight-medium">{{ getUserName(selectedAppointment.user) }}</div>
                      <div class="text-muted small">{{ selectedAppointment.user?.email }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Entreprise</label>
                  <div class="d-flex align-items-center">
                    <span class="avatar avatar-sm me-2" :style="selectedAppointment.company?.logo ? `background-image: url(${selectedAppointment.company.logo.fileUrl})` : ''">
                      {{ !selectedAppointment.company?.logo ? selectedAppointment.company?.company_name?.charAt(0) : '' }}
                    </span>
                    <div>
                      <div class="font-weight-medium">{{ selectedAppointment.company?.company_name }}</div>
                      <div class="text-muted small">{{ selectedAppointment.company?.contact?.email }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row g-3">
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label">Date</label>
                  <div class="text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-inline me-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <rect x="4" y="5" width="16" height="16" rx="2" />
                      <line x1="16" y1="3" x2="16" y2="7" />
                      <line x1="8" y1="3" x2="8" y2="7" />
                      <line x1="4" y1="11" x2="20" y2="11" />
                    </svg>
                    {{ formatDate(selectedAppointment.appointmentDate) }}
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label">Heure</label>
                  <div class="text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-inline me-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <circle cx="12" cy="12" r="9" />
                      <polyline points="12 7 12 12 15 15" />
                    </svg>
                    {{ selectedAppointment.appointmentTime }}
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label">Fuseau horaire</label>
                  <div class="text-muted">{{ selectedAppointment.timezone }}</div>
                </div>
              </div>
            </div>

            <div class="mb-3" v-if="selectedAppointment.message">
              <label class="form-label">Message du candidat</label>
              <div class="card">
                <div class="card-body">
                  <p class="text-muted mb-0">{{ selectedAppointment.message }}</p>
                </div>
              </div>
            </div>

            <div class="mb-3" v-if="selectedAppointment.companyNotes">
              <label class="form-label">Notes de l'entreprise</label>
              <div class="card">
                <div class="card-body">
                  <p class="text-muted mb-0">{{ selectedAppointment.companyNotes }}</p>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Statut actuel</label>
              <div>
                <span class="badge badge-lg" :class="getStatusClass(selectedAppointment.status)">
                  {{ getStatusLabel(selectedAppointment.status) }}
                </span>
              </div>
            </div>

            <div v-if="selectedAppointment.status === 'PENDING'" class="card card-md bg-light">
              <div class="card-stamp">
                <div class="card-stamp-icon bg-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <circle cx="12" cy="12" r="9" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
              </div>
              <div class="card-body">
                <h3 class="card-title mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-inline me-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M9 11l-4 4l4 4m-4 -4h11a4 4 0 0 0 0 -8h-1" />
                  </svg>
                  Répondre à la demande
                </h3>
                <p class="text-muted mb-3">Choisissez si vous souhaitez confirmer ou rejeter cette demande d'entretien.</p>
                
                <div class="mb-3">
                  <label class="form-label required">Votre décision</label>
                  <div class="form-selectgroup form-selectgroup-boxes d-flex flex-column">
                    <label class="form-selectgroup-item flex-fill">
                      <input type="radio" name="status" value="confirmed" class="form-selectgroup-input" v-model="newStatus">
                      <div class="form-selectgroup-label d-flex align-items-center p-3">
                        <div class="me-3">
                          <span class="form-selectgroup-check"></span>
                        </div>
                        <div class="form-selectgroup-label-content d-flex align-items-center">
                          <span class="avatar avatar-sm me-3 bg-success-lt">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon text-success" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <polyline points="9 11 12 14 20 6" />
                              <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" />
                            </svg>
                          </span>
                          <div>
                            <strong>Confirmer l'entretien</strong>
                            <div class="text-muted">Le candidat recevra une confirmation par email</div>
                          </div>
                        </div>
                      </div>
                    </label>
                    <label class="form-selectgroup-item flex-fill">
                      <input type="radio" name="status" value="rejected" class="form-selectgroup-input" v-model="newStatus">
                      <div class="form-selectgroup-label d-flex align-items-center p-3">
                        <div class="me-3">
                          <span class="form-selectgroup-check"></span>
                        </div>
                        <div class="form-selectgroup-label-content d-flex align-items-center">
                          <span class="avatar avatar-sm me-3 bg-danger-lt">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon text-danger" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </span>
                          <div>
                            <strong>Rejeter la demande</strong>
                            <div class="text-muted">Le candidat sera informé avec votre raison</div>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div v-if="newStatus === 'confirmed'" class="mb-3">
                  <label class="form-label">Notes complémentaires (optionnel)</label>
                  <textarea
                    class="form-control"
                    v-model="companyNotes"
                    rows="3"
                    placeholder="Ex: Lien de visioconférence, instructions particulières, documents à préparer..."
                  ></textarea>
                  <small class="form-hint">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-inline" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <circle cx="12" cy="12" r="9" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    Ces notes seront incluses dans l'email de confirmation envoyé au candidat.
                  </small>
                </div>

                <div v-if="newStatus === 'rejected'" class="mb-3">
                  <label class="form-label required">Raison du rejet</label>
                  <textarea
                    class="form-control"
                    :class="{ 'is-invalid': newStatus === 'rejected' && !rejectionReason.trim() }"
                    v-model="rejectionReason"
                    rows="4"
                    placeholder="Expliquez au candidat pourquoi vous ne pouvez pas donner suite à sa demande..."
                    required
                  ></textarea>
                  <div class="invalid-feedback">La raison du rejet est obligatoire</div>
                  <small class="form-hint text-danger">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-inline" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M12 9v2m0 4v.01" />
                      <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
                    </svg>
                    Cette raison sera envoyée par email au candidat. Soyez courtois et constructif.
                  </small>
                </div>

                <div class="alert alert-info" role="alert">
                  <div class="d-flex">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <circle cx="12" cy="12" r="9" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="alert-title">Notifications automatiques</h4>
                      <div class="text-muted">
                        Après validation, des emails seront automatiquement envoyés au candidat et à l'administrateur.
                        {{ newStatus === 'confirmed' ? 'Le candidat recevra également un rappel 30 minutes avant l\'entretien.' : '' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn me-auto" @click="closeModal">
              Annuler
            </button>
            <button
              v-if="selectedAppointment?.status === 'PENDING'"
              type="button"
              class="btn btn-primary btn-lg"
              @click="updateStatus"
              :disabled="updating || (newStatus === 'rejected' && !rejectionReason.trim())"
            >
              <span v-if="updating">
                <span class="spinner-border spinner-border-sm me-2"></span>
                Envoi en cours...
              </span>
              <span v-else>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon me-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M12 5l0 14" />
                  <path d="M5 12l14 0" />
                </svg>
                {{ newStatus === 'confirmed' ? 'Confirmer et envoyer' : 'Rejeter et envoyer' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import gql from 'graphql-tag';
import PageHeader from '@/components/PageHeader.vue';
import Loader from '@/components/Loader.vue';
import { useToast } from '@/composables/useToast';
import { sendGraphQLRequest } from '../../api/graphql.api';
import { useAuthStore } from '@/views/auth-module/stores/auth.store';

const { showToast } = useToast();
const authStore = useAuthStore();

const loading = ref(false);
const updating = ref(false);
const appointments = ref<any[]>([]);
const activeTab = ref('pending');
const selectedAppointment = ref<any>(null);
const newStatus = ref('confirmed');
const companyNotes = ref('');
const rejectionReason = ref('');
const showModal = ref(false);

// Vérifier si l'utilisateur est admin
const isAdmin = computed(() => authStore.is('admin'));

const filteredAppointments = computed(() => {
  if (activeTab.value === 'all') {
    return appointments.value;
  }
  return appointments.value.filter(
    (a) => a.status.toLowerCase() === activeTab.value
  );
});

const pendingCount = computed(
  () => appointments.value.filter((a) => a.status === 'PENDING').length
);

const confirmedCount = computed(
  () => appointments.value.filter((a) => a.status === 'CONFIRMED').length
);

const rejectedCount = computed(
  () => appointments.value.filter((a) => a.status === 'REJECTED').length
);

const getUserName = (user: any) => {
  if (!user) return 'N/A';
  const name = `${user.firstname || ''} ${user.lastname || ''}`.trim();
  return name || user.email;
};

const formatDate = (date: string | Date) => {
  if (!date) {
    console.log('formatDate: date is null or undefined');
    return 'N/A';
  }
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.log('formatDate: invalid date', date);
      return 'N/A';
    }
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', date, error);
    return 'N/A';
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-warning';
    case 'CONFIRMED':
      return 'bg-success';
    case 'REJECTED':
      return 'bg-danger';
    case 'CANCELLED':
      return 'bg-secondary';
    case 'COMPLETED':
      return 'bg-info';
    default:
      return 'bg-secondary';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'En attente';
    case 'CONFIRMED':
      return 'Confirmé';
    case 'REJECTED':
      return 'Rejeté';
    case 'CANCELLED':
      return 'Annulé';
    case 'COMPLETED':
      return 'Terminé';
    default:
      return status;
  }
};

const loadAppointments = async () => {
  loading.value = true;
  try {
    // Utiliser une query différente selon le rôle
    const query = isAdmin.value
      ? gql`
          query GetAllAppointments {
            getAllAppointments {
              id
              appointmentDate
              appointmentTime
              timezone
              message
              companyNotes
              status
              createdAt
              user {
                id
                email
                firstname
                lastname
              }
              company {
                id
                company_name
                logo {
                  id
                  fileUrl
                }
                contact {
                  email
                }
              }
            }
          }
        `
      : gql`
          query GetMyCompanyAppointments {
            getMyCompanyAppointments {
              id
              appointmentDate
              appointmentTime
              timezone
              message
              companyNotes
              status
              createdAt
              user {
                id
                email
                firstname
                lastname
              }
              company {
                id
                company_name
                logo {
                  id
                  fileUrl
                }
                contact {
                  email
                }
              }
            }
          }
        `;

    const response = await sendGraphQLRequest('matching-profile', query);
    
    console.log('Appointments response:', response);
    
    if (isAdmin.value && response.data?.getAllAppointments) {
      appointments.value = response.data.getAllAppointments.map((apt: any) => ({
        ...apt,
        status: apt.status?.toUpperCase() || apt.status
      }));
      console.log('Admin appointments loaded:', appointments.value.length);
    } else if (!isAdmin.value && response.data?.getMyCompanyAppointments) {
      appointments.value = response.data.getMyCompanyAppointments.map((apt: any) => ({
        ...apt,
        status: apt.status?.toUpperCase() || apt.status
      }));
      console.log('Company appointments loaded:', appointments.value.length, appointments.value);
    }
  } catch (error) {
    console.error('Error loading appointments:', error);
    showToast('Erreur lors du chargement des rendez-vous', 'error');
  } finally {
    loading.value = false;
  }
};

const viewDetails = (appointment: any) => {
  selectedAppointment.value = appointment;
  newStatus.value = 'confirmed';
  companyNotes.value = appointment.companyNotes || '';
  rejectionReason.value = appointment.rejectionReason || '';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedAppointment.value = null;
};

const updateStatus = async () => {
  if (!selectedAppointment.value) return;

  // Validation : si rejet, la raison est obligatoire
  if (newStatus.value === 'rejected' && !rejectionReason.value.trim()) {
    showToast('Veuillez indiquer la raison du rejet', 'error');
    return;
  }

  updating.value = true;
  try {
    const mutation = gql`
      mutation UpdateAppointmentStatus($appointmentId: ID!, $status: String!, $companyNotes: String, $rejectionReason: String) {
        updateAppointmentStatus(appointmentId: $appointmentId, status: $status, companyNotes: $companyNotes, rejectionReason: $rejectionReason) {
          id
          status
          companyNotes
          rejectionReason
        }
      }
    `;

    const variables = {
      appointmentId: selectedAppointment.value.id,
      status: newStatus.value,
      companyNotes: newStatus.value === 'confirmed' ? companyNotes.value || null : null,
      rejectionReason: newStatus.value === 'rejected' ? rejectionReason.value || null : null,
    };

    await sendGraphQLRequest('matching-profile', mutation, variables);

    showToast('Statut mis à jour avec succès', 'success');
    closeModal();
    await loadAppointments();
  } catch (error) {
    console.error('Error updating status:', error);
    showToast('Erreur lors de la mise à jour du statut', 'error');
  } finally {
    updating.value = false;
  }
};

onMounted(() => {
  loadAppointments();
});
</script>

<style scoped>
.avatar {
  background-size: cover;
  background-position: center;
}

.badge-lg {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
}

.modal.show {
  display: block;
  z-index: 1050;
}
</style>
