<template>
  <div class="container-xl feedback-page">
    <PageHeader title="Feedbacks" page="Feedbacks des entretiens" />

    <div class="page-body">
      <div class="row">
        <!-- Liste des entreprises -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Entreprises</h3>
            </div>
            <div class="card-body p-0">
              <div v-if="loadingCompanies" class="text-center py-5">
                <Loader />
              </div>

              <div v-else-if="companies.length === 0" class="text-center py-5">
                <div class="empty">
                  <div class="empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M3 21l18 0" />
                      <path d="M9 8l1 0" />
                      <path d="M9 12l1 0" />
                      <path d="M9 16l1 0" />
                      <path d="M14 8l1 0" />
                      <path d="M14 12l1 0" />
                      <path d="M14 16l1 0" />
                      <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16" />
                    </svg>
                  </div>
                  <p class="empty-title">Aucune entreprise</p>
                </div>
              </div>

              <div v-else class="list-group list-group-flush">
                <a
                  v-for="company in companies"
                  :key="company.id"
                  href="#"
                  class="list-group-item list-group-item-action"
                  :class="{ active: selectedCompany?.id === company.id }"
                  @click.prevent="selectCompany(company)"
                >
                  <div class="d-flex align-items-center">
                    <span class="avatar me-3" :style="company.logo ? `background-image: url(${company.logo.fileUrl})` : ''">
                      {{ !company.logo ? company.company_name?.charAt(0) : '' }}
                    </span>
                    <div class="flex-fill">
                      <div class="font-weight-medium">{{ company.company_name }}</div>
                      <div class="text-muted small">
                        <span class="badge bg-blue-lt">{{ company.feedbackCount }} feedback{{ company.feedbackCount > 1 ? 's' : '' }}</span>
                      </div>
                    </div>
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Liste des feedbacks -->
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <span v-if="selectedCompany">Feedbacks reçus par {{ selectedCompany.company_name }}</span>
                <span v-else>Sélectionnez une entreprise</span>
              </h3>
            </div>
            <div class="card-body">
              <div v-if="!selectedCompany" class="text-center py-5">
                <div class="empty">
                  <div class="empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />
                      <line x1="12" y1="12" x2="12" y2="12.01" />
                      <line x1="8" y1="12" x2="8" y2="12.01" />
                      <line x1="16" y1="12" x2="16" y2="12.01" />
                    </svg>
                  </div>
                  <p class="empty-title">Sélectionnez une entreprise</p>
                  <p class="empty-subtitle text-muted">
                    Choisissez une entreprise dans la liste de gauche pour voir ses feedbacks
                  </p>
                </div>
              </div>

              <div v-else-if="loadingFeedbacks" class="text-center py-5">
                <Loader />
              </div>

              <div v-else-if="feedbacks.length === 0" class="text-center py-5">
                <div class="empty">
                  <div class="empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />
                    </svg>
                  </div>
                  <p class="empty-title">Aucun feedback</p>
                  <p class="empty-subtitle text-muted">
                    Cette entreprise n'a pas encore reçu de feedback
                  </p>
                </div>
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="feedback in feedbacks"
                  :key="feedback.id"
                  class="card card-sm mb-3"
                >
                  <div class="card-body">
                    <div class="row align-items-center mb-3">
                      <div class="col-auto">
                        <span class="avatar" :style="{ backgroundImage: `url(https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName(feedback.user))}&background=random)` }"></span>
                      </div>
                      <div class="col">
                        <div class="font-weight-medium">{{ getUserName(feedback.user) }}</div>
                        <div class="text-muted small">{{ feedback.user?.email }}</div>
                      </div>
                      <div class="col-auto">
                        <div class="text-muted small">
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-inline" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <rect x="4" y="5" width="16" height="16" rx="2" />
                            <line x1="16" y1="3" x2="16" y2="7" />
                            <line x1="8" y1="3" x2="8" y2="7" />
                            <line x1="4" y1="11" x2="20" y2="11" />
                          </svg>
                          {{ formatDate(feedback.appointmentDate) }}
                        </div>
                      </div>
                    </div>

                    <div class="row mb-2">
                      <div class="col-6">
                        <label class="form-label small text-muted mb-1">Note</label>
                        <div class="rating-stars">
                          <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= feedback.candidateRating }">
                            ★
                          </span>
                          <span class="ms-2 text-muted small">({{ feedback.candidateRating }}/5)</span>
                        </div>
                      </div>
                      <div class="col-6">
                        <label class="form-label small text-muted mb-1">Décision</label>
                        <div>
                          <span class="badge" :class="getFeedbackDecisionClass(feedback.candidateDecision)">
                            {{ getFeedbackDecisionLabel(feedback.candidateDecision) }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label class="form-label small text-muted mb-1">Commentaire</label>
                      <div class="card card-sm bg-light">
                        <div class="card-body">
                          <p class="text-muted mb-0 small">{{ feedback.candidateFeedback }}</p>
                        </div>
                      </div>
                    </div>

                    <div class="text-muted small mt-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-inline" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <circle cx="12" cy="12" r="9" />
                        <polyline points="12 7 12 12 15 15" />
                      </svg>
                      Feedback soumis le {{ formatDate(feedback.feedbackSubmittedAt) }}
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
import { ref, onMounted } from 'vue';
import gql from 'graphql-tag';
import PageHeader from '@/components/PageHeader.vue';
import Loader from '@/components/Loader.vue';
import { useToast } from '@/composables/useToast';
import { sendGraphQLRequest } from '../../api/graphql.api';

const { showToast } = useToast();

const loadingCompanies = ref(false);
const loadingFeedbacks = ref(false);
const companies = ref<any[]>([]);
const feedbacks = ref<any[]>([]);
const selectedCompany = ref<any>(null);

const getUserName = (user: any) => {
  if (!user) return 'N/A';
  const name = `${user.firstname || ''} ${user.lastname || ''}`.trim();
  return name || user.email;
};

const formatDate = (date: string | Date) => {
  if (!date) return 'N/A';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';
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

const getFeedbackDecisionLabel = (decision: string) => {
  switch (decision) {
    case 'interested':
      return 'Intéressé(e)';
    case 'not_interested':
      return 'Pas intéressé(e)';
    case 'maybe':
      return 'Peut-être';
    default:
      return decision;
  }
};

const getFeedbackDecisionClass = (decision: string) => {
  switch (decision) {
    case 'interested':
      return 'bg-success';
    case 'not_interested':
      return 'bg-danger';
    case 'maybe':
      return 'bg-warning';
    default:
      return 'bg-secondary';
  }
};

const loadCompanies = async () => {
  loadingCompanies.value = true;
  try {
    const query = gql`
      query GetCompaniesWithFeedbacks {
        getCompaniesWithFeedbacks {
          id
          company_name
          logo {
            id
            fileUrl
          }
          feedbackCount
        }
      }
    `;

    const response = await sendGraphQLRequest('matching-profile', query);
    
    if (response.data?.getCompaniesWithFeedbacks) {
      companies.value = response.data.getCompaniesWithFeedbacks
        .filter((c: any) => c.feedbackCount > 0)
        .sort((a: any, b: any) => b.feedbackCount - a.feedbackCount);
    }
  } catch (error) {
    console.error('Error loading companies:', error);
    showToast('Erreur lors du chargement des entreprises', 'error');
  } finally {
    loadingCompanies.value = false;
  }
};

const loadFeedbacks = async (companyId: string) => {
  loadingFeedbacks.value = true;
  try {
    const query = gql`
      query GetCompanyFeedbacks($companyId: ID!) {
        getCompanyFeedbacks(companyId: $companyId) {
          id
          appointmentDate
          candidateFeedback
          candidateDecision
          candidateRating
          feedbackSubmittedAt
          user {
            id
            email
            firstname
            lastname
          }
        }
      }
    `;

    const response = await sendGraphQLRequest('matching-profile', query, { companyId });
    
    if (response.data?.getCompanyFeedbacks) {
      feedbacks.value = response.data.getCompanyFeedbacks;
    }
  } catch (error) {
    console.error('Error loading feedbacks:', error);
    showToast('Erreur lors du chargement des feedbacks', 'error');
  } finally {
    loadingFeedbacks.value = false;
  }
};

const selectCompany = (company: any) => {
  selectedCompany.value = company;
  loadFeedbacks(company.id);
};

onMounted(() => {
  loadCompanies();
});
</script>

<style scoped>
.feedback-page {
  height: auto !important;
  overflow: visible !important;
}

.list-group-item.active {
  background-color: var(--tblr-primary);
  border-color: var(--tblr-primary);
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.star {
  font-size: 1.25rem;
  color: #ddd;
}

.star.filled {
  color: #ffc107;
}

.space-y-3 > * + * {
  margin-top: 1rem;
}
</style>
