import { api } from '@/views/dashboard-module/api'
import type { Wallet, WalletTransaction, WithdrawalRequest } from '../stores/wallet.store'

export const walletApi = {
  // Récupérer le portefeuille du consultant connecté
  getWallet: () => {
    return api.get<Wallet>('/wallet')
  },

  // Récupérer l'historique des transactions
  getTransactions: (params?: {
    type?: string
    source?: string
    limit?: number
    offset?: number
  }) => {
    return api.get<WalletTransaction[]>('/wallet/transactions', { params })
  },

  // Demander un retrait
  requestWithdrawal: (data: WithdrawalRequest) => {
    return api.post('/wallet/withdrawal', data)
  },

  // Récupérer les statistiques du portefeuille
  getWalletStats: () => {
    return api.get('/wallet/stats')
  },

  // Récupérer l'historique des retraits
  getWithdrawals: () => {
    return api.get('/wallet/withdrawals')
  },

  // Configurer le compte Stripe
  setupStripeAccount: () => {
    return api.post('/wallet/stripe/setup')
  }
}