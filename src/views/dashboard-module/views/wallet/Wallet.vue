<template>
  <div class="container-xl">
    <!-- Page header -->
    <div class="page-header d-print-none">
      <div class="container-xl">
        <div class="row g-2 align-items-center">
          <div class="col">
            <h2 class="page-title">
              <i class="bi bi-wallet2 me-2"></i>
              Mon Portefeuille
            </h2>
            <div class="text-muted">Gérez vos gains et demandes de retrait</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Page body -->
    <div class="page-body">
      <div class="container-xl">
        <!-- Cartes de résumé -->
        <div class="row row-deck row-cards mb-4">
          <div class="col-sm-6 col-lg-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="subheader">Solde disponible</div>
                </div>
                <div class="h1 mb-3 text-success">
                  {{ formatCurrency(wallet?.balance || 0) }}
                </div>
                <div class="d-flex mb-2">
                  <div class="text-muted">Prêt pour retrait</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-sm-6 col-lg-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="subheader">En attente</div>
                </div>
                <div class="h1 mb-3 text-warning">
                  {{ formatCurrency(wallet?.pendingBalance || 0) }}
                </div>
                <div class="d-flex mb-2">
                  <div class="text-muted">Réservations non validées</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-sm-6 col-lg-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="subheader">Total des gains</div>
                </div>
                <div class="h1 mb-3 text-primary">
                  {{ formatCurrency(wallet?.totalEarnings || 0) }}
                </div>
                <div class="d-flex mb-2">
                  <div class="text-muted">Depuis le début</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-sm-6 col-lg-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="subheader">Retraits ce mois</div>
                </div>
                <div class="h1 mb-3">
                  {{ formatCurrency(monthlyWithdrawals) }}
                </div>
                <div class="d-flex mb-2">
                  <div class="text-muted">{{ new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Demande de retrait -->
          <div class="col-md-4">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">
                  <i class="bi bi-arrow-down-circle me-2"></i>
                  Demander un retrait
                </h3>
              </div>
              <div class="card-body">
                <form @submit.prevent="requestWithdrawal">
                  <div class="mb-3">
                    <label class="form-label">Montant à retirer</label>
                    <div class="input-group">
                      <input
                        type="number"
                        class="form-control"
                        v-model="withdrawalForm.amount"
                        :max="wallet?.balance || 0"
                        min="10"
                        step="0.01"
                        placeholder="0.00"
                        required
                      />
                      <span class="input-group-text">€</span>
                    </div>
                    <div class="form-hint">
                      Montant minimum : 10€<br>
                      Disponible : {{ formatCurrency(wallet?.balance || 0) }}
                    </div>
                  </div>
                  
                  <div class="mb-3">
                    <label class="form-label">Méthode de paiement</label>
                    <select class="form-select" v-model="withdrawalForm.method" required>
                      <option value="">Sélectionner...</option>
                      <option value="bank_transfer">Virement bancaire</option>
                      <option value="paypal">PayPal</option>
                      <option value="stripe">Stripe</option>
                    </select>
                  </div>
                  
                  <div class="mb-3" v-if="withdrawalForm.method === 'bank_transfer'">
                    <label class="form-label">IBAN</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="withdrawalForm.iban"
                      placeholder="FR76 1234 5678 9012 3456 7890 123"
                      :required="withdrawalForm.method === 'bank_transfer'"
                    />
                  </div>
                  
                  <div class="mb-3" v-if="withdrawalForm.method === 'paypal'">
                    <label class="form-label">Email PayPal</label>
                    <input
                      type="email"
                      class="form-control"
                      v-model="withdrawalForm.paypalEmail"
                      placeholder="votre@email.com"
                      :required="withdrawalForm.method === 'paypal'"
                    />
                  </div>
                  
                  <div class="mb-3" v-if="withdrawalForm.method === 'stripe'">
                    <label class="form-label">Email Stripe</label>
                    <input
                      type="email"
                      class="form-control"
                      v-model="withdrawalForm.stripeEmail"
                      placeholder="votre@email.com"
                      :required="withdrawalForm.method === 'stripe'"
                    />
                    <div class="form-hint">
                      Email associé à votre compte Stripe Express
                    </div>
                    <button
                      type="button"
                      class="btn btn-outline-primary btn-sm mt-2"
                      @click="setupStripeAccount"
                    >
                      <i class="bi bi-stripe me-1"></i>
                      Configurer Stripe
                    </button>
                  </div>
                  
                  <div class="mb-3">
                    <label class="form-label">Note (optionnel)</label>
                    <textarea
                      class="form-control"
                      v-model="withdrawalForm.note"
                      rows="2"
                      placeholder="Informations complémentaires..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    class="btn btn-primary w-100"
                    :disabled="loading || !wallet?.balance || wallet.balance < 10"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    Demander le retrait
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- Historique des transactions -->
          <div class="col-md-8">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">
                  <i class="bi bi-clock-history me-2"></i>
                  Historique des transactions
                </h3>
                <div class="card-actions">
                  <select class="form-select form-select-sm" v-model="transactionFilter">
                    <option value="">Toutes les transactions</option>
                    <option value="credit">Crédits</option>
                    <option value="debit">Débits</option>
                    <option value="pending">En attente</option>
                    <option value="withdrawal">Retraits</option>
                  </select>
                </div>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-vcenter">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Montant</th>
                        <th>Solde</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="transaction in filteredTransactions" :key="transaction.id">
                        <td>
                          <div class="text-muted">
                            {{ formatDate(transaction.createdAt) }}
                          </div>
                        </td>
                        <td>
                          <span class="badge" :class="getTransactionTypeClass(transaction.type)">
                            {{ getTransactionTypeLabel(transaction.type) }}
                          </span>
                        </td>
                        <td>
                          <div>{{ transaction.description }}</div>
                          <div class="text-muted small" v-if="transaction.reference">
                            Réf: {{ transaction.reference }}
                          </div>
                        </td>
                        <td>
                          <span :class="transaction.amount >= 0 ? 'text-success' : 'text-danger'">
                            {{ transaction.amount >= 0 ? '+' : '' }}{{ formatCurrency(transaction.amount) }}
                          </span>
                        </td>
                        <td>
                          {{ formatCurrency(transaction.balanceAfter) }}
                        </td>
                        <td>
                          <span class="badge" :class="getTransactionStatusClass(transaction.type)">
                            {{ getTransactionStatusLabel(transaction.type) }}
                          </span>
                        </td>
                      </tr>
                      <tr v-if="!transactions.length">
                        <td colspan="6" class="text-center text-muted py-4">
                          Aucune transaction trouvée
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWalletStore } from './stores/wallet.store'
import { useToast } from '@/composables/useToast'

const walletStore = useWalletStore()
const { showToast } = useToast()

const loading = ref(false)
const transactionFilter = ref('')

const withdrawalForm = ref({
  amount: null as number | null,
  method: '',
  iban: '',
  paypalEmail: '',
  stripeEmail: '',
  note: ''
})

const wallet = computed(() => walletStore.wallet)
const transactions = computed(() => walletStore.transactions)

const filteredTransactions = computed(() => {
  if (!transactionFilter.value) return transactions.value
  
  return transactions.value.filter(transaction => {
    if (transactionFilter.value === 'withdrawal') {
      return transaction.source === 'withdrawal'
    }
    return transaction.type === transactionFilter.value
  })
})

const monthlyWithdrawals = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  return transactions.value
    .filter(t => {
      const transactionDate = new Date(t.createdAt)
      return t.source === 'withdrawal' && 
             transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTransactionTypeClass = (type: string) => {
  const classes = {
    credit: 'badge-success',
    debit: 'badge-danger',
    pending: 'badge-warning',
    cancelled: 'badge-secondary'
  }
  return classes[type as keyof typeof classes] || 'badge-secondary'
}

const getTransactionTypeLabel = (type: string) => {
  const labels = {
    credit: 'Crédit',
    debit: 'Débit',
    pending: 'En attente',
    cancelled: 'Annulé'
  }
  return labels[type as keyof typeof labels] || type
}

const getTransactionStatusClass = (type: string) => {
  const classes = {
    credit: 'badge-success-lt',
    debit: 'badge-danger-lt',
    pending: 'badge-warning-lt',
    cancelled: 'badge-secondary-lt'
  }
  return classes[type as keyof typeof classes] || 'badge-secondary-lt'
}

const getTransactionStatusLabel = (type: string) => {
  const labels = {
    credit: 'Confirmé',
    debit: 'Traité',
    pending: 'En attente',
    cancelled: 'Annulé'
  }
  return labels[type as keyof typeof labels] || 'Inconnu'
}

const setupStripeAccount = async () => {
  try {
    const response = await walletStore.setupStripeAccount()
    
    if (response.onboardingUrl) {
      // Ouvrir l'onboarding Stripe dans un nouvel onglet
      window.open(response.onboardingUrl, '_blank')
      showToast('Redirection vers Stripe pour configurer votre compte', 'info')
    } else {
      showToast(response.message || 'Compte Stripe configuré', 'success')
    }
  } catch (error: any) {
    showToast(error.message || 'Erreur lors de la configuration Stripe', 'error')
  }
}

const requestWithdrawal = async () => {
  if (!withdrawalForm.value.amount || withdrawalForm.value.amount < 10) {
    showToast('Le montant minimum est de 10€', 'error')
    return
  }
  
  if (withdrawalForm.value.amount > (wallet.value?.balance || 0)) {
    showToast('Montant supérieur au solde disponible', 'error')
    return
  }
  
  loading.value = true
  
  try {
    await walletStore.requestWithdrawal(withdrawalForm.value)
    showToast('Demande de retrait envoyée avec succès', 'success')
    
    // Reset form
    withdrawalForm.value = {
      amount: null,
      method: '',
      iban: '',
      paypalEmail: '',
      stripeEmail: '',
      note: ''
    }
    
    // Refresh data
    await walletStore.fetchWallet()
    await walletStore.fetchTransactions()
  } catch (error: any) {
    showToast(error.message || 'Erreur lors de la demande de retrait', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await walletStore.fetchWallet()
  await walletStore.fetchTransactions()
})
</script>

<style scoped>
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.h1 {
  font-weight: 600;
}

.badge {
  font-size: 0.75rem;
}

.table th {
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

.form-hint {
  font-size: 0.875rem;
  color: #6c757d;
}
</style>