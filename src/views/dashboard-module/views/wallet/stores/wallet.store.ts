import { defineStore } from 'pinia'
import { ref } from 'vue'
import { walletApi } from '../api/wallet.api'

export interface Wallet {
  id: string
  consultantId: string
  balance: number
  pendingBalance: number
  totalEarnings: number
  currency: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WalletTransaction {
  id: string
  walletId: string
  bookingId?: string
  type: 'credit' | 'debit' | 'pending' | 'cancelled'
  source: 'booking' | 'withdrawal' | 'refund' | 'adjustment'
  amount: number
  balanceAfter: number
  currency: string
  description?: string
  reference?: string
  metadata?: Record<string, any>
  createdAt: string
}

export interface WithdrawalRequest {
  amount: number
  method: 'bank_transfer' | 'paypal'
  iban?: string
  paypalEmail?: string
  note?: string
}

export const useWalletStore = defineStore('wallet', () => {
  const wallet = ref<Wallet | null>(null)
  const transactions = ref<WalletTransaction[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchWallet = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await walletApi.getWallet()
      wallet.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement du portefeuille'
      console.error('Error fetching wallet:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchTransactions = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await walletApi.getTransactions()
      transactions.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des transactions'
      console.error('Error fetching transactions:', err)
    } finally {
      loading.value = false
    }
  }

  const requestWithdrawal = async (withdrawalData: WithdrawalRequest) => {
    loading.value = true
    error.value = null
    
    try {
      await walletApi.requestWithdrawal(withdrawalData)
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la demande de retrait'
      throw err
    } finally {
      loading.value = false
    }
  }

  const setupStripeAccount = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await walletApi.setupStripeAccount()
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la configuration Stripe'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTransactionsByType = (type: string) => {
    return transactions.value.filter(transaction => transaction.type === type)
  }

  const getTransactionsBySource = (source: string) => {
    return transactions.value.filter(transaction => transaction.source === source)
  }

  const getTotalByType = (type: string) => {
    return transactions.value
      .filter(transaction => transaction.type === type)
      .reduce((sum, transaction) => sum + transaction.amount, 0)
  }

  const getMonthlyWithdrawals = (month?: number, year?: number) => {
    const targetMonth = month ?? new Date().getMonth()
    const targetYear = year ?? new Date().getFullYear()
    
    return transactions.value
      .filter(transaction => {
        const transactionDate = new Date(transaction.createdAt)
        return transaction.source === 'withdrawal' && 
               transactionDate.getMonth() === targetMonth && 
               transactionDate.getFullYear() === targetYear
      })
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0)
  }

  return {
    // State
    wallet,
    transactions,
    loading,
    error,
    
    // Actions
    fetchWallet,
    fetchTransactions,
    requestWithdrawal,
    setupStripeAccount,
    
    // Getters
    getTransactionsByType,
    getTransactionsBySource,
    getTotalByType,
    getMonthlyWithdrawals
  }
})