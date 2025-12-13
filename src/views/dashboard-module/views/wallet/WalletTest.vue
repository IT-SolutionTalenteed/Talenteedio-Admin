<template>
  <div class="container-xl">
    <div class="page-header">
      <h2 class="page-title">Test Portefeuille</h2>
    </div>
    
    <div class="page-body">
      <div class="card">
        <div class="card-body">
          <h3>Test de l'API Portefeuille</h3>
          <button @click="testWalletAPI" class="btn btn-primary">Tester l'API</button>
          
          <div v-if="result" class="mt-3">
            <h4>Résultat :</h4>
            <pre>{{ JSON.stringify(result, null, 2) }}</pre>
          </div>
          
          <div v-if="error" class="mt-3 alert alert-danger">
            <h4>Erreur :</h4>
            <pre>{{ error }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { walletApi } from './api/wallet.api'

const result = ref(null)
const error = ref(null)

const testWalletAPI = async () => {
  try {
    error.value = null
    result.value = null
    
    console.log('Testing wallet API...')
    const response = await walletApi.getWallet()
    result.value = response.data
    console.log('Wallet API response:', response.data)
  } catch (err: any) {
    error.value = err.message || 'Erreur inconnue'
    console.error('Wallet API error:', err)
  }
}
</script>